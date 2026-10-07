import type { PlannedQuestion } from '#/lib/quiz-plan'
import type { Answer } from '#/lib/quiz-state'
import type { ExamConfig, Quiz } from '#/quizzes/types'
import { buildQuizPlan } from '#/lib/quiz-plan'
import { buildAnswers } from '#/lib/quiz-state'
import { getCorrectIndexes, isMultipleAnswer } from '#/quizzes/question'

/*
 * Mock exam state. Unlike practice there is no feedback: every pick stays
 * editable and the user moves freely until the exam is submitted. Kept pure
 * (the clock is passed in, never read here) so it can be saved and restored.
 */

export interface ExamState {
  plan: ReadonlyArray<PlannedQuestion>
  /**
   * Original indexes picked per plan index. Can be incomplete for a
   * multiple-answer question (fewer picks than required).
   */
  picks: ReadonlyArray<ReadonlyArray<number>>
  /** Plan indexes the user flagged for review. */
  flagged: ReadonlyArray<number>
  /** Question being shown (or the one "Back to questions" returns to). */
  current: number
  /** Showing the review screen instead of a question. */
  reviewing: boolean
  /** Final: picks are locked and the results are shown. */
  submitted: boolean
  /** Epoch ms. Timestamps, so a throttled background tab stays accurate. */
  startedAt: number
  endsAt: number
}

export type ExamAction =
  /** Single answer: replaces the pick. Multiple answers: adds or removes it. */
  | { type: 'toggle'; originalIndex: number }
  | { type: 'goto'; index: number }
  | { type: 'prev' }
  /** Moves on; after the last question it opens the review screen. */
  | { type: 'next' }
  | { type: 'review' }
  /** Leaves the review screen for the current question. */
  | { type: 'back' }
  /** Flags or unflags the current question. */
  | { type: 'flag' }
  /** Ends the exam now (user or timeout). Unanswered questions count as wrong. */
  | { type: 'submit' }
  | { type: 'restart'; state: ExamState }

export type QuestionStatus = 'answered' | 'incomplete' | 'unanswered'

export function createExamState(
  plan: ReadonlyArray<PlannedQuestion>,
  startedAt: number,
  minutes: number,
): ExamState {
  return {
    plan,
    picks: plan.map(() => []),
    flagged: [],
    current: 0,
    reviewing: false,
    submitted: false,
    startedAt,
    endsAt: startedAt + minutes * 60_000,
  }
}

/** A fresh random exam starting now. Not pure: client only, never in a reducer. */
export function startExam(quiz: Quiz, exam: ExamConfig): ExamState {
  return createExamState(
    buildQuizPlan(quiz, exam.questionCount),
    Date.now(),
    exam.minutes,
  )
}

export function examReducer(state: ExamState, action: ExamAction): ExamState {
  if (action.type === 'restart') return action.state
  // Everything is locked once submitted.
  if (state.submitted) return state

  switch (action.type) {
    case 'toggle': {
      const item = state.plan.at(state.current)
      if (!item || state.reviewing) return state
      const { originalIndex } = action
      const pick = state.picks[state.current]
      let updated: ReadonlyArray<number>
      if (!isMultipleAnswer(item.question)) {
        updated = [originalIndex]
      } else if (pick.includes(originalIndex)) {
        updated = pick.filter((i) => i !== originalIndex)
      } else if (pick.length >= getCorrectIndexes(item.question).length) {
        // Ignore further picks once the required number is reached.
        return state
      } else {
        updated = [...pick, originalIndex]
      }
      return {
        ...state,
        picks: state.picks.map((existing, i) =>
          i === state.current ? updated : existing,
        ),
      }
    }
    case 'goto':
      if (!isValidIndex(state, action.index)) return state
      return { ...state, current: action.index, reviewing: false }
    case 'prev':
      if (state.current === 0) return state
      return { ...state, current: state.current - 1 }
    case 'next':
      if (state.current >= state.plan.length - 1) {
        return { ...state, reviewing: true }
      }
      return { ...state, current: state.current + 1 }
    case 'review':
      return { ...state, reviewing: true }
    case 'back':
      return { ...state, reviewing: false }
    case 'flag':
      return {
        ...state,
        flagged: state.flagged.includes(state.current)
          ? state.flagged.filter((i) => i !== state.current)
          : [...state.flagged, state.current],
      }
    case 'submit':
      return { ...state, submitted: true, reviewing: false }
  }
}

function isValidIndex(state: ExamState, index: number): boolean {
  return Number.isInteger(index) && index >= 0 && index < state.plan.length
}

export function getStatus(state: ExamState, index: number): QuestionStatus {
  const item = state.plan.at(index)
  const picked = state.picks.at(index)?.length ?? 0
  if (!item || picked === 0) return 'unanswered'
  return picked === getCorrectIndexes(item.question).length
    ? 'answered'
    : 'incomplete'
}

export function getStatuses(state: ExamState): Array<QuestionStatus> {
  return state.plan.map((_, index) => getStatus(state, index))
}

export interface ExamCounts {
  answered: number
  /** Includes incomplete multiple-answer picks, which score as wrong. */
  unanswered: number
  flagged: number
}

export function getCounts(state: ExamState): ExamCounts {
  const answered = getStatuses(state).filter((s) => s === 'answered').length
  return {
    answered,
    unanswered: state.plan.length - answered,
    flagged: state.flagged.length,
  }
}

/** Every planned question; unanswered and incomplete ones are wrong. */
export function getAnswers(state: ExamState): Array<Answer> {
  return buildAnswers(state.plan, state.picks, state.flagged)
}

export function getScore(state: ExamState): number {
  return getAnswers(state).filter((answer) => answer.correct).length
}

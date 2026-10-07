import type { PlannedQuestion } from '#/lib/quiz-plan'
import {
  getCorrectIndexes,
  isAnswerCorrect,
  isMultipleAnswer,
} from '#/quizzes/question'

/**
 * How one pass through a plan behaves. Fixed for the round's lifetime. Every
 * round here gives immediate feedback; the timed mock exam has its own state
 * (see ./exam-state).
 */
export interface Round {
  /**
   * Retry of a subset of questions (e.g. only the incorrect ones). Its score
   * is not comparable to a full run, so it is never saved as progress.
   */
  subset: boolean
}

export interface QuizState {
  plan: ReadonlyArray<PlannedQuestion>
  round: Round
  /** Index into `plan`. Equals `plan.length` once the quiz is finished. */
  current: number
  /** Original indexes picked so far for the current multiple-answer question. */
  draft: ReadonlyArray<number>
  /**
   * Submitted picks (original indexes) for `plan[0..answers.length)`. The
   * current question counts as answered iff `answers.length > current`.
   */
  answers: ReadonlyArray<ReadonlyArray<number>>
  /** Plan indexes the user flagged for review. */
  flagged: ReadonlyArray<number>
}

export type QuizAction =
  /** Single answer: locks the pick. Multiple answers: adds or removes it. */
  | { type: 'toggle'; originalIndex: number }
  /** Multiple answers: submits the draft once it has the required size. */
  | { type: 'check' }
  /** Moves past the answered question. */
  | { type: 'next' }
  /** Flags or unflags the current question. */
  | { type: 'flag' }
  /** The plan is passed in so the reducer stays pure (shuffling is random). */
  | { type: 'retry'; plan: ReadonlyArray<PlannedQuestion>; round: Round }

export interface Answer {
  /** Position in the plan. */
  index: number
  item: PlannedQuestion
  /** Original indexes of the options the user picked (empty if unanswered). */
  chosen: ReadonlyArray<number>
  correct: boolean
  flagged: boolean
}

export function createInitialState(
  plan: ReadonlyArray<PlannedQuestion>,
  round: Round,
): QuizState {
  return { plan, round, current: 0, draft: [], answers: [], flagged: [] }
}

export function quizReducer(state: QuizState, action: QuizAction): QuizState {
  const item = getCurrentItem(state)

  switch (action.type) {
    case 'toggle': {
      if (!item || isSubmitted(state)) return state
      const { originalIndex } = action
      if (!isMultipleAnswer(item.question)) {
        return { ...state, answers: [...state.answers, [originalIndex]] }
      }
      if (state.draft.includes(originalIndex)) {
        return {
          ...state,
          draft: state.draft.filter((i) => i !== originalIndex),
        }
      }
      // Ignore further picks once the required number is reached.
      if (state.draft.length >= getCorrectIndexes(item.question).length) {
        return state
      }
      return { ...state, draft: [...state.draft, originalIndex] }
    }
    case 'check':
      if (!canCheck(state)) return state
      return { ...state, draft: [], answers: [...state.answers, state.draft] }
    case 'next':
      if (!isSubmitted(state)) return state
      return { ...state, current: state.current + 1, draft: [] }
    case 'flag': {
      if (!item) return state
      const { current } = state
      return {
        ...state,
        flagged: state.flagged.includes(current)
          ? state.flagged.filter((i) => i !== current)
          : [...state.flagged, current],
      }
    }
    case 'retry':
      return createInitialState(action.plan, action.round)
  }
}

/** Undefined once every question has been answered and moved past. */
export function getCurrentItem(state: QuizState): PlannedQuestion | undefined {
  return state.plan.at(state.current)
}

export function isFinished(state: QuizState): boolean {
  return state.current >= state.plan.length
}

export function isSubmitted(state: QuizState): boolean {
  return state.answers.length > state.current
}

/** Picks to show for the current question: the submitted ones, else the draft. */
export function getSelected(state: QuizState): ReadonlyArray<number> {
  return state.answers.at(state.current) ?? state.draft
}

export function isFlagged(state: QuizState): boolean {
  return state.flagged.includes(state.current)
}

/** A multiple-answer draft has exactly as many picks as there are answers. */
export function canCheck(state: QuizState): boolean {
  const item = getCurrentItem(state)
  return (
    item !== undefined &&
    !isSubmitted(state) &&
    isMultipleAnswer(item.question) &&
    state.draft.length === getCorrectIndexes(item.question).length
  )
}

/** Answered questions so far (all of them once the round is finished). */
export function getAnswers(state: QuizState): Array<Answer> {
  return buildAnswers(
    state.plan.slice(0, state.answers.length),
    state.answers,
    state.flagged,
  )
}

/**
 * Scores `plan[i]` against `picks[i]` (a missing pick is an empty, wrong
 * answer). Shared with the exam state.
 */
export function buildAnswers(
  plan: ReadonlyArray<PlannedQuestion>,
  picks: ReadonlyArray<ReadonlyArray<number>>,
  flagged: ReadonlyArray<number>,
): Array<Answer> {
  return plan.map((item, index) => {
    const chosen = picks.at(index) ?? []
    return {
      index,
      item,
      chosen,
      correct: isAnswerCorrect(item.question, chosen),
      flagged: flagged.includes(index),
    }
  })
}

export function getScore(state: QuizState): number {
  return getAnswers(state).filter((answer) => answer.correct).length
}

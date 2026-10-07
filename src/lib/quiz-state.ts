import type { PlannedQuestion } from '#/lib/quiz-plan'
import {
  getCorrectIndexes,
  isAnswerCorrect,
  isMultipleAnswer,
} from '#/quizzes/question'

/** How one pass through a plan behaves. Fixed for the round's lifetime. */
export interface Round {
  /**
   * Exam round: no feedback, picks stay changeable until "Next" submits and
   * advances. Otherwise the answer is checked and explained immediately.
   */
  exam: boolean
  /**
   * Retry of a subset of questions (e.g. only the incorrect ones). Its score
   * is not comparable to a full run, so it is never saved as progress.
   */
  subset: boolean
  /** Exam only: deadline as epoch ms. A timestamp, so throttled tabs stay accurate. */
  endsAt?: number
}

export interface QuizState {
  plan: ReadonlyArray<PlannedQuestion>
  round: Round
  /** Index into `plan`. Equals `plan.length` once the quiz is finished. */
  current: number
  /**
   * Original indexes picked so far for the current question: the draft of a
   * multiple-answer question, or the changeable pick of an exam question.
   */
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
  /**
   * Practice single answer: locks the pick. Exam single answer: replaces the
   * pick. Multiple answers: adds or removes it.
   */
  | { type: 'toggle'; originalIndex: number }
  /** Practice multiple answers: submits the draft once it has the required size. */
  | { type: 'check' }
  /** Practice: moves past the answered question. Exam: submits the draft and moves on. */
  | { type: 'next' }
  /** Exam: ends the round now. Unanswered questions count as wrong. */
  | { type: 'finish' }
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
        if (state.round.exam) return { ...state, draft: [originalIndex] }
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
      if (state.round.exam || !canCheck(state)) return state
      return { ...state, draft: [], answers: [...state.answers, state.draft] }
    case 'next':
      if (state.round.exam) {
        if (!canCheck(state)) return state
        return {
          ...state,
          current: state.current + 1,
          draft: [],
          answers: [...state.answers, state.draft],
        }
      }
      if (!isSubmitted(state)) return state
      return { ...state, current: state.current + 1, draft: [] }
    case 'finish': {
      if (!item) return state
      // A complete pick that was not yet submitted still counts.
      const answers = canCheck(state)
        ? [...state.answers, state.draft]
        : state.answers
      return { ...state, current: state.plan.length, draft: [], answers }
    }
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

/**
 * The draft has exactly as many picks as there are answers. Single-answer
 * questions only have a draft in exam mode (one changeable pick).
 */
export function canCheck(state: QuizState): boolean {
  const item = getCurrentItem(state)
  return (
    item !== undefined &&
    !isSubmitted(state) &&
    (isMultipleAnswer(item.question) || state.round.exam) &&
    state.draft.length === getCorrectIndexes(item.question).length
  )
}

/**
 * Answered questions so far; once the round is finished, every planned
 * question (the ones never answered, e.g. on timeout, are wrong).
 */
export function getAnswers(state: QuizState): Array<Answer> {
  const count = isFinished(state) ? state.plan.length : state.answers.length
  return state.plan.slice(0, count).map((item, index) => {
    const chosen = state.answers.at(index) ?? []
    return {
      index,
      item,
      chosen,
      correct: isAnswerCorrect(item.question, chosen),
      flagged: state.flagged.includes(index),
    }
  })
}

export function getScore(state: QuizState): number {
  return getAnswers(state).filter((answer) => answer.correct).length
}

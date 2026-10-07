import type { PlannedQuestion } from '#/lib/quiz-plan'
import {
  getCorrectIndexes,
  isAnswerCorrect,
  isMultipleAnswer,
} from '#/quizzes/question'

export interface QuizState {
  plan: ReadonlyArray<PlannedQuestion>
  /** Index into `plan`. Equals `plan.length` once the quiz is finished. */
  current: number
  /** Multiple answers: original indexes picked so far for the current question. */
  draft: ReadonlyArray<number>
  /**
   * Submitted picks (original indexes) for `plan[0..answers.length)`. The
   * current question counts as answered iff `answers.length > current`.
   */
  answers: ReadonlyArray<ReadonlyArray<number>>
}

export type QuizAction =
  /** Single answer: locks the pick. Multiple answers: adds or removes it. */
  | { type: 'toggle'; originalIndex: number }
  /** Multiple answers: submits the draft once it has the required size. */
  | { type: 'check' }
  | { type: 'next' }
  /** The plan is passed in so the reducer stays pure (shuffling is random). */
  | { type: 'retry'; plan: ReadonlyArray<PlannedQuestion> }

export interface Answer {
  item: PlannedQuestion
  /** Original indexes of the options the user picked (one for single-answer). */
  chosen: ReadonlyArray<number>
  correct: boolean
}

export function createInitialState(
  plan: ReadonlyArray<PlannedQuestion>,
): QuizState {
  return { plan, current: 0, draft: [], answers: [] }
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
    case 'retry':
      return createInitialState(action.plan)
  }
}

/** Undefined once every question has been answered and moved past. */
export function getCurrentItem(state: QuizState): PlannedQuestion | undefined {
  return state.plan.at(state.current)
}

export function isSubmitted(state: QuizState): boolean {
  return state.answers.length > state.current
}

/** Picks to show for the current question: the submitted ones, else the draft. */
export function getSelected(state: QuizState): ReadonlyArray<number> {
  return state.answers.at(state.current) ?? state.draft
}

/** Multiple answers: the draft has exactly as many picks as there are answers. */
export function canCheck(state: QuizState): boolean {
  const item = getCurrentItem(state)
  return (
    item !== undefined &&
    !isSubmitted(state) &&
    isMultipleAnswer(item.question) &&
    state.draft.length === getCorrectIndexes(item.question).length
  )
}

export function getAnswers(state: QuizState): Array<Answer> {
  return state.answers.map((chosen, i) => {
    const item = state.plan[i]
    return { item, chosen, correct: isAnswerCorrect(item.question, chosen) }
  })
}

export function getScore(state: QuizState): number {
  return getAnswers(state).filter((answer) => answer.correct).length
}

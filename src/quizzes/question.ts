import type {
  MultipleAnswerQuestion,
  Question,
  SingleAnswerQuestion,
} from './types'

/*
 * The answer rules of a question, used by every mode (practice, the mock
 * exam on both sides, the validator). Options are referred to by their
 * original index (their place in `options`), never by display position.
 * Pure: relative imports only, so the domain modules can use it.
 */

/** What the answer rules need to know of a question. */
export interface AnswerKey {
  optionCount: number
  /** Original indexes of the correct options. */
  correct: ReadonlyArray<number>
}

export function isMultipleAnswer(
  question: Question,
): question is MultipleAnswerQuestion {
  return 'correctIndexes' in question
}

/** Original option indexes of all correct answers, in ascending order. */
export function getCorrectIndexes(question: Question): Array<number> {
  return isMultipleAnswer(question)
    ? [...question.correctIndexes].sort((a, b) => a - b)
    : [question.correctIndex]
}

/**
 * The question with these correct options: single-answer for one index,
 * multiple-answer for more.
 */
export function withCorrectIndexes(
  base: Omit<SingleAnswerQuestion, 'correctIndex'>,
  correct: ReadonlyArray<number>,
): Question {
  return correct.length === 1
    ? { ...base, correctIndex: correct[0] }
    : { ...base, correctIndexes: [...correct] }
}

export function answerKey(question: Question): AnswerKey {
  return {
    optionCount: question.options.length,
    correct: getCorrectIndexes(question),
  }
}

export function isUnique(values: ReadonlyArray<number>): boolean {
  return new Set(values).size === values.length
}

/** A whole number usable as an index into `count` items. */
export function isIndex(value: number, count: number): boolean {
  return Number.isInteger(value) && value >= 0 && value < count
}

/** `order` shows each of the `count` options exactly once. */
export function isPermutation(
  order: ReadonlyArray<number>,
  count: number,
): boolean {
  return (
    order.length === count &&
    isUnique(order) &&
    order.every((i) => isIndex(i, count))
  )
}

/**
 * Whether `pick` could have come from toggling options: distinct options that
 * exist, and no more than the number of correct answers.
 */
export function isLegalPick(
  key: AnswerKey,
  pick: ReadonlyArray<number>,
): boolean {
  return (
    isUnique(pick) &&
    pick.length <= key.correct.length &&
    pick.every((i) => isIndex(i, key.optionCount))
  )
}

/** All-or-nothing: correct only if exactly the correct options are picked. */
export function isCorrectPick(
  correct: ReadonlyArray<number>,
  pick: ReadonlyArray<number>,
): boolean {
  return (
    pick.length === correct.length && correct.every((i) => pick.includes(i))
  )
}

/** Exactly as many options picked as the question has correct answers. */
export function isCompletePick(
  question: Question,
  pick: ReadonlyArray<number>,
): boolean {
  return pick.length === getCorrectIndexes(question).length
}

export function isAnswerCorrect(
  question: Question,
  chosen: ReadonlyArray<number>,
): boolean {
  return isCorrectPick(getCorrectIndexes(question), chosen)
}

/**
 * The picks after toggling `originalIndex`. Single answer: just that option.
 * Multiple answers: adds or removes it; once the required number is picked
 * further options are ignored and `picks` itself is returned (so callers can
 * tell nothing changed).
 */
export function togglePick(
  question: Question,
  picks: ReadonlyArray<number>,
  originalIndex: number,
): ReadonlyArray<number> {
  if (!isMultipleAnswer(question)) return [originalIndex]
  if (picks.includes(originalIndex)) {
    return picks.filter((index) => index !== originalIndex)
  }
  if (picks.length >= getCorrectIndexes(question).length) return picks
  return [...picks, originalIndex]
}

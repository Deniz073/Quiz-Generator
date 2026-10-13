import type { MultipleAnswerQuestion, Question } from './types'

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

/** All-or-nothing: correct only if exactly the correct options are chosen. */
export function isAnswerCorrect(
  question: Question,
  chosen: ReadonlyArray<number>,
): boolean {
  const correct = getCorrectIndexes(question)
  return (
    chosen.length === correct.length &&
    correct.every((index) => chosen.includes(index))
  )
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

/**
 * Whether `pick` could have come from toggling options of `question`: distinct
 * options that exist, and no more than the number of answers.
 */
export function isValidPick(
  question: Question,
  pick: ReadonlyArray<number>,
): boolean {
  return (
    new Set(pick).size === pick.length &&
    pick.length <= getCorrectIndexes(question).length &&
    pick.every(
      (index) =>
        Number.isInteger(index) &&
        index >= 0 &&
        index < question.options.length,
    )
  )
}

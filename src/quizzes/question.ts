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

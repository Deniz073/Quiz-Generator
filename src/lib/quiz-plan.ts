import type { Question } from '#/quizzes/types'
import { shuffle } from './shuffle'

/**
 * A question plus the display order of its options.
 * `optionOrder[position]` is the ORIGINAL index of the option shown at that
 * position, so correctness is always compared against original indexes.
 */
export interface PlannedQuestion {
  question: Question
  optionOrder: Array<number>
}

/** Random question and option order. Call on the client only. */
export function buildShuffledPlan(
  questions: ReadonlyArray<Question>,
): Array<PlannedQuestion> {
  return shuffle(questions).map((question) => ({
    question,
    optionOrder: shuffle(question.options.map((_, i) => i)),
  }))
}

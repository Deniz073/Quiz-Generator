/*
 * Quiz data model. To add a quiz, create `src/quizzes/<quiz-id>/index.ts` that
 * `export default`s a `Quiz`; it is auto-discovered (see ./index.ts) and
 * checked by ./validate.ts (`npm run validate:quizzes`). See AGENTS.md.
 */

interface BaseQuestion {
  /** The question text. For multi-answer questions state the count, e.g. "Select two." */
  question: string
  /**
   * Answer options (usually 4; 2-6 allowed, no duplicate texts).
   * Order is shuffled at runtime, so it does not matter.
   */
  options: Array<string>
  /** Short explanation shown after answering (1-3 sentences). */
  explanation: string
}

/** Exactly one correct option. */
export interface SingleAnswerQuestion extends BaseQuestion {
  /** Index into `options` of the correct answer (0-based, in range). */
  correctIndex: number
}

/** Two or more correct options; the user must select all of them. */
export interface MultipleAnswerQuestion extends BaseQuestion {
  /**
   * Indexes into `options` of the correct answers: unique, in range, at least 2
   * and fewer than `options.length`.
   */
  correctIndexes: Array<number>
}

export type Question = SingleAnswerQuestion | MultipleAnswerQuestion

export interface Chapter {
  /** URL slug, unique within the quiz, e.g. "1-cloud-computing" (a-z, 0-9, hyphens). */
  id: string
  /** Chapter number shown in the UI; unique within the quiz. */
  number: number
  title: string
  /** At least one question. */
  questions: Array<Question>
}

export interface Quiz {
  /** URL slug, unique across all quizzes, e.g. "az-900" (a-z, 0-9, hyphens). Should match the folder name. */
  id: string
  title: string
  description: string
  /** At least one chapter. */
  chapters: Array<Chapter>
}

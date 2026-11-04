import type { Quiz } from './types'

/*
 * Size caps for quizzes users write themselves (the quiz assistant), checked
 * in the browser while editing and again by the server on Save. Seed quizzes
 * are not held to them.
 */

export const QUIZ_LIMITS = {
  chapters: 30,
  questions: 300,
  /** Title, description, chapter title, question and option texts. */
  textLength: 1000,
  explanationLength: 2000,
  /** Personal quizzes one user may own before the assistant creates no more. */
  personalQuizzes: 50,
} as const

function tooLong(text: string, max: number): boolean {
  return text.length > max
}

/** Human-readable cap violations; empty when within every cap. */
export function checkQuizLimits(quiz: Quiz): Array<string> {
  const errors: Array<string> = []
  const max = QUIZ_LIMITS.textLength
  if (tooLong(quiz.title, max)) errors.push(`title is over ${max} characters`)
  if (tooLong(quiz.description, max)) {
    errors.push(`description is over ${max} characters`)
  }
  if (quiz.chapters.length > QUIZ_LIMITS.chapters) {
    errors.push(`more than ${QUIZ_LIMITS.chapters} chapters`)
  }
  const total = quiz.chapters.reduce((sum, c) => sum + c.questions.length, 0)
  if (total > QUIZ_LIMITS.questions) {
    errors.push(`more than ${QUIZ_LIMITS.questions} questions`)
  }
  for (const chapter of quiz.chapters) {
    if (tooLong(chapter.title, max)) {
      errors.push(`chapter "${chapter.id}": title is over ${max} characters`)
    }
    for (const question of chapter.questions) {
      const where = `question "${question.id}"`
      if (tooLong(question.question, max)) {
        errors.push(`${where}: text is over ${max} characters`)
      }
      if (question.options.some((option) => tooLong(option, max))) {
        errors.push(`${where}: an option is over ${max} characters`)
      }
      if (tooLong(question.explanation, QUIZ_LIMITS.explanationLength)) {
        errors.push(
          `${where}: explanation is over ${QUIZ_LIMITS.explanationLength} characters`,
        )
      }
    }
  }
  return errors
}

import type { Quiz } from './types'

/*
 * Quizzes live in the database (see src/db/quiz-schema.ts and
 * src/lib/quiz-api.ts for loading them). The seed quizzes' content is kept in
 * src/db/seed/quizzes and written by `npm run db:seed`.
 */

export function countQuestions(quiz: Quiz): number {
  return quiz.chapters.reduce(
    (total, chapter) => total + chapter.questions.length,
    0,
  )
}

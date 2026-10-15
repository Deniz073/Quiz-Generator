import { notFound } from '@tanstack/react-router'
import type { Chapter, ExamConfig, Quiz } from '#/quizzes/types'
import { getQuiz } from '#/quizzes'

/*
 * What a route needs from its quiz params, for its loader. Each throws
 * `notFound()` for an unknown id (which, as the loader also runs on the server,
 * gives a real 404 status). The component reads the result with
 * `Route.useLoaderData()`, so it needs no `if (!quiz) return null`.
 */

export async function requireQuiz(quizId: string): Promise<Quiz> {
  const quiz = await getQuiz(quizId)
  if (!quiz) throw notFound()
  return quiz
}

export async function requireChapter(
  quizId: string,
  chapterId: string,
): Promise<{ quiz: Quiz; chapter: Chapter }> {
  const quiz = await requireQuiz(quizId)
  const chapter = quiz.chapters.find((c) => c.id === chapterId)
  if (!chapter) throw notFound()
  return { quiz, chapter }
}

/** The quiz and its mock exam settings; a quiz without them has no exam page. */
export async function requireExam(
  quizId: string,
): Promise<{ quiz: Quiz; exam: ExamConfig }> {
  const quiz = await requireQuiz(quizId)
  if (!quiz.exam) throw notFound()
  return { quiz, exam: quiz.exam }
}

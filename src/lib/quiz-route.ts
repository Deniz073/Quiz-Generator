import { notFound } from '@tanstack/react-router'
import type { Chapter, ExamConfig, Quiz } from '#/quizzes/types'
import { getChapter, getQuiz } from '#/quizzes'

/*
 * What a route needs from its quiz params. Each throws `notFound()` for an
 * unknown id, so the same call is the loader's 404 (which runs on the server
 * too, giving a real 404 status) and the component's narrowing: no
 * `if (!quiz) return null` after a loader that already checked.
 */

export function requireQuiz(quizId: string): Quiz {
  const quiz = getQuiz(quizId)
  if (!quiz) throw notFound()
  return quiz
}

export function requireChapter(
  quizId: string,
  chapterId: string,
): { quiz: Quiz; chapter: Chapter } {
  const quiz = requireQuiz(quizId)
  const chapter = getChapter(quizId, chapterId)
  if (!chapter) throw notFound()
  return { quiz, chapter }
}

/** The quiz and its mock exam settings; a quiz without them has no exam page. */
export function requireExam(quizId: string): { quiz: Quiz; exam: ExamConfig } {
  const quiz = requireQuiz(quizId)
  if (!quiz.exam) throw notFound()
  return { quiz, exam: quiz.exam }
}

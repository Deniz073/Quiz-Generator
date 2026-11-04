import { notFound } from '@tanstack/react-router'
import type { Chapter, ExamConfig, Question, Quiz } from '#/quizzes/types'
import { fetchQuiz } from '#/lib/quiz-api'

/*
 * What a route needs from its quiz params, for its loader. Each throws
 * `notFound()` for an unknown id or a quiz the user may not see; as the loader
 * also runs on the server, that gives a real 404 status. The component reads
 * the result with `Route.useLoaderData()`, so it needs no
 * `if (!quiz) return null`.
 */

/** How long the browser reuses a loaded quiz before asking the server again. */
const CLIENT_CACHE_MS = 5 * 60_000

const clientCache = new Map<
  string,
  { at: number; quiz: Promise<Quiz | null> }
>()

/**
 * The quiz, once per quiz for a while in the browser: every page of a quiz
 * (and every hover preload of one) needs all of it, and it rarely changes.
 * On the server always fresh.
 */
function loadQuiz(quizId: string): Promise<Quiz | null> {
  if (typeof window === 'undefined') return fetchQuiz({ data: { quizId } })
  const cached = clientCache.get(quizId)
  if (cached && Date.now() - cached.at < CLIENT_CACHE_MS) return cached.quiz
  const quiz = fetchQuiz({ data: { quizId } })
  clientCache.set(quizId, { at: Date.now(), quiz })
  // A failed load is not kept, so a retry asks again.
  quiz.catch(() => clientCache.delete(quizId))
  return quiz
}

/** Forgets loaded quizzes, e.g. on sign-out (personal quizzes are private). */
export function clearQuizCache(): void {
  clientCache.clear()
}

/** Forgets one loaded quiz, e.g. after the quiz assistant saved it. */
export function forgetQuiz(quizId: string): void {
  clientCache.delete(quizId)
}

export async function requireQuiz(quizId: string): Promise<Quiz> {
  const quiz = await loadQuiz(quizId)
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

/** A question by its id (stable, so shared links keep working) and its chapter. */
export async function requireQuestion(
  quizId: string,
  questionId: string,
): Promise<{ quiz: Quiz; chapter: Chapter; question: Question }> {
  const quiz = await requireQuiz(quizId)
  for (const chapter of quiz.chapters) {
    const question = chapter.questions.find((q) => q.id === questionId)
    if (question) return { quiz, chapter, question }
  }
  throw notFound()
}

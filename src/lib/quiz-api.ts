import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import type { Result } from '#/domain/progress'
import { findQuiz, listQuizHeaders } from '#/server/quiz-access'
import { getRequestUserId } from '#/server/request-user'
import { loadExamResults } from '#/server/user-state'

/*
 * Quiz content for route loaders. A quiz the caller can't see comes back as
 * null, exactly like one that doesn't exist (the route then shows a 404).
 * Thin on purpose: the rules are in #/server/quiz-access.
 */

/** What the home page shows of a quiz, without its questions. */
export interface QuizSummary {
  id: string
  title: string
  description: string
  /** False: a personal quiz of the user. */
  builtIn: boolean
  chapterCount: number
  questionCount: number
  /** The user's mock exam results, if any. */
  examResult?: Result
}

export const fetchQuiz = createServerFn({ method: 'GET' })
  .validator(z.object({ quizId: z.string().min(1).max(200) }))
  .handler(async ({ data }) => findQuiz(data.quizId, await getRequestUserId()))

/** The home page's list: built-in quizzes and the user's own. */
export const fetchQuizSummaries = createServerFn({ method: 'GET' }).handler(
  async (): Promise<Array<QuizSummary>> => {
    const userId = await getRequestUserId()
    const headers = await listQuizHeaders(userId)
    const results = userId
      ? await loadExamResults(
          userId,
          headers.map((h) => h.id),
        )
      : new Map<string, Result>()
    return headers.map(({ exam: _defaults, ...header }) => ({
      ...header,
      examResult: results.get(header.id),
    }))
  },
)

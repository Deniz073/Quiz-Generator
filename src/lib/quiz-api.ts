import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { idInput } from '#/lib/api-inputs'
import type { Result } from '#/domain/progress'
import {
  findQuiz,
  findQuizOutline,
  listQuizHeaders,
} from '#/server/quiz-access'
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
  /** A personal quiz imported from the Marketplace. */
  imported: boolean
  chapterCount: number
  questionCount: number
  /** The user's mock exam results, if any. */
  examResult?: Result
}

export const fetchQuiz = createServerFn({ method: 'GET' })
  .validator(z.object({ quizId: idInput }))
  .handler(async ({ data }) => findQuiz(data.quizId, await getRequestUserId()))

/** The quiz without its questions' content, for the quiz's own page. */
export const fetchQuizOutline = createServerFn({ method: 'GET' })
  .validator(z.object({ quizId: idInput }))
  .handler(async ({ data }) =>
    findQuizOutline(data.quizId, await getRequestUserId()),
  )

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
    return headers.map((header) => ({
      id: header.id,
      title: header.title,
      description: header.description,
      builtIn: header.builtIn,
      imported: header.imported,
      chapterCount: header.chapterCount,
      questionCount: header.questionCount,
      examResult: results.get(header.id),
    }))
  },
)

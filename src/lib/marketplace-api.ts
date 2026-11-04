import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import type { Quiz } from '#/quizzes/types'
import type { Listing, MarketplaceStanding } from '#/server/quiz-access'
import { canDelete, canPublish } from '#/domain/marketplace'
import {
  deleteOwnQuiz,
  findListing,
  findMarketplaceStanding,
  findPublishedQuiz,
  findQuizHeader,
  importPublishedQuiz,
  listListings,
  setPublished,
} from '#/server/quiz-access'
import { getRequestUserId, requireRequestUserId } from '#/server/request-user'

/*
 * The Marketplace: publishing, previewing, importing, and deleting a personal
 * quiz. Every write takes the user from the session; which writes are allowed
 * is #/domain/marketplace's call, storage is #/server/quiz-access's.
 */

export type { Listing, MarketplaceStanding }

const slug = z.string().min(1).max(200)

/** Every published quiz, newest first; visitors too. */
export const fetchListings = createServerFn({ method: 'GET' }).handler(
  async (): Promise<Array<Listing>> => listListings(await getRequestUserId()),
)

/** A published quiz's preview: its listing and content, or null. */
export const fetchPreview = createServerFn({ method: 'GET' })
  .validator(z.object({ quizId: slug }))
  .handler(
    async ({ data }): Promise<{ listing: Listing; quiz: Quiz } | null> => {
      const userId = await getRequestUserId()
      const [listing, quiz] = await Promise.all([
        findListing(data.quizId, userId),
        findPublishedQuiz(data.quizId),
      ])
      return listing && quiz ? { listing, quiz } : null
    },
  )

/** What a quiz's own page shows and offers about the Marketplace. */
export interface QuizStanding extends MarketplaceStanding {
  builtIn: boolean
  imported: boolean
  published: boolean
  canPublish: boolean
  canDelete: boolean
}

/** Null for a quiz the user can't see (the page then is a 404 anyway). */
export const fetchQuizStanding = createServerFn({ method: 'GET' })
  .validator(z.object({ quizId: slug }))
  .handler(async ({ data }): Promise<QuizStanding | null> => {
    const userId = await getRequestUserId()
    const [header, standing] = await Promise.all([
      findQuizHeader(data.quizId, userId),
      findMarketplaceStanding(data.quizId, userId),
    ])
    if (!header || !standing) return null
    const owned = userId !== null && !header.builtIn
    return {
      ...standing,
      builtIn: header.builtIn,
      imported: header.imported,
      published: header.published,
      canPublish: owned && canPublish(header),
      canDelete: owned && canDelete(header),
    }
  })

export const publishQuiz = createServerFn({ method: 'POST' })
  .validator(z.object({ quizId: slug, published: z.boolean() }))
  .handler(async ({ data }): Promise<void> => {
    const userId = await requireRequestUserId()
    const header = await findQuizHeader(data.quizId, userId)
    if (!header || header.builtIn) throw new Error('Quiz not found.')
    // Unpublishing is always allowed; publishing only what the rules allow.
    if (data.published && !canPublish(header)) {
      throw new Error('This quiz can’t be published.')
    }
    if (!(await setPublished(data.quizId, userId, data.published))) {
      throw new Error('Quiz not found.')
    }
  })

/** The user's imported quiz (new, or the one they already had). */
export const importQuiz = createServerFn({ method: 'POST' })
  .validator(z.object({ quizId: slug }))
  .handler(async ({ data }): Promise<{ id: string; created: boolean }> => {
    const userId = await requireRequestUserId()
    const result = await importPublishedQuiz(data.quizId, userId)
    if (!result) throw new Error('This quiz is no longer on the Marketplace.')
    return result
  })

export const deleteQuiz = createServerFn({ method: 'POST' })
  .validator(z.object({ quizId: slug }))
  .handler(async ({ data }): Promise<void> => {
    const userId = await requireRequestUserId()
    const header = await findQuizHeader(data.quizId, userId)
    if (!header || header.builtIn) throw new Error('Quiz not found.')
    if (!canDelete(header)) throw new Error('This quiz can’t be deleted.')
    if (!(await deleteOwnQuiz(data.quizId, userId))) {
      throw new Error('Quiz not found.')
    }
  })

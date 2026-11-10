import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { examConfigInput, idInput } from '#/lib/api-inputs'
import type { ExamOverrides } from '#/domain/exam-settings'
import { areValidOverrides } from '#/domain/exam-settings'
import type { Attempt, QuizProgress } from '#/domain/progress'
import { isValidChapterResult } from '#/domain/progress'
import {
  findChapter,
  findQuestion,
  findQuizHeader,
  isQuizVisible,
} from '#/server/quiz-access'
import { getRequestUserId, requireRequestUserId } from '#/server/request-user'
import {
  loadExamOverrides,
  loadFlags,
  loadQuizProgress,
  recordAttempt,
  saveExamOverrides as storeExamOverrides,
  setFlag,
} from '#/server/user-state'

/*
 * A signed-in user's state for one quiz: progress, flags and mock exam
 * settings. Every write takes the user from the session and goes through Quiz
 * access, so it only reaches quizzes the user may see. Visitors read null and
 * can't write. Thin on purpose: rules are in #/domain, storage in #/server.
 */

export interface QuizUserData {
  progress: QuizProgress
  /** Flagged question ids (slugs). */
  flags: Array<string>
  examOverrides: ExamOverrides
}

/** Null for visitors and for quizzes the user can't see. */
export const fetchQuizUserData = createServerFn({ method: 'GET' })
  .validator(z.object({ quizId: idInput }))
  .handler(async ({ data }): Promise<QuizUserData | null> => {
    const userId = await getRequestUserId()
    if (!userId) return null
    // Together with the visibility check, not after it: one round trip to
    // the database instead of two. All of it is the user's own data.
    const [visible, progress, flags, examOverrides] = await Promise.all([
      isQuizVisible(data.quizId, userId),
      loadQuizProgress(userId, data.quizId),
      loadFlags(userId, data.quizId),
      loadExamOverrides(userId, data.quizId),
    ])
    return visible ? { progress, flags, examOverrides } : null
  })

/**
 * Records a finished full chapter run. The score is the client's: progress is
 * private, so a forged score could only fool the user themselves. It must
 * still fit the chapter (see isValidChapterResult).
 */
export const recordChapterAttempt = createServerFn({ method: 'POST' })
  .validator(
    z.object({
      quizId: idInput,
      chapterId: idInput,
      score: z.number().int(),
      total: z.number().int(),
    }),
  )
  .handler(async ({ data }): Promise<Attempt> => {
    const userId = await requireRequestUserId()
    const found = await findChapter(data.quizId, data.chapterId, userId)
    if (!found) throw new Error('Chapter not found.')
    if (!isValidChapterResult(data.score, data.total, found.questionCount)) {
      throw new Error('The result does not match the chapter.')
    }
    const at = await recordAttempt(
      userId,
      data.quizId,
      found.id,
      data.score,
      data.total,
    )
    return { score: data.score, total: data.total, at: at.toISOString() }
  })

export const setQuestionFlag = createServerFn({ method: 'POST' })
  .validator(
    z.object({ quizId: idInput, questionId: idInput, flagged: z.boolean() }),
  )
  .handler(async ({ data }) => {
    const userId = await requireRequestUserId()
    const found = await findQuestion(data.quizId, data.questionId, userId)
    if (!found) throw new Error('Question not found.')
    await setFlag(userId, found.id, data.flagged)
  })

/** Saves the user's overrides of a quiz's mock exam defaults ({} resets them). */
export const saveExamOverrides = createServerFn({ method: 'POST' })
  .validator(
    z.object({
      quizId: idInput,
      overrides: examConfigInput.partial(),
    }),
  )
  .handler(async ({ data }) => {
    const userId = await requireRequestUserId()
    const header = await findQuizHeader(data.quizId, userId)
    if (!header?.exam) throw new Error('Mock exam not found.')
    if (!areValidOverrides(data.overrides, header.questionCount)) {
      throw new Error('These exam settings are out of range.')
    }
    await storeExamOverrides(userId, data.quizId, data.overrides)
  })

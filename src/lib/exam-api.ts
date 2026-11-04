import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import type { ExamOverrides } from '#/domain/exam-settings'
import { matchesExamConfig, resolveExamConfig } from '#/domain/exam-settings'
import type { StoredExam } from '#/domain/mock-exam'
import {
  acceptsState,
  isLegalPlan,
  isLegalProgress,
  scoreExam,
} from '#/domain/mock-exam'
import {
  createExam,
  dropExam,
  findExam,
  finishExam,
  saveProgress,
  toStoredExam,
  withLockedExam,
} from '#/server/exam-store'
import { findQuizHeader, listQuestions } from '#/server/quiz-access'
import { getRequestUserId, requireRequestUserId } from '#/server/request-user'
import { loadExamOverrides } from '#/server/user-state'

/*
 * Unfinished mock exams of signed-in users. The client draws and shuffles the
 * questions and keeps the exam's state; the server stores it, owns the clock
 * (startedAt, endsAt) and scores the exam from what it stored. Every decision
 * is the rulebook's (#/domain/mock-exam); storage is #/server/exam-store.
 * Thin on purpose.
 */

const slug = z.string().min(1).max(200)
const index = z.number().int().min(0)

const stateSchema = z.object({
  sessionId: z.uuid(),
  current: index,
  reviewing: z.boolean(),
  /** Positions flagged for review. */
  flagged: z.array(index).max(1000),
  /** Original option indexes picked, per position. */
  picks: z.array(z.array(index).max(6)).max(1000),
})

/**
 * What the exam page needs before it starts: the user's settings and their
 * unfinished exam of this quiz, if any. Null for visitors.
 */
export const fetchExamStart = createServerFn({ method: 'GET' })
  .validator(z.object({ quizId: slug }))
  .handler(
    async ({
      data,
    }): Promise<{
      overrides: ExamOverrides
      session: StoredExam | null
      /** The server's clock (epoch ms), to correct for the device's. */
      serverNow: number
    } | null> => {
      const userId = await getRequestUserId()
      if (!userId) return null
      const [overrides, exam] = await Promise.all([
        loadExamOverrides(userId, data.quizId),
        findExam(userId, data.quizId),
      ])
      // An exam whose content changed is not offered; starting a new exam
      // replaces it (no deleting here: this is a GET, also run on preload).
      const session = exam?.complete ? toStoredExam(exam) : null
      return { overrides, session, serverNow: Date.now() }
    },
  )

/**
 * Starts a new exam with the questions the client drew, replacing the user's
 * unfinished exam of this quiz. Its size, time limit and pass mark must be the
 * user's exam settings for the quiz, so the server's score means what it
 * says. The deadline is set here.
 */
export const startExamSession = createServerFn({ method: 'POST' })
  .validator(
    z.object({
      quizId: slug,
      minutes: z.number().int(),
      passPercent: z.number().int(),
      questions: z
        .array(
          z.object({ questionId: slug, optionOrder: z.array(index).max(6) }),
        )
        .max(1000),
    }),
  )
  .handler(async ({ data }) => {
    const userId = await requireRequestUserId()
    const header = await findQuizHeader(data.quizId, userId)
    if (!header?.exam) throw new Error('Mock exam not found.')
    const [overrides, questions] = await Promise.all([
      loadExamOverrides(userId, data.quizId),
      listQuestions(data.quizId, userId),
    ])
    const config = resolveExamConfig(
      header.exam,
      overrides,
      header.questionCount,
    )
    const bySlug = new Map(questions.map((q) => [q.slug, q]))
    if (
      !matchesExamConfig(config, {
        questionCount: data.questions.length,
        minutes: data.minutes,
        passPercent: data.passPercent,
      }) ||
      !isLegalPlan(
        data.questions,
        new Map(questions.map((q) => [q.slug, q.optionCount])),
      )
    ) {
      throw new Error('The exam does not match your exam settings.')
    }

    const startedAt = new Date()
    const endsAt = new Date(startedAt.getTime() + config.minutes * 60_000)
    const id = await createExam({
      userId,
      quizId: data.quizId,
      startedAt,
      endsAt,
      passPercent: config.passPercent,
      questions: data.questions.map((q) => ({
        ...q,
        rowId: (bySlug.get(q.questionId) as { id: string }).id,
      })),
    })
    return {
      id,
      startedAt: startedAt.getTime(),
      endsAt: endsAt.getTime(),
      serverNow: startedAt.getTime(),
    }
  })

/**
 * Saves the exam's state. False if it can't be saved: the exam is gone (e.g.
 * submitted or replaced in another tab, or its content changed) or its time
 * is up.
 */
export const saveExamSession = createServerFn({ method: 'POST' })
  .validator(stateSchema)
  .handler(async ({ data: { sessionId, ...progress } }): Promise<boolean> => {
    const userId = await requireRequestUserId()
    return withLockedExam(userId, sessionId, async (tx, exam) => {
      if (!exam?.complete || !acceptsState(exam.endsAt.getTime(), Date.now())) {
        return false
      }
      if (!isLegalProgress(exam.questions, progress)) {
        throw new Error('The exam state does not match the exam.')
      }
      await saveProgress(tx, exam, progress)
      return true
    })
  })

/**
 * Submits the exam: stores the final state (unless the time is up, then the
 * exam counts as it was at the deadline), scores it, records the attempt and
 * deletes the exam. Null if the exam no longer exists.
 */
export const submitExamSession = createServerFn({ method: 'POST' })
  .validator(stateSchema)
  .handler(async ({ data: { sessionId, ...progress } }) => {
    const userId = await requireRequestUserId()
    return withLockedExam(userId, sessionId, async (tx, exam) => {
      if (!exam) return null
      if (!exam.complete) {
        await dropExam(tx, exam)
        return null
      }
      let picks = exam.progress.picks
      if (acceptsState(exam.endsAt.getTime(), Date.now())) {
        if (!isLegalProgress(exam.questions, progress)) {
          throw new Error('The exam state does not match the exam.')
        }
        await saveProgress(tx, exam, progress)
        picks = progress.picks
      }
      const score = scoreExam(exam.questions, picks)
      if (!(await finishExam(tx, userId, exam, score))) return null
      return { score, total: exam.questions.length }
    })
  })

import { and, eq, inArray, sql } from 'drizzle-orm'
import { db, lockUntilCommit } from '#/db'
import type { Executor, Transaction } from '#/db'
import { examSession, examSessionPick, examSessionQuestion } from '#/db/schema'
import type {
  ExamProgress,
  PlannedExamQuestion,
  StoredExam,
} from '#/domain/mock-exam'
import type { AnswerKey } from '#/quizzes/question'
import { correctIndexesOf } from '#/server/quiz-rows'
import { recordAttempt } from '#/server/user-state'

/*
 * Storage of unfinished mock exams. Speaks the rulebook's language
 * (#/domain/mock-exam: question slugs, original option indexes) and converts
 * to the database's ids here and nowhere else. Makes no decisions: the
 * server functions ask the rulebook. Server only.
 */

/** An unfinished exam as loaded: what the rulebook needs, plus its stored state. */
export interface LoadedExam {
  id: string
  quizId: string
  startedAt: Date
  endsAt: Date
  passPercent: number
  questions: Array<
    AnswerKey & {
      questionId: string
      optionOrder: Array<number>
      flagged: boolean
    }
  >
  progress: ExamProgress
  /** Option row ids per position, in original index order. */
  optionIds: Array<Array<string>>
}

async function load(
  tx: Executor,
  where: { id: string } | { quizId: string },
  userId: string,
): Promise<LoadedExam | null> {
  const row = await tx.query.examSession.findFirst({
    where: { ...where, userId },
    with: {
      questions: {
        orderBy: { position: 'asc' },
        with: {
          question: {
            columns: { slug: true },
            with: { options: { orderBy: { position: 'asc' } } },
          },
        },
      },
      picks: true,
    },
  })
  // Saving content deletes the exams it affects; one with questions missing
  // (left by an older version, which didn't) counts as gone.
  if (
    !row ||
    row.questions.length !== row.questionCount ||
    row.questions.some((q, position) => q.position !== position)
  ) {
    return null
  }
  const optionIds = row.questions.map((q) =>
    q.question.options.map((o) => o.id),
  )
  // An option's original index is its place in the ordered options.
  const indexOf = new Map(
    optionIds.flatMap((ids) => ids.map((id, index) => [id, index] as const)),
  )
  return {
    id: row.id,
    quizId: row.quizId,
    startedAt: row.startedAt,
    endsAt: row.endsAt,
    passPercent: row.passPercent,
    questions: row.questions.map((q) => ({
      questionId: q.question.slug,
      optionOrder: q.optionOrder,
      flagged: q.flagged,
      optionCount: q.question.options.length,
      correct: correctIndexesOf(q.question.options),
    })),
    progress: {
      current: row.currentPosition,
      reviewing: row.reviewing,
      flagged: row.questions.flatMap((q, position) =>
        q.flagged ? [position] : [],
      ),
      picks: row.questions.map((q) =>
        row.picks
          .filter((p) => p.position === q.position)
          .map((p) => indexOf.get(p.optionId) as number)
          .sort((a, b) => a - b),
      ),
    },
    optionIds,
  }
}

/** The user's unfinished exam of a quiz, or null. */
export function findExam(userId: string, quizId: string) {
  return load(db, { quizId }, userId)
}

/** The exam as the client resumes it. */
export function toStoredExam(exam: LoadedExam): StoredExam {
  return {
    id: exam.id,
    startedAt: exam.startedAt.getTime(),
    endsAt: exam.endsAt.getTime(),
    current: exam.progress.current,
    reviewing: exam.progress.reviewing,
    passPercent: exam.passPercent,
    questions: exam.questions.map((q, position) => ({
      questionId: q.questionId,
      optionOrder: q.optionOrder,
      flagged: q.flagged,
      picks: [...exam.progress.picks[position]],
    })),
  }
}

/**
 * Runs `work` on the user's exam with its row locked, so saves and submits of
 * one exam run one after another. `work` gets null if there is no such exam.
 */
export function withLockedExam<T>(
  userId: string,
  examId: string,
  work: (tx: Transaction, exam: LoadedExam | null) => Promise<T>,
): Promise<T> {
  return db.transaction(async (tx) => {
    const locked = await tx
      .select({ id: examSession.id })
      .from(examSession)
      .where(and(eq(examSession.id, examId), eq(examSession.userId, userId)))
      .for('update')
    return work(
      tx,
      locked.length > 0 ? await load(tx, { id: examId }, userId) : null,
    )
  })
}

/** Stores a running exam's state (already checked against the rulebook). */
export async function saveProgress(
  tx: Transaction,
  exam: LoadedExam,
  progress: ExamProgress,
): Promise<void> {
  const pickRows = progress.picks.flatMap((pick, position) =>
    pick.map((index) => ({
      sessionId: exam.id,
      position,
      optionId: exam.optionIds[position][index],
    })),
  )
  await tx
    .update(examSession)
    .set({ currentPosition: progress.current, reviewing: progress.reviewing })
    .where(eq(examSession.id, exam.id))
  await tx
    .update(examSessionQuestion)
    .set({
      flagged:
        progress.flagged.length > 0
          ? inArray(examSessionQuestion.position, [...progress.flagged])
          : sql`false`,
    })
    .where(eq(examSessionQuestion.sessionId, exam.id))
  await tx.delete(examSessionPick).where(eq(examSessionPick.sessionId, exam.id))
  if (pickRows.length > 0) await tx.insert(examSessionPick).values(pickRows)
}

/**
 * Deletes the exam and records its attempt, once: false if another request
 * finished it first.
 */
export async function finishExam(
  tx: Transaction,
  userId: string,
  exam: LoadedExam,
  score: number,
): Promise<boolean> {
  const claimed = await tx
    .delete(examSession)
    .where(eq(examSession.id, exam.id))
    .returning({ id: examSession.id })
  if (claimed.length === 0) return false
  await recordAttempt(
    userId,
    exam.quizId,
    null,
    score,
    exam.questions.length,
    tx,
  )
  return true
}

/**
 * Starts a new exam (questions by row id), replacing the user's unfinished
 * exam of the quiz. One start at a time per user and quiz (e.g. two tabs).
 */
export async function createExam(input: {
  userId: string
  quizId: string
  startedAt: Date
  endsAt: Date
  passPercent: number
  questions: Array<PlannedExamQuestion & { rowId: string }>
}): Promise<string> {
  const { userId, quizId } = input
  return db.transaction(async (tx) => {
    await lockUntilCommit(tx, `exam:${userId}:${quizId}`)
    await tx
      .delete(examSession)
      .where(
        and(eq(examSession.userId, userId), eq(examSession.quizId, quizId)),
      )
    const [session] = await tx
      .insert(examSession)
      .values({
        userId,
        quizId,
        startedAt: input.startedAt,
        endsAt: input.endsAt,
        questionCount: input.questions.length,
        passPercent: input.passPercent,
      })
      .returning({ id: examSession.id })
    await tx.insert(examSessionQuestion).values(
      input.questions.map((q, position) => ({
        sessionId: session.id,
        position,
        questionId: q.rowId,
        optionOrder: [...q.optionOrder],
      })),
    )
    return session.id
  })
}

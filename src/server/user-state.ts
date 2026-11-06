import { and, eq, inArray } from 'drizzle-orm'
import { db } from '#/db'
import type { Executor } from '#/db'
import {
  chapter,
  question,
  questionFlag,
  quizAttempt,
  userQuizExamSettings,
} from '#/db/schema'
import type { ExamOverrides } from '#/domain/exam-settings'
import type { QuizProgress, RecordedAttempt, Result } from '#/domain/progress'
import { toQuizProgress } from '#/domain/progress'

/*
 * Storage of a signed-in user's state per quiz: attempts, flags and exam
 * settings. Callers have already checked that the quiz is visible to the user
 * (./quiz-access). Best and last results are not computed here: the stored
 * attempts are folded by the progress rules (#/domain/progress). Server only.
 */

/** The user's attempts of these quizzes, as the progress rules take them. */
async function loadAttempts(
  userId: string,
  quizIds: ReadonlyArray<string>,
  examsOnly = false,
): Promise<Array<RecordedAttempt & { quizId: string }>> {
  if (quizIds.length === 0) return []
  const rows = await db
    .select({
      quizId: quizAttempt.quizId,
      chapterSlug: chapter.slug,
      score: quizAttempt.score,
      total: quizAttempt.total,
      finishedAt: quizAttempt.finishedAt,
    })
    .from(quizAttempt)
    .leftJoin(chapter, eq(chapter.id, quizAttempt.chapterId))
    .where(
      and(
        eq(quizAttempt.userId, userId),
        inArray(quizAttempt.quizId, [...quizIds]),
        examsOnly ? eq(quizAttempt.kind, 'exam') : undefined,
      ),
    )
  return rows.map((row) => ({
    quizId: row.quizId,
    chapterId: row.chapterSlug,
    score: row.score,
    total: row.total,
    at: row.finishedAt.toISOString(),
  }))
}

export async function loadQuizProgress(
  userId: string,
  quizId: string,
): Promise<QuizProgress> {
  return toQuizProgress(await loadAttempts(userId, [quizId]))
}

/** Mock exam results per quiz (quizzes without attempts are left out). */
export async function loadExamResults(
  userId: string,
  quizIds: ReadonlyArray<string>,
): Promise<Map<string, Result>> {
  const attempts = await loadAttempts(userId, quizIds, true)
  const results = new Map<string, Result>()
  for (const quizId of new Set(attempts.map((a) => a.quizId))) {
    const exam = toQuizProgress(
      attempts.filter((a) => a.quizId === quizId),
    ).exam
    if (exam) results.set(quizId, exam)
  }
  return results
}

/** Records a chapter run (chapter row id) or, with null, a mock exam. */
export async function recordAttempt(
  userId: string,
  quizId: string,
  chapterId: string | null,
  score: number,
  total: number,
  executor: Executor = db,
): Promise<Date> {
  const [row] = await executor
    .insert(quizAttempt)
    .values({
      userId,
      quizId,
      chapterId,
      kind: chapterId === null ? 'exam' : 'chapter',
      score,
      total,
    })
    .returning({ finishedAt: quizAttempt.finishedAt })
  return row.finishedAt
}

/** Flagged question slugs, oldest flag first. */
export async function loadFlags(
  userId: string,
  quizId: string,
): Promise<Array<string>> {
  const rows = await db
    .select({ slug: question.slug })
    .from(questionFlag)
    .innerJoin(question, eq(question.id, questionFlag.questionId))
    .where(and(eq(questionFlag.userId, userId), eq(question.quizId, quizId)))
    .orderBy(questionFlag.createdAt)
  return rows.map((row) => row.slug)
}

/** Flags or unflags a question (row id). */
export async function setFlag(
  userId: string,
  questionId: string,
  flagged: boolean,
): Promise<void> {
  if (flagged) {
    await db
      .insert(questionFlag)
      .values({ userId, questionId })
      .onConflictDoNothing()
  } else {
    await db
      .delete(questionFlag)
      .where(
        and(
          eq(questionFlag.userId, userId),
          eq(questionFlag.questionId, questionId),
        ),
      )
  }
}

export async function loadExamOverrides(
  userId: string,
  quizId: string,
): Promise<ExamOverrides> {
  const rows = await db
    .select()
    .from(userQuizExamSettings)
    .where(
      and(
        eq(userQuizExamSettings.userId, userId),
        eq(userQuizExamSettings.quizId, quizId),
      ),
    )
    .limit(1)
  const row = rows.at(0)
  const overrides: ExamOverrides = {}
  if (row?.questionCount != null) overrides.questionCount = row.questionCount
  if (row?.minutes != null) overrides.minutes = row.minutes
  if (row?.passPercent != null) overrides.passPercent = row.passPercent
  return overrides
}

/** Stores the overrides; none left removes the row. */
export async function saveExamOverrides(
  userId: string,
  quizId: string,
  overrides: ExamOverrides,
): Promise<void> {
  const key = and(
    eq(userQuizExamSettings.userId, userId),
    eq(userQuizExamSettings.quizId, quizId),
  )
  const values = {
    questionCount: overrides.questionCount ?? null,
    minutes: overrides.minutes ?? null,
    passPercent: overrides.passPercent ?? null,
  }
  if (Object.values(values).every((value) => value === null)) {
    await db.delete(userQuizExamSettings).where(key)
    return
  }
  await db
    .insert(userQuizExamSettings)
    .values({ userId, quizId, ...values })
    .onConflictDoUpdate({
      target: [userQuizExamSettings.userId, userQuizExamSettings.quizId],
      set: { ...values, updatedAt: new Date() },
    })
}

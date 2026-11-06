import { and, count, eq, inArray, notInArray, sql } from 'drizzle-orm'
import { db, lockUntilCommit } from '#/db'
import type { Transaction } from '#/db'
import {
  chapter,
  examSession,
  examSessionQuestion,
  question,
  questionFlag,
  questionOption,
  quiz,
  quizAttempt,
} from '#/db/schema'
import { QUIZ_LIMITS, personalQuizProblems } from '#/quizzes/limits'
import { slugify } from '#/quizzes/rules'
import type { Quiz } from '#/quizzes/types'
import { findEditableQuiz, findImportSource } from '#/server/quiz-access'
import type { QuizRows } from '#/server/quiz-rows'
import { optionsSignature, toQuizRows } from '#/server/quiz-rows'

/*
 * Writing a quiz's content over what is stored, in place by slug (quiz id,
 * chapter slug, question slug): rows keep their ids, so users' flags,
 * attempts and unfinished exams survive edits. Chapters and questions no
 * longer in the quiz are deleted, with what refers to them. Unfinished exams
 * containing a removed question, or one whose options changed (its options
 * lose their ids), are deleted: they could no longer be scored as started.
 *
 * Used by the seed (built-in quizzes), by Save in the quiz assistant
 * (personal quizzes, see saveOwnQuiz) and by importing from the Marketplace
 * (importPublishedQuiz). Callers validate the quiz first
 * (src/quizzes/validate.ts). Server only.
 */

/** A fresh quiz id: `base` as a slug plus a random suffix, so ids never clash. */
function newQuizId(base: string): string {
  const suffix = crypto.randomUUID().replaceAll('-', '').slice(0, 8)
  return `${slugify(base, 50) || 'quiz'}-${suffix}`
}

/** `excluded."<column>"`: the value an upsert tried to insert. */
function excluded(column: string) {
  return sql.raw(`excluded."${column}"`)
}

/** What writing a quiz's rows removes or replaces of what is stored. */
interface ContentDiff {
  removedChapters: Array<{ id: string; slug: string; title: string }>
  removedQuestions: Array<{ id: string; slug: string; text: string }>
  /** Kept questions (row ids) whose options differ from the stored ones. */
  changedOptions: Array<string>
  /** Kept questions (slugs) whose options are stored exactly as wanted. */
  unchangedOptions: ReadonlySet<string>
}

async function diffContent(
  tx: Transaction,
  rows: QuizRows,
): Promise<ContentDiff> {
  const quizId = rows.quiz.id
  const wantedChapters = new Set(rows.chapters.map((c) => c.slug))
  const wantedOptions = new Map(
    rows.chapters.flatMap((c) =>
      c.questions.map((q) => [q.slug, optionsSignature(q.options)] as const),
    ),
  )
  const chapters = await tx
    .select({ id: chapter.id, slug: chapter.slug, title: chapter.title })
    .from(chapter)
    .where(eq(chapter.quizId, quizId))
  const questions = await tx.query.question.findMany({
    where: { quizId },
    columns: { id: true, slug: true, text: true },
    with: { options: { orderBy: { position: 'asc' } } },
  })
  const kept = questions.filter((q) => wantedOptions.has(q.slug))
  const isUnchanged = (q: (typeof kept)[number]) =>
    wantedOptions.get(q.slug) === optionsSignature(q.options)
  return {
    removedChapters: chapters.filter((c) => !wantedChapters.has(c.slug)),
    removedQuestions: questions
      .filter((q) => !wantedOptions.has(q.slug))
      .map(({ id, slug, text }) => ({ id, slug, text })),
    changedOptions: kept.filter((q) => !isUnchanged(q)).map((q) => q.id),
    unchangedOptions: new Set(kept.filter(isUnchanged).map((q) => q.slug)),
  }
}

/** Questions (row ids) an unfinished exam containing them can't be scored by. */
function invalidatedQuestions(diff: ContentDiff): Array<string> {
  return [...diff.removedQuestions.map((q) => q.id), ...diff.changedOptions]
}

/**
 * Writes one quiz (header and content) over what is stored for its id, which
 * must be free or already `ownerId`'s (null: built-in); throws otherwise.
 */
export async function upsertQuizContent(
  tx: Transaction,
  data: Quiz,
  ownerId: string | null,
): Promise<{ questionCount: number; optionsChanged: number }> {
  const stored = await tx
    .select({ ownerId: quiz.ownerId })
    .from(quiz)
    .where(eq(quiz.id, data.id))
    // No key update: users' attempt inserts (foreign key checks) don't wait.
    .for('no key update')
  const current = stored.at(0)
  if (current && current.ownerId !== ownerId) {
    throw new Error(
      `Quiz id "${data.id}" is taken by a quiz of another owner, which is never written over; use another id.`,
    )
  }
  const rows = toQuizRows(data, ownerId)
  return writeContent(tx, rows, await diffContent(tx, rows))
}

async function writeContent(
  tx: Transaction,
  rows: QuizRows,
  diff: ContentDiff,
): Promise<{ questionCount: number; optionsChanged: number }> {
  const values = rows.quiz
  const quizId = values.id
  const written = (Object.keys(values) as Array<keyof typeof values>)
    .filter((key) => key !== 'id')
    .map((key) => quiz[key])
  await tx
    .insert(quiz)
    .values(values)
    .onConflictDoUpdate({
      target: quiz.id,
      set: { ...values, updatedAt: new Date() },
      // Only a real change touches the row (and its updated_at).
      setWhere: sql`(${sql.join(written, sql`, `)}) IS DISTINCT FROM (${sql.join(
        written.map((column) => excluded(column.name)),
        sql`, `,
      )})`,
    })

  // Numbers are unique per quiz. When any chapter is renumbered (or removed),
  // move the existing numbers out of the way first so chapters can be
  // renumbered in any order. Not on every run: changing a number takes a lock
  // that holds up users' attempt inserts until the transaction commits.
  const wantedNumbers = new Map(rows.chapters.map((c) => [c.slug, c.number]))
  const existingChapters = await tx
    .select({ slug: chapter.slug, number: chapter.number })
    .from(chapter)
    .where(eq(chapter.quizId, quizId))
  if (existingChapters.some((c) => wantedNumbers.get(c.slug) !== c.number)) {
    await tx
      .update(chapter)
      .set({ number: sql`-${chapter.number} - 1` })
      .where(eq(chapter.quizId, quizId))
  }
  const chapterRows = await tx
    .insert(chapter)
    .values(
      rows.chapters.map(({ slug, number, title }) => ({
        quizId,
        slug,
        number,
        title,
      })),
    )
    .onConflictDoUpdate({
      target: [chapter.quizId, chapter.slug],
      set: { number: excluded('number'), title: excluded('title') },
    })
    .returning({ id: chapter.id, slug: chapter.slug })
  const chapterIds = new Map(chapterRows.map((row) => [row.slug, row.id]))

  const questions = rows.chapters.flatMap((c) =>
    c.questions.map((q) => ({ chapterSlug: c.slug, q })),
  )
  const questionRows = await tx
    .insert(question)
    .values(
      questions.map(({ chapterSlug, q }) => ({
        quizId,
        chapterId: chapterIds.get(chapterSlug) as string,
        slug: q.slug,
        position: q.position,
        text: q.text,
        explanation: q.explanation,
      })),
    )
    .onConflictDoUpdate({
      target: [question.quizId, question.slug],
      set: {
        chapterId: excluded('chapter_id'),
        position: excluded('position'),
        text: excluded('text'),
        explanation: excluded('explanation'),
      },
    })
    .returning({ id: question.id, slug: question.slug })
  const questionIds = new Map(questionRows.map((row) => [row.slug, row.id]))

  // Before the questions go: their cascade would take an exam's questions
  // and leave the exam itself behind.
  const invalidated = invalidatedQuestions(diff)
  if (invalidated.length > 0) {
    await tx
      .delete(examSession)
      .where(
        inArray(
          examSession.id,
          tx
            .select({ id: examSessionQuestion.sessionId })
            .from(examSessionQuestion)
            .where(inArray(examSessionQuestion.questionId, invalidated)),
        ),
      )
  }
  await tx.delete(question).where(
    and(
      eq(question.quizId, quizId),
      notInArray(
        question.id,
        questionRows.map((row) => row.id),
      ),
    ),
  )

  // Only now: a question moved out of a removed chapter has been moved
  // above, so the cascade does not take it (and its flags) along.
  await tx.delete(chapter).where(
    and(
      eq(chapter.quizId, quizId),
      notInArray(
        chapter.id,
        chapterRows.map((row) => row.id),
      ),
    ),
  )

  // Replaced per question, and only where they differ: rewriting them in place
  // could collide with the unique option text while options swap places.
  if (diff.changedOptions.length > 0) {
    await tx
      .delete(questionOption)
      .where(inArray(questionOption.questionId, diff.changedOptions))
  }
  const inserts = questions.flatMap(({ q }) => {
    if (diff.unchangedOptions.has(q.slug)) return []
    const questionId = questionIds.get(q.slug) as string
    return q.options.map((option) => ({ questionId, ...option }))
  })
  if (inserts.length > 0) await tx.insert(questionOption).values(inserts)

  return {
    questionCount: questions.length,
    optionsChanged: diff.changedOptions.length,
  }
}

/** What a Save would take away from the owner's progress on the quiz. */
export interface SaveImpact {
  removedChapters: Array<{ id: string; title: string; attempts: number }>
  removedQuestions: Array<{ id: string; text: string; flags: number }>
  /** The owner's unfinished mock exam contains removed or changed questions. */
  unfinishedExamAffected: boolean
}

export type SaveOutcome =
  | { status: 'saved'; quiz: Quiz; updatedAt: string; created: boolean }
  /** Removals that cost user state: save again with `confirmed`. */
  | { status: 'confirm'; impact: SaveImpact }
  /** Changed (or deleted) since the working copy was loaded. */
  | { status: 'conflict' }
  | { status: 'not-found' }
  | { status: 'quiz-limit' }

async function impactOf(
  tx: Transaction,
  quizId: string,
  diff: ContentDiff,
): Promise<SaveImpact> {
  const removedChapterIds = diff.removedChapters.map((c) => c.id)
  const removedQuestionIds = diff.removedQuestions.map((q) => q.id)
  const invalidated = invalidatedQuestions(diff)
  const attempts = removedChapterIds.length
    ? await tx
        .select({ chapterId: quizAttempt.chapterId, n: count() })
        .from(quizAttempt)
        .where(inArray(quizAttempt.chapterId, removedChapterIds))
        .groupBy(quizAttempt.chapterId)
    : []
  const flags = removedQuestionIds.length
    ? await tx
        .select({ questionId: questionFlag.questionId, n: count() })
        .from(questionFlag)
        .where(inArray(questionFlag.questionId, removedQuestionIds))
        .groupBy(questionFlag.questionId)
    : []
  const sessions = invalidated.length
    ? await tx
        .select({ id: examSession.id })
        .from(examSession)
        .innerJoin(
          examSessionQuestion,
          eq(examSessionQuestion.sessionId, examSession.id),
        )
        .where(
          and(
            eq(examSession.quizId, quizId),
            inArray(examSessionQuestion.questionId, invalidated),
          ),
        )
        .limit(1)
    : []
  const attemptsByChapter = new Map(attempts.map((a) => [a.chapterId, a.n]))
  const flagsByQuestion = new Map(flags.map((f) => [f.questionId, f.n]))
  return {
    removedChapters: diff.removedChapters.map((c) => ({
      id: c.slug,
      title: c.title,
      attempts: attemptsByChapter.get(c.id) ?? 0,
    })),
    removedQuestions: diff.removedQuestions.map((q) => ({
      id: q.slug,
      text: q.text,
      flags: flagsByQuestion.get(q.id) ?? 0,
    })),
    unfinishedExamAffected: sessions.length > 0,
  }
}

function costsUserState(impact: SaveImpact): boolean {
  return (
    impact.unfinishedExamAffected ||
    impact.removedChapters.some((c) => c.attempts > 0) ||
    impact.removedQuestions.some((q) => q.flags > 0)
  )
}

/**
 * Saves a working copy as one of the user's personal quizzes: a new one when
 * `baseUpdatedAt` is null (the id is picked here), else over their quiz
 * `data.id` if it hasn't changed since `baseUpdatedAt`. Throws if the quiz
 * breaks the quiz rules or size caps. Removals that cost the owner flags,
 * attempts or an unfinished exam need `confirmed`.
 */
export async function saveOwnQuiz(
  userId: string,
  data: Quiz,
  options: { baseUpdatedAt: string | null; confirmed: boolean },
): Promise<SaveOutcome> {
  const problems = personalQuizProblems(data)
  if (problems.length > 0) {
    throw new Error(`The quiz can't be saved yet: ${problems.join('; ')}`)
  }
  if (options.baseUpdatedAt === null) {
    const created = { ...data, id: newQuizId(data.title) }
    const withinLimit = await db.transaction(async (tx) => {
      // One new quiz per user at a time, so parallel Saves can't all pass the
      // cap.
      await lockUntilCommit(tx, `new-quiz:${userId}`)
      const owned = await tx.$count(quiz, eq(quiz.ownerId, userId))
      if (owned >= QUIZ_LIMITS.personalQuizzes) return false
      // A plain insert first: an id clash fails instead of writing over
      // someone else's quiz.
      await tx.insert(quiz).values(toQuizRows(created, userId).quiz)
      await upsertQuizContent(tx, created, userId)
      return true
    })
    if (!withinLimit) return { status: 'quiz-limit' }
    return finish(created.id, userId, true)
  }

  const baseTime = Date.parse(options.baseUpdatedAt)
  const outcome = await db.transaction(
    async (tx): Promise<SaveOutcome | null> => {
      // Locks the row: a concurrent Save waits here, then sees the new time.
      const rows = await tx
        .select({ updatedAt: quiz.updatedAt })
        .from(quiz)
        .where(and(eq(quiz.id, data.id), eq(quiz.ownerId, userId)))
        // No key update: owner attempt inserts (foreign key checks) don't wait.
        .for('no key update')
      const current = rows.at(0)
      if (!current) return { status: 'not-found' }
      if (current.updatedAt.getTime() !== baseTime)
        return { status: 'conflict' }

      const quizRows = toQuizRows(data, userId)
      const diff = await diffContent(tx, quizRows)
      if (!options.confirmed) {
        const impact = await impactOf(tx, data.id, diff)
        if (costsUserState(impact)) return { status: 'confirm', impact }
      }
      await writeContent(tx, quizRows, diff)
      // Every Save moves the time on, content-only changes too, and marks the
      // quiz as edited by its owner (an imported quiz may then be published).
      const now = new Date()
      await tx
        .update(quiz)
        .set({ updatedAt: now, editedAt: now })
        .where(eq(quiz.id, data.id))
      return null
    },
  )
  return outcome ?? finish(data.id, userId, false)
}

async function finish(
  quizId: string,
  userId: string,
  created: boolean,
): Promise<SaveOutcome> {
  const saved = await findEditableQuiz(quizId, userId)
  if (!saved) return { status: 'not-found' }
  return { status: 'saved', created, ...saved }
}

/**
 * Imports a published quiz (not the user's own) as a personal quiz of the
 * user: a copy of its content and mock exam defaults, nothing of the
 * publisher's progress. A user who already has a copy gets that one back.
 * Null if the quiz isn't published or is the user's own.
 */
export async function importPublishedQuiz(
  sourceId: string,
  userId: string,
): Promise<{ id: string; created: boolean } | null> {
  return db.transaction(async (tx) => {
    const findCopy = async () => {
      const copies = await tx
        .select({ id: quiz.id })
        .from(quiz)
        .where(and(eq(quiz.ownerId, userId), eq(quiz.importedFromId, sourceId)))
        .limit(1)
      return copies.at(0)
    }
    const source = await findImportSource(tx, sourceId, userId)
    if (!source) return null
    const existing = await findCopy()
    if (existing) return { id: existing.id, created: false }

    const copy = { ...source, id: newQuizId(sourceId) }
    // A concurrent import of the same quiz by the same user (a double click)
    // waits here for the other one and then inserts nothing.
    const inserted = await tx
      .insert(quiz)
      .values({
        ...toQuizRows(copy, userId).quiz,
        importedAt: new Date(),
        importedFromId: sourceId,
      })
      .onConflictDoNothing()
      .returning({ id: quiz.id })
    if (inserted.length === 0) {
      const raced = await findCopy()
      if (raced) return { id: raced.id, created: false }
      throw new Error('Could not import the quiz. Please try again.')
    }
    await upsertQuizContent(tx, copy, userId)
    return { id: copy.id, created: true }
  })
}

import { and, count, eq, inArray, notInArray, sql } from 'drizzle-orm'
import { db } from '#/db'
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
import { getCorrectIndexes } from '#/quizzes/question'
import type { Quiz } from '#/quizzes/types'
import { slugify } from '#/quizzes/validate'
import { findImportSource, findQuiz } from '#/server/quiz-access'

/*
 * Writing a quiz's content over what is stored, in place by slug (quiz id,
 * chapter slug, question slug): rows keep their ids, so users' flags,
 * attempts and unfinished exams survive edits. Chapters and questions no
 * longer in the quiz are deleted, with what refers to them. A question whose
 * options changed loses its options' ids, so unfinished exams containing it
 * are deleted (they could no longer be scored as started).
 *
 * Used by the seed (built-in quizzes), by Save in the quiz assistant
 * (personal quizzes, see saveOwnQuiz) and by importing from the Marketplace
 * (importPublishedQuiz). Callers validate the quiz first
 * (src/quizzes/validate.ts). Server only.
 */

export type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0]

/** A quiz as rows, without generated ids: the inverse of findQuiz. */
interface QuizRows {
  quiz: Omit<typeof quiz.$inferInsert, 'createdAt' | 'updatedAt'>
  chapters: Array<{
    slug: string
    number: number
    title: string
    questions: Array<{
      slug: string
      position: number
      text: string
      explanation: string
      options: Array<{ position: number; text: string; isCorrect: boolean }>
    }>
  }>
}

function toQuizRows(data: Quiz, ownerId: string | null): QuizRows {
  return {
    quiz: {
      id: data.id,
      ownerId,
      title: data.title,
      description: data.description,
      examQuestionCount: data.exam?.questionCount ?? null,
      examMinutes: data.exam?.minutes ?? null,
      examPassPercent: data.exam?.passPercent ?? null,
    },
    chapters: data.chapters.map((c) => ({
      slug: c.id,
      number: c.number,
      title: c.title,
      questions: c.questions.map((q, position) => {
        const correct = new Set(getCorrectIndexes(q))
        return {
          slug: q.id,
          position,
          text: q.question,
          explanation: q.explanation,
          options: q.options.map((text, index) => ({
            position: index,
            text,
            isCorrect: correct.has(index),
          })),
        }
      }),
    })),
  }
}

/** A fresh quiz id: `base` as a slug plus a random suffix, so ids never clash. */
function newQuizId(base: string): string {
  const suffix = crypto.randomUUID().replaceAll('-', '').slice(0, 8)
  return `${slugify(base, 50) || 'quiz'}-${suffix}`
}

/** `excluded."<column>"`: the value an upsert tried to insert. */
function excluded(column: string) {
  return sql.raw(`excluded."${column}"`)
}

function optionsSignature(
  options: ReadonlyArray<{ text: string; isCorrect: boolean }>,
): string {
  return JSON.stringify(options.map((o) => [o.text, o.isCorrect]))
}

/**
 * Writes one quiz (header and content) over what is stored for its id.
 * Never call it for an id owned by someone else: the caller checks that.
 */
export async function upsertQuizContent(
  tx: Transaction,
  data: Quiz,
  ownerId: string | null,
): Promise<{ questionCount: number; optionsChanged: number }> {
  // The rows the quiz maps to (the same mapping Quiz access reads back).
  const rows = toQuizRows(data, ownerId)
  const values = rows.quiz
  await tx
    .insert(quiz)
    .values(values)
    .onConflictDoUpdate({
      target: quiz.id,
      set: { ...values, updatedAt: new Date() },
      // Only a real change touches the row (and its updated_at).
      setWhere: sql`(${quiz.ownerId}, ${quiz.title}, ${quiz.description}, ${quiz.examQuestionCount}, ${quiz.examMinutes}, ${quiz.examPassPercent}) IS DISTINCT FROM (${excluded('owner_id')}, ${excluded('title')}, ${excluded('description')}, ${excluded('exam_question_count')}, ${excluded('exam_minutes')}, ${excluded('exam_pass_percent')})`,
    })

  // --- Chapters -----------------------------------------------------------
  // Numbers are unique per quiz. When any chapter is renumbered (or removed),
  // move the existing numbers out of the way first so chapters can be
  // renumbered in any order. Not on every run: changing a number takes a lock
  // that holds up users' attempt inserts until the transaction commits.
  const wantedNumbers = new Map(rows.chapters.map((c) => [c.slug, c.number]))
  const existingChapters = await tx
    .select({ slug: chapter.slug, number: chapter.number })
    .from(chapter)
    .where(eq(chapter.quizId, data.id))
  if (existingChapters.some((c) => wantedNumbers.get(c.slug) !== c.number)) {
    await tx
      .update(chapter)
      .set({ number: sql`-${chapter.number} - 1` })
      .where(eq(chapter.quizId, data.id))
  }
  const chapterRows = await tx
    .insert(chapter)
    .values(
      rows.chapters.map(({ slug, number, title }) => ({
        quizId: data.id,
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

  // --- Questions ----------------------------------------------------------
  const questions = rows.chapters.flatMap((c) =>
    c.questions.map((q) => ({ chapterSlug: c.slug, q })),
  )
  const questionRows = await tx
    .insert(question)
    .values(
      questions.map(({ chapterSlug, q }) => ({
        quizId: data.id,
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
  await tx.delete(question).where(
    and(
      eq(question.quizId, data.id),
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
      eq(chapter.quizId, data.id),
      notInArray(
        chapter.id,
        chapterRows.map((row) => row.id),
      ),
    ),
  )

  // --- Options ------------------------------------------------------------
  // Replaced per question, and only where they differ: rewriting them in place
  // could collide with the unique option text while options swap places.
  const existingOptions = await tx
    .select({
      questionId: questionOption.questionId,
      position: questionOption.position,
      text: questionOption.text,
      isCorrect: questionOption.isCorrect,
    })
    .from(questionOption)
    .innerJoin(question, eq(question.id, questionOption.questionId))
    .where(eq(question.quizId, data.id))
  const existingByQuestion = new Map<
    string,
    Array<(typeof existingOptions)[number]>
  >()
  for (const option of existingOptions) {
    const list = existingByQuestion.get(option.questionId) ?? []
    list.push(option)
    existingByQuestion.set(option.questionId, list)
  }

  const changed: Array<string> = []
  const inserts: Array<typeof questionOption.$inferInsert> = []
  for (const { q } of questions) {
    const questionId = questionIds.get(q.slug) as string
    const wanted = q.options.map((option) => ({ questionId, ...option }))
    const before = (existingByQuestion.get(questionId) ?? []).sort(
      (a, b) => a.position - b.position,
    )
    if (optionsSignature(before) === optionsSignature(wanted)) continue
    if (before.length > 0) changed.push(questionId)
    inserts.push(...wanted)
  }
  if (changed.length > 0) {
    await tx
      .delete(examSession)
      .where(
        inArray(
          examSession.id,
          tx
            .select({ id: examSessionQuestion.sessionId })
            .from(examSessionQuestion)
            .where(inArray(examSessionQuestion.questionId, changed)),
        ),
      )
    await tx
      .delete(questionOption)
      .where(inArray(questionOption.questionId, changed))
  }
  if (inserts.length > 0) await tx.insert(questionOption).values(inserts)

  return { questionCount: questions.length, optionsChanged: changed.length }
}

// --- Save from the quiz assistant -------------------------------------------

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

/** A personal quiz of the user, as the quiz assistant starts from it. */
export interface EditableQuiz {
  quiz: Quiz
  /** ISO time of the last change: Save is refused if it has moved on. */
  updatedAt: string
}

export async function findEditableQuiz(
  quizId: string,
  userId: string,
): Promise<EditableQuiz | null> {
  const rows = await db
    .select({ updatedAt: quiz.updatedAt })
    .from(quiz)
    .where(and(eq(quiz.id, quizId), eq(quiz.ownerId, userId)))
  const row = rows.at(0)
  if (!row) return null
  const data = await findQuiz(quizId, userId)
  if (!data) return null
  return { quiz: data, updatedAt: row.updatedAt.toISOString() }
}

async function impactOf(
  tx: Transaction,
  data: Quiz,
  userId: string,
): Promise<SaveImpact> {
  const keptChapters = new Set(data.chapters.map((c) => c.id))
  const kept = new Map(
    data.chapters.flatMap((c) => c.questions.map((q) => [q.id, q] as const)),
  )

  const chapters = await tx
    .select({ id: chapter.id, slug: chapter.slug, title: chapter.title })
    .from(chapter)
    .where(eq(chapter.quizId, data.id))
  const removedChapterRows = chapters.filter((c) => !keptChapters.has(c.slug))
  const attempts = removedChapterRows.length
    ? await tx
        .select({ chapterId: quizAttempt.chapterId, n: count() })
        .from(quizAttempt)
        .where(
          inArray(
            quizAttempt.chapterId,
            removedChapterRows.map((c) => c.id),
          ),
        )
        .groupBy(quizAttempt.chapterId)
    : []
  const attemptsByChapter = new Map(attempts.map((a) => [a.chapterId, a.n]))

  const questions = await tx.query.question.findMany({
    where: { quizId: data.id },
    columns: { id: true, slug: true, text: true },
    with: { options: { orderBy: { position: 'asc' } } },
  })
  const removedQuestionRows = questions.filter((q) => !kept.has(q.slug))
  const flags = removedQuestionRows.length
    ? await tx
        .select({ questionId: questionFlag.questionId, n: count() })
        .from(questionFlag)
        .where(
          inArray(
            questionFlag.questionId,
            removedQuestionRows.map((q) => q.id),
          ),
        )
        .groupBy(questionFlag.questionId)
    : []
  const flagsByQuestion = new Map(flags.map((f) => [f.questionId, f.n]))

  const rows = toQuizRows(data, userId)
  const wantedOptions = new Map(
    rows.chapters.flatMap((c) =>
      c.questions.map((q) => [q.slug, optionsSignature(q.options)] as const),
    ),
  )
  const touched = questions
    .filter(
      (q) =>
        !kept.has(q.slug) ||
        wantedOptions.get(q.slug) !== optionsSignature(q.options),
    )
    .map((q) => q.id)
  const sessions = touched.length
    ? await tx
        .select({ id: examSession.id })
        .from(examSession)
        .innerJoin(
          examSessionQuestion,
          eq(examSessionQuestion.sessionId, examSession.id),
        )
        .where(
          and(
            eq(examSession.quizId, data.id),
            inArray(examSessionQuestion.questionId, touched),
          ),
        )
        .limit(1)
    : []

  return {
    removedChapters: removedChapterRows.map((c) => ({
      id: c.slug,
      title: c.title,
      attempts: attemptsByChapter.get(c.id) ?? 0,
    })),
    removedQuestions: removedQuestionRows.map((q) => ({
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
      // cap (the lock ends with the transaction).
      await tx.execute(
        sql`select pg_advisory_xact_lock(hashtext(${`new-quiz:${userId}`}))`,
      )
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

      if (!options.confirmed) {
        const impact = await impactOf(tx, data, userId)
        if (costsUserState(impact)) return { status: 'confirm', impact }
      }
      await upsertQuizContent(tx, data, userId)
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

// --- Import from the Marketplace --------------------------------------------

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

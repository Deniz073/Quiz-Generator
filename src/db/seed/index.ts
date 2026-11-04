/*
 * `npm run db:seed`: writes the seed quizzes (./quizzes) to the database. Runs
 * after `db:migrate` on every production deploy, so it must stay re-runnable:
 *
 * - Everything is validated first (src/quizzes/validate.ts); nothing is written
 *   if any seed quiz is invalid.
 * - Content is upserted in place by slug (quiz id, chapter slug, question
 *   slug), so rows keep their ids and users' flags, attempts and unfinished
 *   exams survive content fixes.
 * - Chapters and questions no longer in a seed quiz are deleted, with what
 *   refers to them. A question whose options changed loses its options' ids,
 *   so unfinished exams containing it are deleted (they could no longer be
 *   scored as started).
 * - Built-in quizzes no longer in the seed are deleted. Personal quizzes are
 *   never touched: they live only in the database.
 * - A seed quiz whose id is taken by a personal quiz fails the seed; it never
 *   takes a user's quiz over.
 *
 * All of it runs in one transaction: a failure leaves the database unchanged
 * (and fails the deploy before the new version is built).
 */
import { and, eq, inArray, isNull, notInArray, sql } from 'drizzle-orm'
import { db } from '#/db'
import {
  chapter,
  examSession,
  examSessionQuestion,
  question,
  questionOption,
  quiz,
} from '#/db/schema'
import { toQuizRows } from '#/server/quiz-access'
import type { Quiz } from '#/quizzes/types'
import { validateQuizzes } from '#/quizzes/validate'
import { seedQuizzes } from './quizzes'

type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0]

/** `excluded."<column>"`: the value an upsert tried to insert. */
function excluded(column: string) {
  return sql.raw(`excluded."${column}"`)
}

function validate(): void {
  const errors = validateQuizzes([...seedQuizzes])
  const seen = new Set<string>()
  for (const { id } of seedQuizzes) {
    if (seen.has(id))
      errors.push(`Quiz id "${id}" is used by two seed quizzes.`)
    seen.add(id)
  }
  if (errors.length > 0) {
    throw new Error(
      `Invalid seed quizzes (${errors.length} problem${errors.length === 1 ? '' : 's'}):\n` +
        errors.map((error) => `  - ${error}`).join('\n'),
    )
  }
}

/** Writes one built-in quiz. */
async function upsertQuiz(tx: Transaction, data: Quiz): Promise<void> {
  const existing = await tx
    .select({ ownerId: quiz.ownerId })
    .from(quiz)
    .where(eq(quiz.id, data.id))
  const current = existing.at(0)
  if (current && current.ownerId !== null) {
    throw new Error(
      `Quiz id "${data.id}" is taken by a personal quiz; give the seed quiz another id. The seed never takes a user's quiz over.`,
    )
  }

  // The rows the quiz maps to (the same mapping Quiz access reads back).
  const rows = toQuizRows(data, null)
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
  // that holds up users' attempt inserts until the seed commits.
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
  const signature = (
    options: ReadonlyArray<{ text: string; isCorrect: boolean }>,
  ) => JSON.stringify(options.map((o) => [o.text, o.isCorrect]))
  const existingByQuestion = new Map<
    string,
    Array<(typeof existingOptions)[number]>
  >()
  for (const option of existingOptions) {
    const list = existingByQuestion.get(option.questionId) ?? []
    list.push(option)
    existingByQuestion.set(option.questionId, list)
  }

  const replaced: Array<string> = []
  const changed: Array<string> = []
  const inserts: Array<typeof questionOption.$inferInsert> = []
  for (const { q } of questions) {
    const questionId = questionIds.get(q.slug) as string
    const wanted = q.options.map((option) => ({ questionId, ...option }))
    const before = (existingByQuestion.get(questionId) ?? []).sort(
      (a, b) => a.position - b.position,
    )
    if (signature(before) === signature(wanted)) continue
    if (before.length > 0) {
      replaced.push(questionId)
      changed.push(questionId)
    }
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
  }
  if (replaced.length > 0) {
    await tx
      .delete(questionOption)
      .where(inArray(questionOption.questionId, replaced))
  }
  if (inserts.length > 0) await tx.insert(questionOption).values(inserts)

  console.log(
    `  ${data.id}: ${data.chapters.length} chapters, ${questions.length} questions` +
      (changed.length > 0
        ? `, options changed for ${changed.length} questions`
        : ''),
  )
}

async function main(): Promise<void> {
  validate()
  await db.transaction(async (tx) => {
    for (const data of seedQuizzes) await upsertQuiz(tx, data)
    const seedIds = seedQuizzes.map((data) => data.id)
    const removed = await tx
      .delete(quiz)
      .where(and(isNull(quiz.ownerId), notInArray(quiz.id, seedIds)))
      .returning({ id: quiz.id })
    for (const { id } of removed)
      console.log(`  ${id}: deleted (no longer a seed quiz)`)
  })
  console.log('Seed complete.')
}

main()
  .then(() => process.exit(0))
  .catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error)
    process.exit(1)
  })

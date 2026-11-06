/*
 * `npm run db:seed`: writes the seed quizzes (./quizzes) to the database. Runs
 * after `db:migrate` on every production deploy, so it must stay re-runnable:
 *
 * - Everything is validated first (src/quizzes/validate.ts); nothing is written
 *   if any seed quiz is invalid.
 * - Content is upserted in place by slug (quiz id, chapter slug, question
 *   slug), so rows keep their ids and users' flags, attempts and unfinished
 *   exams survive content fixes. The writing is #/server/quiz-writer's,
 *   shared with Save in the quiz assistant.
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
import { and, eq, isNull, notInArray } from 'drizzle-orm'
import { db } from '#/db'
import { quiz } from '#/db/schema'
import { upsertQuizContent } from '#/server/quiz-writer'
import type { Transaction } from '#/server/quiz-writer'
import type { Quiz } from '#/quizzes/types'
import { assertValidQuizzes } from '#/quizzes/validate'
import { seedQuizzes } from './quizzes'

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

  const { questionCount, optionsChanged } = await upsertQuizContent(
    tx,
    data,
    null,
  )
  console.log(
    `  ${data.id}: ${data.chapters.length} chapters, ${questionCount} questions` +
      (optionsChanged > 0
        ? `, options changed for ${optionsChanged} questions`
        : ''),
  )
}

async function main(): Promise<void> {
  assertValidQuizzes(seedQuizzes)
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

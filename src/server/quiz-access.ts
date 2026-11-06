import {
  and,
  asc,
  count,
  desc,
  eq,
  inArray,
  isNotNull,
  ne,
  isNull,
  or,
  sql,
} from 'drizzle-orm'
import type { SQL } from 'drizzle-orm'
import { db } from '#/db'
import { chapter, question, questionOption, quiz, user } from '#/db/schema'
import type { ExamConfig, Question, Quiz } from '#/quizzes/types'

/*
 * Quiz access: a quiz as a given user may see it, read from the quiz tables
 * as the app's `Quiz` (#/server/quiz-writer writes them). The only module
 * that knows the visibility rule: a built-in quiz (no owner) is visible to
 * everyone, a personal quiz only to its owner, and anything else reads as
 * missing (null), so personal quiz ids are not revealed. The one exception
 * is the Marketplace: anyone may list, preview and import a published quiz
 * (listListings, findPublishedQuiz, findImportSource). Server only.
 */

/*
 * The rules take the quiz table as a parameter, because a relational query
 * (loadQuiz) refers to it under an alias.
 */

/** The condition "this quiz is visible to `userId`" (null: a visitor). */
function visibleTo(userId: string | null, t: typeof quiz = quiz): SQL {
  return userId
    ? (or(isNull(t.ownerId), eq(t.ownerId, userId)) as SQL)
    : isNull(t.ownerId)
}

function visibleQuiz(
  quizId: string,
  userId: string | null,
  t: typeof quiz = quiz,
): SQL {
  return and(eq(t.id, quizId), visibleTo(userId, t)) as SQL
}

/** On the Marketplace: listed, previewable and importable by anyone. */
function isPublished(t: typeof quiz = quiz): SQL {
  return isNotNull(t.publishedAt)
}

const questionCount = db.$count(question, eq(question.quizId, quiz.id))
const chapterCount = db.$count(chapter, eq(chapter.quizId, quiz.id))

/**
 * Original indexes of the correct options. An option's original index is its
 * place in the question's options ordered by position.
 */
export function correctIndexesOf(
  orderedOptions: ReadonlyArray<{ isCorrect: boolean }>,
): Array<number> {
  return orderedOptions.flatMap((option, index) =>
    option.isCorrect ? [index] : [],
  )
}

/** What callers need of a quiz without its content. */
export interface QuizHeader {
  id: string
  title: string
  description: string
  /** False: a personal quiz (of this user). */
  builtIn: boolean
  /** An imported quiz (copied from a published quiz). */
  imported: boolean
  /** Its owner has saved changes to it (the quiz assistant). */
  edited: boolean
  /** On the Marketplace. */
  published: boolean
  /** The mock exam defaults; undefined if the quiz has no mock exam. */
  exam: ExamConfig | undefined
  chapterCount: number
  questionCount: number
}

const headerColumns = {
  id: quiz.id,
  title: quiz.title,
  description: quiz.description,
  ownerId: quiz.ownerId,
  importedAt: quiz.importedAt,
  editedAt: quiz.editedAt,
  publishedAt: quiz.publishedAt,
  examQuestionCount: quiz.examQuestionCount,
  examMinutes: quiz.examMinutes,
  examPassPercent: quiz.examPassPercent,
  chapterCount,
  questionCount,
}

type Executor = typeof db | Parameters<Parameters<typeof db.transaction>[0]>[0]

type HeaderRow = {
  id: string
  title: string
  description: string
  ownerId: string | null
  importedAt: Date | null
  editedAt: Date | null
  publishedAt: Date | null
  examQuestionCount: number | null
  examMinutes: number | null
  examPassPercent: number | null
  chapterCount: number
  questionCount: number
}

function toExamConfig(row: {
  examQuestionCount: number | null
  examMinutes: number | null
  examPassPercent: number | null
}): ExamConfig | undefined {
  const { examQuestionCount, examMinutes, examPassPercent } = row
  return examQuestionCount !== null &&
    examMinutes !== null &&
    examPassPercent !== null
    ? {
        questionCount: examQuestionCount,
        minutes: examMinutes,
        passPercent: examPassPercent,
      }
    : undefined
}

function toHeader(row: HeaderRow): QuizHeader {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    builtIn: row.ownerId === null,
    imported: row.importedAt !== null,
    edited: row.editedAt !== null,
    published: row.publishedAt !== null,
    exam: toExamConfig(row),
    chapterCount: row.chapterCount,
    questionCount: row.questionCount,
  }
}

/** The quiz without its content, or null if missing or not visible. */
export async function findQuizHeader(
  quizId: string,
  userId: string | null,
): Promise<QuizHeader | null> {
  const rows = await db
    .select(headerColumns)
    .from(quiz)
    .where(visibleQuiz(quizId, userId))
    .limit(1)
  const row = rows.at(0)
  return row ? toHeader(row) : null
}

/** Every quiz visible to the user, by title. */
export async function listQuizHeaders(
  userId: string | null,
): Promise<Array<QuizHeader>> {
  const rows = await db
    .select(headerColumns)
    .from(quiz)
    .where(visibleTo(userId))
    .orderBy(asc(quiz.title), asc(quiz.id))
  return rows.map(toHeader)
}

/** A chapter (by its slug) of a visible quiz, or null. */
export async function findChapter(
  quizId: string,
  chapterSlug: string,
  userId: string | null,
): Promise<{ id: string; questionCount: number } | null> {
  const rows = await db
    .select({
      id: chapter.id,
      questionCount: db.$count(question, eq(question.chapterId, chapter.id)),
    })
    .from(chapter)
    .innerJoin(quiz, eq(quiz.id, chapter.quizId))
    .where(and(visibleQuiz(quizId, userId), eq(chapter.slug, chapterSlug)))
    .limit(1)
  return rows.at(0) ?? null
}

/** The questions (by slug) of a visible quiz with their option count. */
export async function listQuestions(
  quizId: string,
  userId: string | null,
): Promise<Array<{ id: string; slug: string; optionCount: number }>> {
  return db
    .select({
      id: question.id,
      slug: question.slug,
      optionCount: count(questionOption.id),
    })
    .from(question)
    .innerJoin(quiz, eq(quiz.id, question.quizId))
    .innerJoin(questionOption, eq(questionOption.questionId, question.id))
    .where(visibleQuiz(quizId, userId))
    .groupBy(question.id)
}

/** A question (by its slug) of a visible quiz, or null. */
export async function findQuestion(
  quizId: string,
  questionSlug: string,
  userId: string | null,
): Promise<{ id: string } | null> {
  const rows = await db
    .select({ id: question.id })
    .from(question)
    .innerJoin(quiz, eq(quiz.id, question.quizId))
    .where(and(visibleQuiz(quizId, userId), eq(question.slug, questionSlug)))
    .limit(1)
  return rows.at(0) ?? null
}

/** The quiz with all its content as the app uses it, or null. */
export async function findQuiz(
  quizId: string,
  userId: string | null,
): Promise<Quiz | null> {
  return loadQuiz(db, (t) => visibleQuiz(quizId, userId, t))
}

/**
 * A published quiz with all its content, for its preview on the Marketplace:
 * the one way anyone (visitors too) may see a personal quiz they don't own.
 */
export async function findPublishedQuiz(quizId: string): Promise<Quiz | null> {
  return loadQuiz(db, (t) => and(eq(t.id, quizId), isPublished(t)) as SQL)
}

async function loadQuiz(
  executor: Executor,
  where: (t: typeof quiz) => SQL,
): Promise<Quiz | null> {
  const row = await executor.query.quiz.findFirst({
    where: { RAW: where },
    with: {
      chapters: {
        orderBy: { number: 'asc' },
        with: {
          questions: {
            orderBy: { position: 'asc' },
            with: { options: { orderBy: { position: 'asc' } } },
          },
        },
      },
    },
  })
  if (!row) return null
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    chapters: row.chapters.map((c) => ({
      id: c.slug,
      number: c.number,
      title: c.title,
      questions: c.questions.map((q): Question => {
        const correct = correctIndexesOf(q.options)
        const base = {
          id: q.slug,
          question: q.text,
          options: q.options.map((o) => o.text),
          explanation: q.explanation,
        }
        return correct.length === 1
          ? { ...base, correctIndex: correct[0] }
          : { ...base, correctIndexes: correct }
      }),
    })),
    exam: toExamConfig(row),
  }
}

// --- Marketplace ------------------------------------------------------------

/**
 * How many imported quizzes were copied from the quiz row of the query. The
 * outer column is spelled out: in a single-table query Drizzle leaves the
 * table off `quiz.id`, which inside this subquery would mean "imported".
 */
const importCount =
  sql<number>`(select count(*) from "quiz" as "imported" where "imported"."imported_from_id" = "quiz"."id")`.mapWith(
    Number,
  )

/** A published quiz as the Marketplace lists it. */
export interface Listing {
  id: string
  title: string
  description: string
  chapterCount: number
  questionCount: number
  publisherName: string
  /** ISO timestamp. */
  publishedAt: string
  importCount: number
  /** Published by this user. */
  yours: boolean
  /** This user's imported quiz of it, if they have one. */
  yourCopyId: string | null
}

async function queryListings(
  userId: string | null,
  where: SQL | undefined,
): Promise<Array<Listing>> {
  const rows = await db
    .select({
      id: quiz.id,
      title: quiz.title,
      description: quiz.description,
      ownerId: quiz.ownerId,
      publishedAt: quiz.publishedAt,
      publisherName: user.name,
      chapterCount,
      questionCount,
      importCount,
    })
    .from(quiz)
    .innerJoin(user, eq(user.id, quiz.ownerId))
    .where(and(isPublished(), where))
    .orderBy(desc(quiz.publishedAt), asc(quiz.id))
  const copies =
    userId && rows.length > 0
      ? await db
          .select({ id: quiz.id, sourceId: quiz.importedFromId })
          .from(quiz)
          .where(
            and(
              eq(quiz.ownerId, userId),
              inArray(
                quiz.importedFromId,
                rows.map((row) => row.id),
              ),
            ),
          )
      : []
  const copyOf = new Map(copies.map((c) => [c.sourceId, c.id]))
  return rows.map(({ ownerId, publishedAt, ...row }) => ({
    ...row,
    // Never null here (the where clause), but the column is nullable.
    publishedAt: (publishedAt ?? new Date(0)).toISOString(),
    yours: userId !== null && ownerId === userId,
    yourCopyId: copyOf.get(row.id) ?? null,
  }))
}

/** Every published quiz, newest first, as `userId` (null: a visitor) sees it. */
export async function listListings(
  userId: string | null,
): Promise<Array<Listing>> {
  return queryListings(userId, undefined)
}

/** One published quiz's listing, or null if it isn't published. */
export async function findListing(
  quizId: string,
  userId: string | null,
): Promise<Listing | null> {
  const rows = await queryListings(userId, eq(quiz.id, quizId))
  return rows.at(0) ?? null
}

/** Where a quiz stands on the Marketplace, for its own page. */
export interface MarketplaceStanding {
  /** How many imported quizzes were copied from it. */
  importCount: number
  /** The published quiz an imported quiz was copied from, while it exists. */
  importedFrom: {
    id: string
    title: string
    publisherName: string
    /** Still published, so its preview can be linked. */
    published: boolean
  } | null
}

/** For a quiz visible to the user (see findQuizHeader); null otherwise. */
export async function findMarketplaceStanding(
  quizId: string,
  userId: string | null,
): Promise<MarketplaceStanding | null> {
  const rows = await db
    .select({
      importCount,
      sourceId: quiz.importedFromId,
    })
    .from(quiz)
    .where(visibleQuiz(quizId, userId))
    .limit(1)
  const row = rows.at(0)
  if (!row) return null
  if (!row.sourceId) return { importCount: row.importCount, importedFrom: null }
  const sources = await db
    .select({
      id: quiz.id,
      title: quiz.title,
      publisherName: user.name,
      publishedAt: quiz.publishedAt,
    })
    .from(quiz)
    .innerJoin(user, eq(user.id, quiz.ownerId))
    .where(eq(quiz.id, row.sourceId))
    .limit(1)
  const source = sources.at(0)
  return {
    importCount: row.importCount,
    importedFrom: source
      ? {
          id: source.id,
          title: source.title,
          publisherName: source.publisherName,
          published: source.publishedAt !== null,
        }
      : null,
  }
}

/**
 * Publishes or unpublishes one of the user's own quizzes (whether they may is
 * src/domain/marketplace's call). Publishing again keeps the first date.
 * False if the user doesn't own the quiz.
 */
export async function setPublished(
  quizId: string,
  userId: string,
  published: boolean,
): Promise<boolean> {
  const rows = await db
    .update(quiz)
    .set({
      publishedAt: published ? sql`coalesce(${quiz.publishedAt}, now())` : null,
    })
    .where(and(eq(quiz.id, quizId), eq(quiz.ownerId, userId)))
    .returning({ id: quiz.id })
  return rows.length > 0
}

/**
 * A published quiz (not the user's own) with all its content, to import as a
 * personal quiz of the user (see #/server/quiz-writer); null if there is none.
 */
export function findImportSource(
  executor: Executor,
  sourceId: string,
  userId: string,
): Promise<Quiz | null> {
  return loadQuiz(
    executor,
    (t) =>
      and(eq(t.id, sourceId), isPublished(t), ne(t.ownerId, userId)) as SQL,
  )
}

/**
 * Deletes one of the user's own quizzes, with everyone's progress, flags and
 * unfinished exams on it (the foreign keys cascade). Imported quizzes copied
 * from it stay, without their link. False if the user doesn't own it.
 */
export async function deleteOwnQuiz(
  quizId: string,
  userId: string,
): Promise<boolean> {
  const rows = await db
    .delete(quiz)
    .where(and(eq(quiz.id, quizId), eq(quiz.ownerId, userId)))
    .returning({ id: quiz.id })
  return rows.length > 0
}

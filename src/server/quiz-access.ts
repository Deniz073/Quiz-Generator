import { and, asc, count, eq, isNull, or } from 'drizzle-orm'
import type { SQL } from 'drizzle-orm'
import { db } from '#/db'
import { chapter, question, questionOption, quiz } from '#/db/schema'
import { getCorrectIndexes } from '#/quizzes/question'
import type { ExamConfig, Question, Quiz } from '#/quizzes/types'

/*
 * Quiz access: a quiz as a given user may see it, and the mapping between the
 * quiz tables and the app's `Quiz` (both ways: reads here, writes by the
 * seed). The only module that knows the visibility rule: a built-in quiz (no
 * owner) is visible to everyone, a personal quiz only to its owner, and
 * anything else reads as missing (null), so personal quiz ids are not
 * revealed. Server only.
 */

/** The condition "this quiz is visible to `userId`" (null: a visitor). */
function visibleTo(userId: string | null): SQL {
  return userId
    ? (or(isNull(quiz.ownerId), eq(quiz.ownerId, userId)) as SQL)
    : isNull(quiz.ownerId)
}

function visibleQuiz(quizId: string, userId: string | null): SQL {
  return and(eq(quiz.id, quizId), visibleTo(userId)) as SQL
}

const questionCount = db.$count(question, eq(question.quizId, quiz.id))

/** What callers need of a quiz without its content. */
export interface QuizHeader {
  id: string
  title: string
  description: string
  /** False: a personal quiz (of this user). */
  builtIn: boolean
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
  examQuestionCount: quiz.examQuestionCount,
  examMinutes: quiz.examMinutes,
  examPassPercent: quiz.examPassPercent,
  chapterCount: db.$count(chapter, eq(chapter.quizId, quiz.id)),
  questionCount,
}

type HeaderRow = {
  id: string
  title: string
  description: string
  ownerId: string | null
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
  const row = await db.query.quiz.findFirst({
    where: userId
      ? {
          id: quizId,
          OR: [{ ownerId: { isNull: true } }, { ownerId: userId }],
        }
      : { id: quizId, ownerId: { isNull: true } },
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
        // An option's original index is its place in the ordered options.
        const correct = q.options.flatMap((o, index) =>
          o.isCorrect ? [index] : [],
        )
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

// --- Writing (the seed) -----------------------------------------------------

/** A quiz as rows, without generated ids: the inverse of findQuiz. */
export interface QuizRows {
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

export function toQuizRows(data: Quiz, ownerId: string | null): QuizRows {
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

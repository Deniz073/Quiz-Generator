import type { quiz } from '#/db/schema'
import { getCorrectIndexes, withCorrectIndexes } from '#/quizzes/question'
import type { ExamConfig, Quiz } from '#/quizzes/types'

/*
 * The app's `Quiz` as rows of the quiz tables and back: the one place that
 * knows how the two line up. Quiz, chapter and question ids are their slugs;
 * an option's original index is its place in the question's options ordered
 * by position. Server only.
 */

/** Original indexes of the correct options, from options ordered by position. */
export function correctIndexesOf(
  orderedOptions: ReadonlyArray<{ isCorrect: boolean }>,
): Array<number> {
  return orderedOptions.flatMap((option, index) =>
    option.isCorrect ? [index] : [],
  )
}

/** Compares a question's options (texts and which are correct) as stored. */
export function optionsSignature(
  options: ReadonlyArray<{ text: string; isCorrect: boolean }>,
): string {
  return JSON.stringify(options.map((o) => [o.text, o.isCorrect]))
}

interface ExamColumns {
  examQuestionCount: number | null
  examMinutes: number | null
  examPassPercent: number | null
}

export function toExamConfig(row: ExamColumns): ExamConfig | undefined {
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

/** A quiz row with its chapters, questions and options, each ordered. */
export interface StoredQuiz extends ExamColumns {
  id: string
  title: string
  description: string
  chapters: Array<{
    slug: string
    number: number
    title: string
    questions: Array<{
      slug: string
      text: string
      explanation: string
      options: Array<{ text: string; isCorrect: boolean }>
    }>
  }>
}

export function toQuiz(row: StoredQuiz): Quiz {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    chapters: row.chapters.map((c) => ({
      id: c.slug,
      number: c.number,
      title: c.title,
      questions: c.questions.map((q) =>
        withCorrectIndexes(
          {
            id: q.slug,
            question: q.text,
            options: q.options.map((o) => o.text),
            explanation: q.explanation,
          },
          correctIndexesOf(q.options),
        ),
      ),
    })),
    exam: toExamConfig(row),
  }
}

/** A quiz as rows, without generated ids: the inverse of toQuiz. */
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

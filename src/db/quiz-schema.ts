import { defineRelationsPart, sql } from 'drizzle-orm'
import {
  boolean,
  check,
  foreignKey,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from 'drizzle-orm/pg-core'
import { user } from './auth-schema'

/*
 * Quiz content. A quiz without an owner is a built-in quiz, visible to
 * everyone; one with an owner is a personal quiz, visible only to that user.
 * Chapters and questions keep the slugs they had as code (`chapter.slug`,
 * `question.slug`): URLs and user state refer to them, so never change one.
 *
 * Rules that span rows (2-6 options, how many are correct) are checked by
 * src/quizzes/validate.ts before anything is written, not by the database.
 */

const SLUG = `'^[a-z0-9]+(-[a-z0-9]+)*$'`

export const quiz = pgTable(
  'quiz',
  {
    /** The built-in quizzes' slug (e.g. 'pspo-1'); URL-safe for every quiz. */
    id: text('id').primaryKey(),
    /** Null: a built-in quiz. */
    ownerId: text('owner_id').references(() => user.id, {
      onDelete: 'cascade',
    }),
    title: text('title').notNull(),
    description: text('description').notNull(),
    /** Mock exam defaults: all three set (the quiz has a mock exam) or none. */
    examQuestionCount: integer('exam_question_count'),
    examMinutes: integer('exam_minutes'),
    examPassPercent: integer('exam_pass_percent'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (t) => [
    index('quiz_owner_id_idx').on(t.ownerId),
    check('quiz_id_slug', sql`${t.id} ~ ${sql.raw(SLUG)}`),
    check(
      'quiz_exam_all_or_none',
      sql`(${t.examQuestionCount} IS NULL) = (${t.examMinutes} IS NULL) AND (${t.examMinutes} IS NULL) = (${t.examPassPercent} IS NULL)`,
    ),
    check(
      'quiz_exam_ranges',
      sql`${t.examQuestionCount} >= 1 AND ${t.examMinutes} >= 1 AND ${t.examPassPercent} BETWEEN 1 AND 100`,
    ),
  ],
)

export const chapter = pgTable(
  'chapter',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    quizId: text('quiz_id')
      .notNull()
      .references(() => quiz.id, { onDelete: 'cascade' }),
    slug: text('slug').notNull(),
    /** Shown in the UI and the chapter order. */
    number: integer('number').notNull(),
    title: text('title').notNull(),
  },
  (t) => [
    unique('chapter_quiz_id_slug_unique').on(t.quizId, t.slug),
    unique('chapter_quiz_id_number_unique').on(t.quizId, t.number),
    // Target of the composite foreign keys that keep a question (or an
    // attempt) in the same quiz as its chapter.
    unique('chapter_id_quiz_id_unique').on(t.id, t.quizId),
    check('chapter_slug_slug', sql`${t.slug} ~ ${sql.raw(SLUG)}`),
  ],
)

export const question = pgTable(
  'question',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    /** Denormalised from the chapter, so slugs can be unique per quiz. */
    quizId: text('quiz_id').notNull(),
    chapterId: uuid('chapter_id').notNull(),
    slug: text('slug').notNull(),
    /** Order within the chapter. */
    position: integer('position').notNull(),
    text: text('text').notNull(),
    explanation: text('explanation').notNull(),
  },
  (t) => [
    unique('question_quiz_id_slug_unique').on(t.quizId, t.slug),
    index('question_chapter_id_idx').on(t.chapterId),
    foreignKey({
      name: 'question_chapter_fkey',
      columns: [t.chapterId, t.quizId],
      foreignColumns: [chapter.id, chapter.quizId],
    }).onDelete('cascade'),
    check('question_slug_slug', sql`${t.slug} ~ ${sql.raw(SLUG)}`),
  ],
)

export const questionOption = pgTable(
  'question_option',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    questionId: uuid('question_id')
      .notNull()
      .references(() => question.id, { onDelete: 'cascade' }),
    /** The option's index in the question as written (shuffled at runtime). */
    position: integer('position').notNull(),
    text: text('text').notNull(),
    isCorrect: boolean('is_correct').notNull(),
  },
  (t) => [
    unique('question_option_question_id_position_unique').on(
      t.questionId,
      t.position,
    ),
    unique('question_option_question_id_text_unique').on(t.questionId, t.text),
    check('question_option_position_range', sql`${t.position} BETWEEN 0 AND 5`),
  ],
)

export const quizRelations = defineRelationsPart(
  { user, quiz, chapter, question, questionOption },
  (r) => ({
    quiz: {
      owner: r.one.user({ from: r.quiz.ownerId, to: r.user.id }),
      chapters: r.many.chapter({ from: r.quiz.id, to: r.chapter.quizId }),
    },
    chapter: {
      quiz: r.one.quiz({
        from: r.chapter.quizId,
        to: r.quiz.id,
        optional: false,
      }),
      questions: r.many.question({
        from: r.chapter.id,
        to: r.question.chapterId,
      }),
    },
    question: {
      chapter: r.one.chapter({
        from: r.question.chapterId,
        to: r.chapter.id,
        optional: false,
      }),
      options: r.many.questionOption({
        from: r.question.id,
        to: r.questionOption.questionId,
      }),
    },
    questionOption: {
      question: r.one.question({
        from: r.questionOption.questionId,
        to: r.question.id,
        optional: false,
      }),
    },
  }),
)

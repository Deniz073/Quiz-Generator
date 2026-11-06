import { defineRelationsPart, sql } from 'drizzle-orm'
import {
  boolean,
  check,
  foreignKey,
  index,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  unique,
  uuid,
} from 'drizzle-orm/pg-core'
// Relative: drizzle-kit loads this file without the #/ alias.
import { MAX_EXAM_MINUTES } from '../quizzes/rules'
import { user } from './auth-schema'
import { chapter, question, questionOption, quiz } from './quiz-schema'

/*
 * What signed-in users keep: attempts (finished chapter runs and mock exams),
 * flags, their own mock exam settings and unfinished exams. Visitors keep
 * nothing. Everything goes with the user, and with the content it refers to.
 */

export const attemptKind = pgEnum('attempt_kind', ['chapter', 'exam'])

/** One finished chapter run or mock exam. Best and last are derived. */
export const quizAttempt = pgTable(
  'quiz_attempt',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    quizId: text('quiz_id')
      .notNull()
      .references(() => quiz.id, { onDelete: 'cascade' }),
    /** Set for chapter runs, null for mock exams. */
    chapterId: uuid('chapter_id'),
    kind: attemptKind('kind').notNull(),
    score: integer('score').notNull(),
    total: integer('total').notNull(),
    finishedAt: timestamp('finished_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    index('quiz_attempt_user_quiz_idx').on(
      t.userId,
      t.quizId,
      t.kind,
      t.chapterId,
      t.finishedAt,
    ),
    // For the cascades when a quiz or chapter is deleted (e.g. by the seed).
    index('quiz_attempt_quiz_id_idx').on(t.quizId),
    index('quiz_attempt_chapter_id_idx').on(t.chapterId),
    foreignKey({
      name: 'quiz_attempt_chapter_fkey',
      columns: [t.chapterId, t.quizId],
      foreignColumns: [chapter.id, chapter.quizId],
    }).onDelete('cascade'),
    check(
      'quiz_attempt_chapter_matches_kind',
      sql`(${t.kind} = 'chapter') = (${t.chapterId} IS NOT NULL)`,
    ),
    check(
      'quiz_attempt_score_range',
      sql`${t.total} >= 1 AND ${t.score} >= 0 AND ${t.score} <= ${t.total}`,
    ),
  ],
)

export const questionFlag = pgTable(
  'question_flag',
  {
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    questionId: uuid('question_id')
      .notNull()
      .references(() => question.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.userId, t.questionId] }),
    index('question_flag_question_id_idx').on(t.questionId),
  ],
)

/** A user's overrides of a quiz's mock exam defaults; null keeps the default. */
export const userQuizExamSettings = pgTable(
  'user_quiz_exam_settings',
  {
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    quizId: text('quiz_id')
      .notNull()
      .references(() => quiz.id, { onDelete: 'cascade' }),
    questionCount: integer('question_count'),
    minutes: integer('minutes'),
    passPercent: integer('pass_percent'),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.userId, t.quizId] }),
    index('user_quiz_exam_settings_quiz_id_idx').on(t.quizId),
    check(
      'user_quiz_exam_settings_ranges',
      sql`${t.questionCount} >= 1 AND ${t.minutes} BETWEEN 1 AND ${sql.raw(String(MAX_EXAM_MINUTES))} AND ${t.passPercent} BETWEEN 1 AND 100`,
    ),
  ],
)

/** A started, not yet submitted mock exam. One per user per quiz. */
export const examSession = pgTable(
  'exam_session',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    quizId: text('quiz_id')
      .notNull()
      .references(() => quiz.id, { onDelete: 'cascade' }),
    startedAt: timestamp('started_at', { withTimezone: true }).notNull(),
    /** The deadline, enforced by the server. */
    endsAt: timestamp('ends_at', { withTimezone: true }).notNull(),
    /** How many questions it started with; fewer rows means content was removed. */
    questionCount: integer('question_count').notNull(),
    currentPosition: integer('current_position').notNull().default(0),
    reviewing: boolean('reviewing').notNull().default(false),
    /** The pass mark it was started with. */
    passPercent: integer('pass_percent').notNull(),
  },
  (t) => [
    unique('exam_session_user_id_quiz_id_unique').on(t.userId, t.quizId),
    index('exam_session_quiz_id_idx').on(t.quizId),
    check('exam_session_deadline', sql`${t.endsAt} > ${t.startedAt}`),
    check(
      'exam_session_ranges',
      sql`${t.questionCount} >= 1 AND ${t.currentPosition} >= 0 AND ${t.currentPosition} < ${t.questionCount} AND ${t.passPercent} BETWEEN 1 AND 100`,
    ),
  ],
)

export const examSessionQuestion = pgTable(
  'exam_session_question',
  {
    sessionId: uuid('session_id')
      .notNull()
      .references(() => examSession.id, { onDelete: 'cascade' }),
    position: integer('position').notNull(),
    questionId: uuid('question_id')
      .notNull()
      .references(() => question.id, { onDelete: 'cascade' }),
    /** Option positions in the order shown: display only, not a relationship. */
    optionOrder: integer('option_order').array().notNull(),
    /** Marked for review within this exam (not a user flag). */
    flagged: boolean('flagged').notNull().default(false),
  },
  (t) => [
    primaryKey({ columns: [t.sessionId, t.position] }),
    unique('exam_session_question_session_id_question_id_unique').on(
      t.sessionId,
      t.questionId,
    ),
    index('exam_session_question_question_id_idx').on(t.questionId),
  ],
)

export const examSessionPick = pgTable(
  'exam_session_pick',
  {
    sessionId: uuid('session_id').notNull(),
    position: integer('position').notNull(),
    optionId: uuid('option_id')
      .notNull()
      .references(() => questionOption.id, { onDelete: 'cascade' }),
  },
  (t) => [
    primaryKey({ columns: [t.sessionId, t.position, t.optionId] }),
    foreignKey({
      name: 'exam_session_pick_question_fkey',
      columns: [t.sessionId, t.position],
      foreignColumns: [
        examSessionQuestion.sessionId,
        examSessionQuestion.position,
      ],
    }).onDelete('cascade'),
    index('exam_session_pick_option_id_idx').on(t.optionId),
  ],
)

export const progressRelations = defineRelationsPart(
  {
    examSession,
    examSessionQuestion,
    examSessionPick,
    question,
    questionOption,
  },
  (r) => ({
    examSession: {
      questions: r.many.examSessionQuestion({
        from: r.examSession.id,
        to: r.examSessionQuestion.sessionId,
      }),
      picks: r.many.examSessionPick({
        from: r.examSession.id,
        to: r.examSessionPick.sessionId,
      }),
    },
    examSessionQuestion: {
      question: r.one.question({
        from: r.examSessionQuestion.questionId,
        to: r.question.id,
        optional: false,
      }),
    },
    examSessionPick: {
      option: r.one.questionOption({
        from: r.examSessionPick.optionId,
        to: r.questionOption.id,
        optional: false,
      }),
    },
  }),
)

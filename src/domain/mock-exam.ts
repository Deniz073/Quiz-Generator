/*
 * The rules of a mock exam, stated once and used on both sides: by the client
 * (its reducer, resuming an unfinished exam, scoring for the results screen
 * and for visitors) and by the server (accepting an exam, storing its state,
 * scoring the attempt it records). The server stays the authority for what is
 * recorded; it just asks these rules.
 *
 * Questions are referred to by their id (slug) and options by their original
 * index, never by database ids: the server converts at its storage.
 *
 * Pure: relative imports only, nothing server-side.
 */

import type { AnswerKey } from '../quizzes/question'
import {
  isCorrectPick,
  isIndex,
  isLegalPick,
  isPermutation,
  isUnique,
} from '../quizzes/question'

/** Allowance for a save or submit sent right at the deadline (the network). */
const GRACE_MS = 30_000

/** A question of an exam: which one, and the order its options are shown in. */
export interface PlannedExamQuestion {
  questionId: string
  /** Original option indexes in the order shown. */
  optionOrder: ReadonlyArray<number>
}

/** The state of an exam while it runs, per position in the exam. */
export interface ExamProgress {
  /** Position of the question being shown. */
  current: number
  reviewing: boolean
  /** Positions flagged for review (within the exam; not user flags). */
  flagged: ReadonlyArray<number>
  /** Original option indexes picked, per position. */
  picks: ReadonlyArray<ReadonlyArray<number>>
}

/** An unfinished exam as stored, for the client to resume. */
export interface StoredExam {
  id: string
  /** Epoch ms, on the server's clock. */
  startedAt: number
  endsAt: number
  current: number
  reviewing: boolean
  passPercent: number
  questions: Array<
    PlannedExamQuestion & {
      optionOrder: Array<number>
      picks: Array<number>
      flagged: boolean
    }
  >
}

/**
 * Whether the questions drawn for a new exam exist in the quiz (by id), each
 * once, with their options in a complete order.
 */
export function isLegalPlan(
  plan: ReadonlyArray<PlannedExamQuestion>,
  optionCounts: ReadonlyMap<string, number>,
): boolean {
  const seen = new Set<string>()
  return (
    plan.length > 0 &&
    plan.every(({ questionId, optionOrder }) => {
      const count = optionCounts.get(questionId)
      if (count === undefined || seen.has(questionId)) return false
      seen.add(questionId)
      return isPermutation(optionOrder, count)
    })
  )
}

/** Whether a running exam's state fits its questions. */
export function isLegalProgress(
  questions: ReadonlyArray<AnswerKey>,
  progress: ExamProgress,
): boolean {
  const count = questions.length
  return (
    isIndex(progress.current, count) &&
    progress.picks.length === count &&
    isUnique(progress.flagged) &&
    progress.flagged.every((position) => isIndex(position, count)) &&
    progress.picks.every((pick, position) =>
      isLegalPick(questions[position], pick),
    )
  )
}

/** The number of questions answered correctly; unanswered ones are wrong. */
export function scoreExam(
  questions: ReadonlyArray<AnswerKey>,
  picks: ReadonlyArray<ReadonlyArray<number>>,
): number {
  return questions.filter((question, position) =>
    isCorrectPick(question.correct, picks.at(position) ?? []),
  ).length
}

/** The deadline (epoch ms) of an exam of `minutes` started at `startedAt`. */
export function examDeadline(startedAt: number, minutes: number): number {
  return startedAt + minutes * 60_000
}

/** The time limit, in whole minutes, of an exam with these times. */
export function examMinutes(startedAt: number, endsAt: number): number {
  return Math.max(1, Math.round((endsAt - startedAt) / 60_000))
}

/** Whether the time is up (the client's view: no grace). */
export function isTimeUp(endsAt: number, now: number): boolean {
  return now >= endsAt
}

/** Whether the server still accepts the exam's state (deadline plus grace). */
export function acceptsState(endsAt: number, now: number): boolean {
  return now <= endsAt + GRACE_MS
}

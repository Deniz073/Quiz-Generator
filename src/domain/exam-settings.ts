/*
 * Exam settings: the question count, time limit and pass mark of a mock exam.
 * A quiz defines the defaults; a user may override any of them for themselves
 * (only the values that differ are stored, so a quiz whose defaults change
 * later still applies them to everything the user didn't adjust). Visitors
 * always get the defaults.
 *
 * Pure rules, shared by the client, the server functions and the database
 * schema (its check constraint): relative imports only, nothing server-side.
 */

import type { ExamConfig } from '../quizzes/types'

/** Upper bound of the time limit a user can set, in minutes. */
export const MAX_EXAM_MINUTES = 600

export type ExamOverrides = Partial<ExamConfig>

interface Range {
  min: number
  max: number
}

export type ExamLimits = Record<keyof ExamConfig, Range>

const KEYS = ['questionCount', 'minutes', 'passPercent'] as const

/** What a user may choose for each setting of a quiz with this many questions. */
export function getExamLimits(totalQuestions: number): ExamLimits {
  return {
    questionCount: { min: 1, max: totalQuestions },
    minutes: { min: 1, max: MAX_EXAM_MINUTES },
    passPercent: { min: 1, max: 100 },
  }
}

export function isInRange(
  value: unknown,
  { min, max }: Range,
): value is number {
  return (
    typeof value === 'number' &&
    Number.isInteger(value) &&
    value >= min &&
    value <= max
  )
}

/**
 * The settings in effect: the quiz's defaults with the user's valid overrides
 * applied. Each value is checked on its own, so one bad value (e.g. a question
 * count above a quiz that lost questions) doesn't discard the others.
 */
export function resolveExamConfig(
  defaults: ExamConfig,
  overrides: ExamOverrides | undefined,
  totalQuestions: number,
): ExamConfig {
  const limits = getExamLimits(totalQuestions)
  const pick = (key: keyof ExamConfig) => {
    const value = overrides?.[key]
    return isInRange(value, limits[key]) ? value : defaults[key]
  }
  return {
    questionCount: pick('questionCount'),
    minutes: pick('minutes'),
    passPercent: pick('passPercent'),
  }
}

/** Whether every given override is allowed for a quiz with this many questions. */
export function areValidOverrides(
  overrides: ExamOverrides,
  totalQuestions: number,
): boolean {
  const limits = getExamLimits(totalQuestions)
  return KEYS.every(
    (key) =>
      overrides[key] === undefined || isInRange(overrides[key], limits[key]),
  )
}

/** Only the values of `config` that differ from `defaults`. */
export function toOverrides(
  defaults: ExamConfig,
  config: ExamConfig,
): ExamOverrides {
  const overrides: ExamOverrides = {}
  for (const key of KEYS) {
    if (config[key] !== defaults[key]) overrides[key] = config[key]
  }
  return overrides
}

/** Whether an exam was started with exactly the settings in effect. */
export function matchesExamConfig(
  config: ExamConfig,
  started: { questionCount: number; minutes: number; passPercent: number },
): boolean {
  return KEYS.every((key) => config[key] === started[key])
}

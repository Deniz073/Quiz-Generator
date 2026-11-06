/*
 * Exam settings: the question count, time limit and pass mark of a mock exam.
 * A quiz defines the defaults; a user may override any of them for themselves
 * (only the values that differ are stored, so a quiz whose defaults change
 * later still applies them to everything the user didn't adjust). Visitors
 * always get the defaults.
 *
 * Pure rules, shared by the client and the server functions: relative
 * imports only, nothing server-side.
 */

import type { ExamConfig } from '../quizzes/types'
import { EXAM_SETTINGS, getExamLimits, isInRange } from '../quizzes/rules'

export type ExamOverrides = Partial<ExamConfig>

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
  return EXAM_SETTINGS.every(
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
  for (const key of EXAM_SETTINGS) {
    if (config[key] !== defaults[key]) overrides[key] = config[key]
  }
  return overrides
}

/** Whether an exam was started with exactly the settings in effect. */
export function matchesExamConfig(
  config: ExamConfig,
  started: { questionCount: number; minutes: number; passPercent: number },
): boolean {
  return EXAM_SETTINGS.every((key) => config[key] === started[key])
}

/** "20 questions, 30 minutes, pass mark 70%". */
export function describeExamConfig(config: ExamConfig): string {
  return `${config.questionCount} questions, ${config.minutes} minutes, pass mark ${config.passPercent}%`
}

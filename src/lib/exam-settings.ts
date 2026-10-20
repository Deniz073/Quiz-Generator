/*
 * The user's own mock exam settings per quiz (question count, time limit, pass
 * mark), kept in one versioned localStorage key. Only values that differ from
 * the quiz's `exam` config are stored, so a quiz whose defaults change later
 * still applies them to everything the user didn't adjust. Like ./progress,
 * nothing here throws: unreadable or out-of-range values fall back to the
 * quiz's defaults. Bump the key's version if the shape ever changes
 * incompatibly.
 */

import type { ExamConfig, Quiz } from '#/quizzes/types'
import { createBrowserStore } from '#/lib/browser-store'
import { STORAGE_KEYS } from '#/lib/storage-keys'
import { countQuestions } from '#/quizzes'

const STORAGE_KEY = STORAGE_KEYS.examSettings

/** Upper bound of the time limit a user can set, in minutes. */
export const MAX_EXAM_MINUTES = 600

type Overrides = Partial<ExamConfig>

/** Keyed by quiz id. */
type ExamSettings = Partial<Record<string, Overrides>>

const EMPTY: ExamSettings = Object.freeze({})

export interface ExamLimits {
  questionCount: { min: number; max: number }
  minutes: { min: number; max: number }
  passPercent: { min: number; max: number }
}

/** What a user may choose for each setting of this quiz's exam. */
export function getExamLimits(quiz: Quiz): ExamLimits {
  return {
    questionCount: { min: 1, max: countQuestions(quiz) },
    minutes: { min: 1, max: MAX_EXAM_MINUTES },
    passPercent: { min: 1, max: 100 },
  }
}

function isInRange(value: unknown, { min, max }: { min: number; max: number }) {
  return (
    typeof value === 'number' &&
    Number.isInteger(value) &&
    value >= min &&
    value <= max
  )
}

/**
 * The quiz's defaults with the user's valid overrides applied. Each value is
 * checked on its own, so one bad value (e.g. a question count above a quiz
 * that lost questions) doesn't discard the others.
 */
export function resolveExamConfig(
  quiz: Quiz,
  defaults: ExamConfig,
  overrides: Overrides | undefined,
): ExamConfig {
  const limits = getExamLimits(quiz)
  const pick = (key: keyof ExamConfig) => {
    const value = overrides?.[key]
    return isInRange(value, limits[key]) ? (value as number) : defaults[key]
  }
  return {
    questionCount: pick('questionCount'),
    minutes: pick('minutes'),
    passPercent: pick('passPercent'),
  }
}

// --- Parsing --------------------------------------------------------------

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function parseSettings(raw: string | null): ExamSettings {
  if (raw === null) return EMPTY
  let data: unknown
  try {
    data = JSON.parse(raw)
  } catch {
    return EMPTY
  }
  if (!isRecord(data)) return EMPTY
  // Ranges depend on the quiz, so they are checked in resolveExamConfig; here
  // only the shape. fromEntries is safe for keys such as "__proto__".
  return Object.fromEntries(
    Object.entries(data).flatMap(([quizId, entry]) => {
      if (!isRecord(entry)) return []
      const overrides: Overrides = {}
      for (const key of ['questionCount', 'minutes', 'passPercent'] as const) {
        const value = entry[key]
        if (typeof value === 'number') overrides[key] = value
      }
      return [[quizId, overrides] as const]
    }),
  )
}

// --- Storage and subscriptions ---------------------------------------------

const store = createBrowserStore({
  keys: [STORAGE_KEY],
  parse: ([raw]) => parseSettings(raw),
  serverSnapshot: EMPTY,
})

/**
 * Snapshot for useSyncExternalStore. The server and the first client render
 * (hydration) see no adjusted settings.
 */
export const {
  getSnapshot: getExamSettingsSnapshot,
  getServerSnapshot: getServerExamSettingsSnapshot,
  subscribe: subscribeExamSettings,
} = store

/** The exam config the user chose for this quiz, read now. Client only. */
export function readExamConfig(quiz: Quiz, defaults: ExamConfig): ExamConfig {
  return resolveExamConfig(quiz, defaults, getExamSettingsSnapshot()[quiz.id])
}

/**
 * Saves the user's settings for a quiz, keeping only the values that differ
 * from the defaults (none left: the entry is removed). False if storage
 * failed.
 */
export function saveExamSettings(
  quizId: string,
  defaults: ExamConfig,
  config: ExamConfig,
): boolean {
  const overrides: Overrides = {}
  for (const key of ['questionCount', 'minutes', 'passPercent'] as const) {
    if (config[key] !== defaults[key]) overrides[key] = config[key]
  }
  const others = Object.entries(getExamSettingsSnapshot()).filter(
    ([id]) => id !== quizId,
  )
  const next = Object.keys(overrides).length
    ? [...others, [quizId, overrides] as const]
    : others
  return store.write(STORAGE_KEY, JSON.stringify(Object.fromEntries(next)))
}

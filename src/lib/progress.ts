/*
 * Saved progress: best and last result per chapter and per mock exam, kept in
 * one versioned localStorage key. Everything here tolerates a missing,
 * corrupt or unavailable storage: reads fall back to "no data", writes never
 * throw. Bump the key's version if the shape ever changes incompatibly.
 */

import { createBrowserStore } from '#/lib/browser-store'
import { STORAGE_KEYS } from '#/lib/storage-keys'

const STORAGE_KEY = STORAGE_KEYS.progress

export interface Attempt {
  score: number
  total: number
  /** ISO timestamp of when the run finished. */
  at: string
}

export interface Result {
  /** Highest percentage; on a tie the most recent attempt. */
  best: Attempt
  last: Attempt
}

export interface QuizProgress {
  /** Keyed by chapter id. */
  chapters: Partial<Record<string, Result>>
  exam?: Result
}

/** Keyed by quiz id. */
export type Progress = Partial<Record<string, QuizProgress>>

export type ProgressTarget = { chapterId: string } | { exam: true }

const EMPTY: Progress = Object.freeze({})

export function toPercent(attempt: Pick<Attempt, 'score' | 'total'>): number {
  return attempt.total === 0
    ? 0
    : Math.round((attempt.score / attempt.total) * 100)
}

/** Whether `score` of `total` reaches the pass mark (a percentage). */
export function isPassed(
  score: number,
  total: number,
  passPercent: number,
): boolean {
  return score * 100 >= passPercent * total
}

/** e.g. "Best 12/14 (86%) · Last 10/14". */
export function formatResult({ best, last }: Result): string {
  return `Best ${best.score}/${best.total} (${toPercent(best)}%) · Last ${last.score}/${last.total}`
}

// --- Parsing --------------------------------------------------------------

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function parseAttempt(value: unknown): Attempt | undefined {
  if (!isRecord(value)) return undefined
  const { score, total, at } = value
  if (
    typeof score !== 'number' ||
    typeof total !== 'number' ||
    typeof at !== 'string' ||
    !Number.isInteger(score) ||
    !Number.isInteger(total) ||
    total < 1 ||
    score < 0 ||
    score > total ||
    Number.isNaN(Date.parse(at))
  ) {
    return undefined
  }
  return { score, total, at }
}

function parseResult(value: unknown): Result | undefined {
  if (!isRecord(value)) return undefined
  const best = parseAttempt(value.best)
  const last = parseAttempt(value.last)
  return best && last ? { best, last } : undefined
}

/** Keeps the valid entries of a `{ [key]: Result }` object. */
function parseResults(value: unknown): Partial<Record<string, Result>> {
  if (!isRecord(value)) return {}
  // fromEntries (unlike assignment) is safe for keys such as "__proto__".
  return Object.fromEntries(
    Object.entries(value).flatMap(([key, entry]) => {
      const result = parseResult(entry)
      return result ? [[key, result] as const] : []
    }),
  )
}

function parseProgress(raw: string | null): Progress {
  if (raw === null) return EMPTY
  let data: unknown
  try {
    data = JSON.parse(raw)
  } catch {
    // Corrupt value (e.g. edited by hand): behave as if nothing was saved.
    return EMPTY
  }
  if (!isRecord(data)) return EMPTY
  return Object.fromEntries(
    Object.entries(data).flatMap(([quizId, entry]) => {
      if (!isRecord(entry)) return []
      const progress: QuizProgress = {
        chapters: parseResults(entry.chapters),
        exam: parseResult(entry.exam),
      }
      return [[quizId, progress] as const]
    }),
  )
}

// --- Storage and subscriptions ---------------------------------------------

const store = createBrowserStore({
  keys: [STORAGE_KEY],
  parse: ([raw]) => parseProgress(raw),
  serverSnapshot: EMPTY,
})

/**
 * Snapshot for useSyncExternalStore. The server and the first client render
 * (hydration) see no saved progress.
 */
export const {
  getSnapshot: getProgressSnapshot,
  getServerSnapshot: getServerProgressSnapshot,
  subscribe: subscribeProgress,
} = store

// --- Recording --------------------------------------------------------------

function isBetter(candidate: Attempt, current: Attempt): boolean {
  // Cross-multiplied percentage comparison; ties go to the newer attempt.
  return candidate.score * current.total >= current.score * candidate.total
}

function withAttempt(previous: Result | undefined, attempt: Attempt): Result {
  return {
    best:
      previous && !isBetter(attempt, previous.best) ? previous.best : attempt,
    last: attempt,
  }
}

/**
 * Saves a finished full run. Never throws: if storage is unavailable or full
 * the result is simply not saved.
 */
export function recordResult(
  quizId: string,
  target: ProgressTarget,
  score: number,
  total: number,
): void {
  if (total < 1) return
  const attempt: Attempt = { score, total, at: new Date().toISOString() }
  const progress = getProgressSnapshot()
  const quiz: QuizProgress = progress[quizId] ?? { chapters: {} }
  const updated: QuizProgress =
    'exam' in target
      ? { ...quiz, exam: withAttempt(quiz.exam, attempt) }
      : {
          ...quiz,
          chapters: {
            ...quiz.chapters,
            [target.chapterId]: withAttempt(
              quiz.chapters[target.chapterId],
              attempt,
            ),
          },
        }

  store.write(STORAGE_KEY, JSON.stringify({ ...progress, [quizId]: updated }))
}

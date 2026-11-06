import { useCallback, useMemo, useSyncExternalStore } from 'react'
import { useRouteContext } from '@tanstack/react-router'
import type { ExamConfig, Question, Quiz } from '#/quizzes/types'
import type { QuizUserData } from '#/lib/user-data-api'
import type { Attempt, ProgressTarget, QuizProgress } from '#/domain/progress'
import type { ExamOverrides } from '#/domain/exam-settings'
import { resolveExamConfig, toOverrides } from '#/domain/exam-settings'
import { withProgress } from '#/domain/progress'
import { countQuestions } from '#/quizzes'
import {
  fetchQuizUserData,
  recordChapterAttempt,
  saveExamOverrides,
  setQuestionFlag,
} from '#/lib/user-data-api'

/*
 * The signed-in user's state per quiz (progress, flags, exam settings) on the
 * client: fetched from the server when a page first needs it, refreshed in
 * the background whenever another page needs it again, and updated at once
 * when the user changes something (the server call follows; if it fails the
 * data is fetched again, so the page shows what was really saved).
 *
 * Visitors have no state: they read empty data and nothing is sent. The cache
 * is keyed by user, so signing out or in never shows someone else's data.
 * The server and the first client render see "not loaded" (undefined).
 */

interface Entry {
  data?: QuizUserData
  /** Bumped by every local change, so an older fetch can't overwrite it. */
  version: number
  loading?: Promise<void>
  /** Failed loads in a row, for the retry delay. */
  failures: number
  /** Writes to the server, one after another, so they arrive in order. */
  writes: Promise<unknown>
}

/** Retries of a failed load (while a page uses the data), after 1s, 3s, 9s. */
const MAX_RETRIES = 3

const VISITOR_DATA: QuizUserData = Object.freeze({
  progress: Object.freeze({ chapters: Object.freeze({}) }),
  flags: [],
  examOverrides: Object.freeze({}),
})

const entries = new Map<string, Entry>()
const listeners = new Map<string, Set<() => void>>()

function cacheKey(userId: string, quizId: string): string {
  return `${userId}\u0000${quizId}`
}

function notify(key: string) {
  listeners.get(key)?.forEach((listener) => listener())
}

function entry(key: string): Entry {
  let found = entries.get(key)
  if (!found) {
    found = { version: 0, failures: 0, writes: Promise.resolve() }
    entries.set(key, found)
  }
  return found
}

function load(key: string, quizId: string): Promise<void> {
  const current = entry(key)
  if (current.loading) return current.loading
  const version = current.version
  const loading = fetchQuizUserData({ data: { quizId } })
    .then((data) => {
      // A local change since the fetch started is newer than its answer.
      current.failures = 0
      if (current.version !== version) return
      current.data = data ?? VISITOR_DATA
      notify(key)
    })
    .catch((error: unknown) => {
      console.error('Could not load your progress', error)
      // Try again while a page still shows this quiz; until then nothing is
      // claimed (no flags, no progress) rather than showing stale data.
      if (current.failures >= MAX_RETRIES) return
      const delay = 1000 * 3 ** current.failures
      current.failures += 1
      setTimeout(() => {
        if (listeners.get(key)?.size) void load(key, quizId)
      }, delay)
    })
    .finally(() => {
      current.loading = undefined
    })
  current.loading = loading
  return loading
}

/**
 * Applies a local change at once, if the data has loaded; false if it hasn't.
 * Either way a fetch already running may predate the change, so its answer is
 * ignored (version).
 */
function update(
  key: string,
  change: (data: QuizUserData) => QuizUserData,
): boolean {
  const current = entry(key)
  current.version += 1
  if (!current.data) return false
  current.data = change(current.data)
  notify(key)
  return true
}

/** Fetches again once a fetch already running is done. */
function refetch(key: string, quizId: string) {
  const current = entry(key)
  current.version += 1
  void (current.loading ?? Promise.resolve()).then(() => load(key, quizId))
}

/**
 * Sends a change to the server after the earlier ones (so e.g. flag, unflag
 * can't arrive the other way round), then follows it up: on failure, back to
 * what the server has; on success, fetch if the change couldn't be shown
 * locally.
 */
function afterSave(
  key: string,
  quizId: string,
  applied: boolean,
  send: () => Promise<unknown>,
): Promise<void> {
  const current = entry(key)
  const request = current.writes.then(send, send)
  current.writes = request.catch(() => {})
  return request.then(
    () => {
      if (!applied) refetch(key, quizId)
    },
    (error: unknown) => {
      console.error('Could not save your progress', error)
      refetch(key, quizId)
      throw error
    },
  )
}

function subscribe(key: string, quizId: string, listener: () => void) {
  let set = listeners.get(key)
  if (!set) {
    set = new Set()
    listeners.set(key, set)
  }
  set.add(listener)
  // Every page that starts using the data refreshes it in the background.
  if (set.size === 1) void load(key, quizId)
  return () => {
    set.delete(listener)
  }
}

/** The signed-in user's id, or undefined for a visitor. */
export function useUserId(): string | undefined {
  return useRouteContext({
    from: '__root__',
    select: (context) => context.user?.id,
  })
}

export function useSignedIn(): boolean {
  return useUserId() !== undefined
}

/** The user's state for a quiz; undefined until loaded, empty for visitors. */
function useQuizUserData(quizId: string): QuizUserData | undefined {
  const userId = useUserId()
  const key = userId ? cacheKey(userId, quizId) : undefined
  const sub = useCallback(
    (listener: () => void) =>
      key ? subscribe(key, quizId, listener) : () => {},
    [key, quizId],
  )
  const getSnapshot = useCallback(
    () => (key ? entries.get(key)?.data : VISITOR_DATA),
    [key],
  )
  return useSyncExternalStore(sub, getSnapshot, () => undefined)
}

/** Saved progress of a quiz, or undefined if there is none (yet). */
export function useQuizProgress(quizId: string): QuizProgress | undefined {
  return useQuizUserData(quizId)?.progress
}

/** Flagged question ids of a quiz, or undefined until loaded. */
export function useFlags(quizId: string): ReadonlySet<string> | undefined {
  const flags = useQuizUserData(quizId)?.flags
  return useMemo(() => (flags ? new Set(flags) : undefined), [flags])
}

/** The user's adjustments of a quiz's mock exam settings, or undefined until loaded. */
function useExamOverrides(quizId: string): ExamOverrides | undefined {
  return useQuizUserData(quizId)?.examOverrides
}

/**
 * The mock exam settings in effect for a quiz: its defaults with the user's
 * adjustments. The defaults until the adjustments have loaded.
 */
export function useExamConfig(quiz: Quiz, defaults: ExamConfig): ExamConfig {
  return resolveExamConfig(
    defaults,
    useExamOverrides(quiz.id),
    countQuestions(quiz),
  )
}

/** The current flags of a quiz, read now (e.g. to build a new round). */
export function readFlags(
  userId: string | undefined,
  quizId: string,
): ReadonlySet<string> {
  if (!userId) return new Set()
  return new Set(entries.get(cacheKey(userId, quizId))?.data?.flags)
}

/**
 * Flags or unflags a question. Signed-in users only. Does nothing until the
 * flags have loaded: before that it isn't known which of the two it would be.
 */
export function toggleFlag(
  userId: string,
  quizId: string,
  question: Question,
): void {
  const key = cacheKey(userId, quizId)
  const flags = entries.get(key)?.data?.flags
  if (!flags) return
  const flagged = !flags.includes(question.id)
  const applied = update(key, (data) => ({
    ...data,
    flags: flagged
      ? [...data.flags, question.id]
      : data.flags.filter((id) => id !== question.id),
  }))
  afterSave(key, quizId, applied, () =>
    setQuestionFlag({ data: { quizId, questionId: question.id, flagged } }),
  ).catch(() => {})
}

/** Records a finished full chapter run. Signed-in users only. */
export function saveChapterAttempt(
  userId: string,
  quizId: string,
  chapterId: string,
  score: number,
  total: number,
): void {
  const key = cacheKey(userId, quizId)
  const applied = addAttempt(
    key,
    { chapterId },
    { score, total, at: new Date().toISOString() },
  )
  afterSave(key, quizId, applied, () =>
    recordChapterAttempt({ data: { quizId, chapterId, score, total } }),
  ).catch(() => {})
}

/** Shows a mock exam result the server has recorded (see ./exam-api). */
export function noteExamAttempt(
  userId: string,
  quizId: string,
  attempt: Attempt,
): void {
  const key = cacheKey(userId, quizId)
  if (!addAttempt(key, { exam: true }, attempt)) refetch(key, quizId)
}

function addAttempt(
  key: string,
  target: ProgressTarget,
  attempt: Attempt,
): boolean {
  return update(key, (data) => ({
    ...data,
    progress: withProgress(data.progress, target, attempt),
  }))
}

/** Saves the user's mock exam settings for a quiz. Signed-in users only. */
export async function saveExamSettings(
  userId: string,
  quizId: string,
  defaults: ExamConfig,
  config: ExamConfig,
): Promise<void> {
  const key = cacheKey(userId, quizId)
  const overrides = toOverrides(defaults, config)
  const applied = update(key, (data) => ({ ...data, examOverrides: overrides }))
  await afterSave(key, quizId, applied, () =>
    saveExamOverrides({ data: { quizId, overrides } }),
  )
}

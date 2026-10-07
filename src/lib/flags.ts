/*
 * Flagged questions, saved across rounds in one versioned localStorage key so
 * they can be practiced later (see the flagged route). A flag is the question
 * id, per quiz: flags of removed questions are simply never matched. Like
 * ./progress, this tolerates missing, corrupt or unavailable storage.
 * The mock exam keeps its own in-exam flags (see ./exam-state).
 */

import { getQuiz } from '#/quizzes'
import type { Question, Quiz } from '#/quizzes/types'

const STORAGE_KEY = 'quiz-generator:flags:v2'
/**
 * v1 stored question texts (questions had no id). Read only while there is no
 * v2 value, then converted to ids; left in place so an older app version still
 * finds its flags.
 */
const LEGACY_STORAGE_KEY = 'quiz-generator:flags:v1'

/** Keyed by quiz id: flagged question ids. */
export type Flags = Partial<Record<string, ReadonlyArray<string>>>

const EMPTY: Flags = Object.freeze({})

function parseFlags(raw: string | null): Flags {
  if (raw === null) return EMPTY
  let data: unknown
  try {
    data = JSON.parse(raw)
  } catch {
    // Corrupt value (e.g. edited by hand): behave as if nothing was saved.
    return EMPTY
  }
  if (typeof data !== 'object' || data === null || Array.isArray(data)) {
    return EMPTY
  }
  // fromEntries (unlike assignment) is safe for keys such as "__proto__".
  return Object.fromEntries(
    Object.entries(data).flatMap(([quizId, values]) =>
      Array.isArray(values)
        ? [
            [
              quizId,
              values.filter(
                (value): value is string => typeof value === 'string',
              ),
            ] as const,
          ]
        : [],
    ),
  )
}

/** v1 flags (question texts) to ids; texts no longer in the quiz are dropped. */
function migrateLegacyFlags(legacy: Flags): Flags {
  return Object.fromEntries(
    Object.entries(legacy).map(([quizId, texts = []]) => {
      const idByText = new Map(
        getQuiz(quizId)
          ?.chapters.flatMap((chapter) => chapter.questions)
          .map((question) => [question.question, question.id]),
      )
      return [
        quizId,
        texts.flatMap((text) => {
          const id = idByText.get(text)
          return id === undefined ? [] : [id]
        }),
      ] as const
    }),
  )
}

// --- Storage and subscriptions ---------------------------------------------

function readRaw(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    // Unavailable (e.g. blocked storage) or on the server.
    return null
  }
}

let cachedRaw: string | null | undefined
let cachedLegacyRaw: string | null | undefined
let cachedFlags: Flags = EMPTY

/** Snapshot for useSyncExternalStore; same object until the stored strings change. */
export function getFlagsSnapshot(): Flags {
  const raw = readRaw(STORAGE_KEY)
  const legacyRaw = raw === null ? readRaw(LEGACY_STORAGE_KEY) : null
  if (raw !== cachedRaw || legacyRaw !== cachedLegacyRaw) {
    cachedRaw = raw
    cachedLegacyRaw = legacyRaw
    cachedFlags =
      raw !== null
        ? parseFlags(raw)
        : legacyRaw !== null
          ? migrateLegacyFlags(parseFlags(legacyRaw))
          : EMPTY
  }
  return cachedFlags
}

/** What the server (and the first client render) sees: not loaded yet. */
export function getServerFlagsSnapshot(): null {
  return null
}

const listeners = new Set<() => void>()

function notify() {
  listeners.forEach((listener) => listener())
}

export function subscribeFlags(listener: () => void): () => void {
  if (listeners.size === 0) window.addEventListener('storage', onStorage)
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
    if (listeners.size === 0) window.removeEventListener('storage', onStorage)
  }
}

/** Another tab changed (or cleared) the data. */
function onStorage(event: StorageEvent) {
  if (
    event.key === null ||
    event.key === STORAGE_KEY ||
    event.key === LEGACY_STORAGE_KEY
  ) {
    notify()
  }
}

// --- Reading and writing ----------------------------------------------------

/** Flags or unflags a question. Never throws: if storage fails it isn't saved. */
export function toggleFlag(quizId: string, question: Question): void {
  const flags = getFlagsSnapshot()
  const current = flags[quizId] ?? []
  const updated = current.includes(question.id)
    ? current.filter((id) => id !== question.id)
    : [...current, question.id]

  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...flags, [quizId]: updated }),
    )
  } catch (error) {
    console.warn('Could not save flagged question', error)
    return
  }
  notify()
}

/** Questions of a quiz (or of one of its chapters) that are flagged. */
export function getFlaggedQuestions(
  quiz: Quiz,
  flagged: ReadonlySet<string>,
  chapterId?: string,
): Array<Question> {
  return quiz.chapters
    .filter((chapter) => chapterId === undefined || chapter.id === chapterId)
    .flatMap((chapter) => chapter.questions)
    .filter((question) => flagged.has(question.id))
}

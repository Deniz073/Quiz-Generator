/*
 * Flagged questions, saved across rounds in one versioned localStorage key so
 * they can be practiced later (see the flagged route). A flag is the question
 * id, per quiz: flags of removed questions are simply never matched. Like
 * ./progress, this tolerates missing, corrupt or unavailable storage.
 * The mock exam keeps its own in-exam flags (see ./exam-state).
 */

import { createBrowserStore } from '#/lib/browser-store'
import { STORAGE_KEYS } from '#/lib/storage-keys'
import type { Question, Quiz } from '#/quizzes/types'

const STORAGE_KEY = STORAGE_KEYS.flags
/**
 * v1 stored question texts (questions had no id). Read only by
 * `migrateLegacyFlags`, which converts a quiz's flags to ids the first time
 * the quiz is shown; left in place so an older app version still finds its
 * flags.
 */
const LEGACY_STORAGE_KEY = STORAGE_KEYS.flagsLegacy

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

// --- Storage and subscriptions ---------------------------------------------

const store = createBrowserStore<Flags, null>({
  keys: [STORAGE_KEY],
  parse: ([raw]) => (raw !== null ? parseFlags(raw) : EMPTY),
  // Not loaded yet: nothing is claimed about the flags until the client reads
  // them.
  serverSnapshot: null,
})

/** Only the first call after a change parses; null on the server. */
export const {
  getSnapshot: getFlagsSnapshot,
  getServerSnapshot: getServerFlagsSnapshot,
  subscribe: subscribeFlags,
} = store

// --- Reading and writing ----------------------------------------------------

/**
 * Converts one quiz's v1 flags (question texts) to ids, once the quiz is
 * loaded; texts no longer in the quiz are dropped. Does nothing if v2 already
 * has an entry for the quiz (an unflagged-everything entry counts), so it
 * runs at most once per quiz. The v1 value is left in place. Never throws.
 */
export function migrateLegacyFlags(quiz: Quiz): void {
  if (getFlagsSnapshot()[quiz.id] !== undefined) return
  let legacyRaw: string | null
  try {
    legacyRaw = localStorage.getItem(LEGACY_STORAGE_KEY)
  } catch {
    return
  }
  if (legacyRaw === null) return
  const texts = parseFlags(legacyRaw)[quiz.id]
  if (texts === undefined) return

  const idByText = new Map(
    quiz.chapters
      .flatMap((chapter) => chapter.questions)
      .map((question) => [question.question, question.id] as const),
  )
  const ids = texts.flatMap((text) => {
    const id = idByText.get(text)
    return id === undefined ? [] : [id]
  })
  // Read again: the snapshot may have changed while the quiz was loading.
  store.write(
    STORAGE_KEY,
    JSON.stringify({ ...getFlagsSnapshot(), [quiz.id]: ids }),
  )
}

/** Flags or unflags a question. Never throws: if storage fails it isn't saved. */
export function toggleFlag(quizId: string, question: Question): void {
  const flags = getFlagsSnapshot()
  const current = flags[quizId] ?? []
  const updated = current.includes(question.id)
    ? current.filter((id) => id !== question.id)
    : [...current, question.id]

  store.write(STORAGE_KEY, JSON.stringify({ ...flags, [quizId]: updated }))
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

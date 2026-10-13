/*
 * Flagged questions, saved across rounds in one versioned localStorage key so
 * they can be practiced later (see the flagged route). A flag is the question
 * id, per quiz: flags of removed questions are simply never matched. Like
 * ./progress, this tolerates missing, corrupt or unavailable storage.
 * The mock exam keeps its own in-exam flags (see ./exam-state).
 */

import { createBrowserStore } from '#/lib/browser-store'
import { STORAGE_KEYS } from '#/lib/storage-keys'
import { getQuiz } from '#/quizzes'
import type { Question, Quiz } from '#/quizzes/types'

const STORAGE_KEY = STORAGE_KEYS.flags
/**
 * v1 stored question texts (questions had no id). Read only while there is no
 * v2 value, then converted to ids; left in place so an older app version still
 * finds its flags.
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

const store = createBrowserStore<Flags, null>({
  keys: [STORAGE_KEY, LEGACY_STORAGE_KEY],
  parse: ([raw, legacyRaw]) =>
    raw !== null
      ? parseFlags(raw)
      : legacyRaw !== null
        ? migrateLegacyFlags(parseFlags(legacyRaw))
        : EMPTY,
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

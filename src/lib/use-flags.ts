import { useEffect, useMemo, useSyncExternalStore } from 'react'
import type { Quiz } from '#/quizzes/types'
import {
  getFlagsSnapshot,
  getServerFlagsSnapshot,
  migrateLegacyFlags,
  subscribeFlags,
} from '#/lib/flags'

/**
 * Brings the flags an older app version saved for this quiz (question texts)
 * over to question ids. Every page of a quiz calls it (through the page
 * header or the quiz page), so it also runs on a direct load of any of them.
 */
export function useMigrateLegacyFlags(quiz: Quiz): void {
  useEffect(() => {
    migrateLegacyFlags(quiz)
  }, [quiz])
}

/**
 * Flagged question ids of a quiz, or undefined until loaded. localStorage
 * only exists in the browser, so the server and the first client render
 * (hydration) see undefined; the saved flags appear right after.
 */
export function useFlags(quizId: string): ReadonlySet<string> | undefined {
  const flags = useSyncExternalStore(
    subscribeFlags,
    getFlagsSnapshot,
    getServerFlagsSnapshot,
  )
  const ids = flags === null ? undefined : flags[quizId]
  const loaded = flags !== null
  return useMemo(() => (loaded ? new Set(ids) : undefined), [loaded, ids])
}

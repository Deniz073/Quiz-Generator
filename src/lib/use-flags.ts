import { useMemo, useSyncExternalStore } from 'react'
import {
  getFlagsSnapshot,
  getServerFlagsSnapshot,
  subscribeFlags,
} from '#/lib/flags'

/**
 * Flagged question texts of a quiz, or undefined until loaded. localStorage
 * only exists in the browser, so the server and the first client render
 * (hydration) see undefined; the saved flags appear right after.
 */
export function useFlags(quizId: string): ReadonlySet<string> | undefined {
  const flags = useSyncExternalStore(
    subscribeFlags,
    getFlagsSnapshot,
    getServerFlagsSnapshot,
  )
  const texts = flags === null ? undefined : flags[quizId]
  const loaded = flags !== null
  return useMemo(() => (loaded ? new Set(texts) : undefined), [loaded, texts])
}

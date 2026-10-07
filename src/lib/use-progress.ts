import { useSyncExternalStore } from 'react'
import {
  getProgressSnapshot,
  getServerProgressSnapshot,
  subscribeProgress,
} from '#/lib/progress'
import type { QuizProgress } from '#/lib/progress'

/**
 * Saved progress of a quiz, or undefined if there is none. localStorage only
 * exists in the browser, so the server and the first client render (hydration)
 * both see "no data"; the saved values appear right after.
 */
export function useQuizProgress(quizId: string): QuizProgress | undefined {
  const progress = useSyncExternalStore(
    subscribeProgress,
    getProgressSnapshot,
    getServerProgressSnapshot,
  )
  return progress[quizId]
}

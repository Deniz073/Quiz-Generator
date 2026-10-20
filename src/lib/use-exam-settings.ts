import { useSyncExternalStore } from 'react'
import type { ExamConfig, Quiz } from '#/quizzes/types'
import {
  getExamSettingsSnapshot,
  getServerExamSettingsSnapshot,
  resolveExamConfig,
  subscribeExamSettings,
} from '#/lib/exam-settings'

/**
 * The mock exam settings the user chose for a quiz: its defaults with their
 * adjustments applied. The server and the first client render (hydration) see
 * the defaults; adjusted values appear right after.
 */
export function useExamConfig(quiz: Quiz, defaults: ExamConfig): ExamConfig {
  const settings = useSyncExternalStore(
    subscribeExamSettings,
    getExamSettingsSnapshot,
    getServerExamSettingsSnapshot,
  )
  return resolveExamConfig(quiz, defaults, settings[quiz.id])
}

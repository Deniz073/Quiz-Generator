import type { Quiz } from '#/quizzes/types'
import ai901 from './ai-901'
import az900 from './az-900'
import psm1 from './psm-1'
import pspo1 from './pspo-1'

/**
 * Who a seed quiz belongs to: `built-in` quizzes have no owner and are
 * available to everyone; `seed-owner` quizzes become personal quizzes of the
 * user whose email is in SEED_OWNER_EMAIL (skipped when that user doesn't
 * exist yet).
 */
export type SeedOwner = 'built-in' | 'seed-owner'

export interface SeedQuiz {
  quiz: Quiz
  owner: SeedOwner
}

/** Every seed quiz. Add a quiz here after creating its folder (see AGENTS.md). */
export const seedQuizzes: ReadonlyArray<SeedQuiz> = [
  { quiz: pspo1, owner: 'built-in' },
  { quiz: psm1, owner: 'built-in' },
  { quiz: az900, owner: 'seed-owner' },
  { quiz: ai901, owner: 'seed-owner' },
]

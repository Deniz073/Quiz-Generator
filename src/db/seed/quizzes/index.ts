import type { Quiz } from '#/quizzes/types'
import psm1 from './psm-1'
import pspo1 from './pspo-1'

/**
 * Every seed quiz: built-in quizzes (no owner, available to everyone). Add a
 * quiz here after creating its folder (see AGENTS.md). Personal quizzes are
 * never seeded; they live only in the database.
 */
export const seedQuizzes: ReadonlyArray<Quiz> = [pspo1, psm1]

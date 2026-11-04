/*
 * Marketplace rules: which of a user's quizzes they may publish or delete.
 * Pure rules, shared by the client (which buttons to show) and the server
 * functions (which writes to allow): relative imports only.
 */

/** What the rules need to know of a quiz, as the user sees it. */
export interface QuizStanding {
  /** No owner: available to everyone, never published or deleted by a user. */
  builtIn: boolean
  /** Made by importing a published quiz. */
  imported: boolean
  /** Its owner has saved changes to it since it was created or imported. */
  edited: boolean
}

/**
 * Only an owner's own personal quizzes. An imported quiz only once its owner
 * has edited it (with the quiz assistant): republishing someone else's quiz
 * unchanged is not allowed.
 */
export function canPublish(quiz: QuizStanding): boolean {
  return !quiz.builtIn && (!quiz.imported || quiz.edited)
}

/** Any personal quiz; with it go the owner's progress and flags on it. */
export function canDelete(quiz: QuizStanding): boolean {
  return !quiz.builtIn
}

/** "imported 3 times", for a listing or the publisher's own quiz page. */
export function formatImports(count: number): string {
  if (count === 0) return 'not imported yet'
  return count === 1 ? 'imported once' : `imported ${count} times`
}

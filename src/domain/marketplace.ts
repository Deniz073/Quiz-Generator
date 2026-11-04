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
}

/**
 * Only an owner's own personal quizzes. An imported quiz may be published only
 * once its owner has edited it since importing it; quizzes can't be edited
 * yet, so for now an imported quiz is never published.
 */
export function canPublish(quiz: QuizStanding): boolean {
  return !quiz.builtIn && !quiz.imported
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

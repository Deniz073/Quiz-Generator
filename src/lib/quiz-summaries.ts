import { createServerFn } from '@tanstack/react-start'
import { loadQuizSummaries } from '#/quizzes'

/**
 * The home page's list. A server function, so the browser gets only these few
 * fields: loading the quizzes there just to count their questions would
 * download all of them.
 */
export const getQuizSummaries = createServerFn({ method: 'GET' }).handler(() =>
  loadQuizSummaries(),
)

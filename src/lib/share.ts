/**
 * Path of the page showing one question on its own (see the
 * quiz.$quizId.question.$questionId route), the link that "Share" hands out.
 * Question ids are stable (see src/quizzes/types.ts), so shared links keep
 * working when questions are added or reordered.
 */
export function questionPath(quizId: string, questionId: string): string {
  return `/quiz/${encodeURIComponent(quizId)}/question/${encodeURIComponent(questionId)}`
}

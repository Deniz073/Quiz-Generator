/*
 * Flags: a signed-in user's marks on questions to come back to, stored in the
 * database (question_flag) and kept on the client by ./user-data. A flag
 * refers to the question's id (slug); flags of removed questions are deleted
 * with them. The mock exam keeps its own in-exam flags (see ./exam-state).
 */

/** Where flags come from, for pages that have none to show yet. */
export const FLAGGING_HINT =
  'Use “Flag for review” during a chapter or practice round to collect questions here.'

export function getFlaggedQuestions<TQuestion extends { id: string }>(
  quiz: {
    chapters: ReadonlyArray<{ id: string; questions: ReadonlyArray<TQuestion> }>
  },
  flagged: ReadonlySet<string>,
  chapterId?: string,
): Array<TQuestion> {
  return quiz.chapters
    .filter((chapter) => chapterId === undefined || chapter.id === chapterId)
    .flatMap((chapter) => chapter.questions)
    .filter((question) => flagged.has(question.id))
}

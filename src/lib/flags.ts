/*
 * Flags: a signed-in user's marks on questions to come back to, stored in the
 * database (question_flag) and kept on the client by ./user-data. A flag
 * refers to the question's id (slug); flags of removed questions are deleted
 * with them. The mock exam keeps its own in-exam flags (see ./exam-state).
 */
import type { Question, Quiz } from '#/quizzes/types'

/** Questions of a quiz (or of one of its chapters) that are flagged. */
export function getFlaggedQuestions(
  quiz: Quiz,
  flagged: ReadonlySet<string>,
  chapterId?: string,
): Array<Question> {
  return quiz.chapters
    .filter((chapter) => chapterId === undefined || chapter.id === chapterId)
    .flatMap((chapter) => chapter.questions)
    .filter((question) => flagged.has(question.id))
}

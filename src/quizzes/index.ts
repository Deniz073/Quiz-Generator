import type { QuizOutline } from './types'

export function countQuestions(quiz: Pick<QuizOutline, 'chapters'>): number {
  return quiz.chapters.reduce(
    (total, chapter) => total + chapter.questions.length,
    0,
  )
}

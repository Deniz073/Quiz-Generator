import type { Quiz } from './types'

export function countQuestions(quiz: Pick<Quiz, 'chapters'>): number {
  return quiz.chapters.reduce(
    (total, chapter) => total + chapter.questions.length,
    0,
  )
}

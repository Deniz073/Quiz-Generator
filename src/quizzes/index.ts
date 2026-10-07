import type { Chapter, Quiz } from './types'
import { validateQuizzes } from './validate'

/**
 * Quizzes are auto-discovered: every `src/quizzes/<quiz-id>/index.ts` must
 * `export default` a `Quiz`. Adding a quiz = adding a folder; nothing to register.
 */
const modules = import.meta.glob<{ default?: Quiz }>('./*/index.ts', {
  eager: true,
})

function loadQuizzes(): Array<Quiz> {
  const loaded = Object.entries(modules).map(([path, module]) => {
    if (!module.default) {
      throw new Error(
        `Quiz folder "${path}" has no default export. ` +
          `Add \`export default quiz\` (a Quiz object) to it.`,
      )
    }
    return module.default
  })

  const errors = validateQuizzes(loaded)
  if (errors.length > 0) {
    throw new Error(
      `Invalid quiz data (${errors.length} problem${errors.length === 1 ? '' : 's'}):\n` +
        errors.map((error) => `  - ${error}`).join('\n'),
    )
  }

  // Deterministic order regardless of glob/filesystem ordering.
  return loaded.sort(
    (a, b) => a.title.localeCompare(b.title) || a.id.localeCompare(b.id),
  )
}

export const quizzes: Array<Quiz> = loadQuizzes()

export function getQuiz(id: string): Quiz | undefined {
  return quizzes.find((quiz) => quiz.id === id)
}

export function getChapter(
  quizId: string,
  chapterId: string,
): Chapter | undefined {
  return getQuiz(quizId)?.chapters.find((chapter) => chapter.id === chapterId)
}

export function countQuestions(quiz: Quiz): number {
  return quiz.chapters.reduce(
    (total, chapter) => total + chapter.questions.length,
    0,
  )
}

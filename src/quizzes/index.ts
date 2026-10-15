import type { Quiz } from './types'
import { validateQuizzes } from './validate'

/**
 * Quizzes are auto-discovered: every `src/quizzes/<quiz-id>/index.ts` must
 * `export default` a `Quiz` whose `id` is the folder name. Adding a quiz =
 * adding a folder; nothing to register.
 *
 * Each quiz is its own chunk, loaded when a page asks for it, so a quiz page
 * downloads only its own questions and the bundle does not grow per quiz. A
 * quiz is validated when it loads; `loadAllQuizzes` (the validate script and
 * the home page summaries) loads and checks all of them.
 */
const loaders = import.meta.glob<{ default?: Quiz }>('./*/index.ts')

const FOLDER = /^\.\/([^/]+)\/index\.ts$/

/** The ids (folder names) of all quizzes; nothing is loaded for this. */
const quizIds: ReadonlyArray<string> = Object.keys(loaders)
  .flatMap((path) => FOLDER.exec(path)?.[1] ?? [])
  .sort()

async function importQuiz(id: string): Promise<Quiz> {
  const path = `./${id}/index.ts`
  const quiz = (await loaders[path]()).default
  if (!quiz) {
    throw new Error(
      `Quiz folder "${id}" has no default export. ` +
        `Add \`export default quiz\` (a Quiz object) to ${path}.`,
    )
  }
  if (quiz.id !== id) {
    throw new Error(
      `Quiz folder "${id}" contains the quiz "${quiz.id}": ` +
        `the quiz id must match the folder name.`,
    )
  }
  const errors = validateQuizzes([quiz])
  if (errors.length > 0) {
    throw new Error(
      `Invalid quiz data (${errors.length} problem${errors.length === 1 ? '' : 's'}):\n` +
        errors.map((error) => `  - ${error}`).join('\n'),
    )
  }
  return quiz
}

const cache = new Map<string, Promise<Quiz>>()

/** The quiz with this id (its folder name), or undefined if there is none. */
export function getQuiz(id: string): Promise<Quiz | undefined> {
  if (!quizIds.includes(id)) return Promise.resolve(undefined)
  let loading = cache.get(id)
  if (!loading) {
    loading = importQuiz(id)
    cache.set(id, loading)
    // A failed load is not kept, so fixing the data and retrying works.
    loading.catch(() => cache.delete(id))
  }
  return loading
}

/** Every quiz, validated, in a stable order. Rejects with all problems found. */
export async function loadAllQuizzes(): Promise<Array<Quiz>> {
  const results = await Promise.allSettled(quizIds.map((id) => getQuiz(id)))
  const problems = results.flatMap((result) =>
    result.status === 'rejected'
      ? [
          result.reason instanceof Error
            ? result.reason.message
            : String(result.reason),
        ]
      : [],
  )
  if (problems.length > 0) throw new Error(problems.join('\n'))
  return results
    .flatMap((result) =>
      result.status === 'fulfilled' && result.value ? [result.value] : [],
    )
    .sort((a, b) => a.title.localeCompare(b.title) || a.id.localeCompare(b.id))
}

export function countQuestions(quiz: Quiz): number {
  return quiz.chapters.reduce(
    (total, chapter) => total + chapter.questions.length,
    0,
  )
}

/** What the home page needs of a quiz, without its questions. */
export interface QuizSummary {
  id: string
  title: string
  description: string
  chapterCount: number
  questionCount: number
}

export async function loadQuizSummaries(): Promise<Array<QuizSummary>> {
  const quizzes = await loadAllQuizzes()
  return quizzes.map((quiz) => ({
    id: quiz.id,
    title: quiz.title,
    description: quiz.description,
    chapterCount: quiz.chapters.length,
    questionCount: countQuestions(quiz),
  }))
}

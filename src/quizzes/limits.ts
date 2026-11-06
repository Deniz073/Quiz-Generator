import { countQuestions } from './index'
import type { Question, Quiz } from './types'
import { validateQuiz } from './validate'

/*
 * Size caps for quizzes users write themselves (the quiz assistant), checked
 * in the browser while editing and again by the server on Save. Seed quizzes
 * are not held to them.
 */

export const QUIZ_LIMITS = {
  chapters: 30,
  questions: 300,
  /** Title, description, chapter title, question and option texts. */
  textLength: 1000,
  explanationLength: 2000,
  /** Personal quizzes one user may own before the assistant creates no more. */
  personalQuizzes: 50,
} as const

/** One question's cap violations, without its location. */
export function checkQuestionLimits(
  question: Pick<Question, 'question' | 'options' | 'explanation'>,
): Array<string> {
  const errors: Array<string> = []
  const max = QUIZ_LIMITS.textLength
  if (question.question.length > max) {
    errors.push(`text is over ${max} characters`)
  }
  if (question.options.some((option) => option.length > max)) {
    errors.push(`an option is over ${max} characters`)
  }
  if (question.explanation.length > QUIZ_LIMITS.explanationLength) {
    errors.push(
      `explanation is over ${QUIZ_LIMITS.explanationLength} characters`,
    )
  }
  return errors
}

/** Human-readable cap violations; empty when within every cap. */
function checkQuizLimits(quiz: Quiz): Array<string> {
  const errors: Array<string> = []
  const max = QUIZ_LIMITS.textLength
  if (quiz.title.length > max) errors.push(`title is over ${max} characters`)
  if (quiz.description.length > max) {
    errors.push(`description is over ${max} characters`)
  }
  if (quiz.chapters.length > QUIZ_LIMITS.chapters) {
    errors.push(`more than ${QUIZ_LIMITS.chapters} chapters`)
  }
  if (countQuestions(quiz) > QUIZ_LIMITS.questions) {
    errors.push(`more than ${QUIZ_LIMITS.questions} questions`)
  }
  for (const chapter of quiz.chapters) {
    if (chapter.title.length > max) {
      errors.push(`chapter "${chapter.id}": title is over ${max} characters`)
    }
    for (const question of chapter.questions) {
      for (const error of checkQuestionLimits(question)) {
        errors.push(`question "${question.id}": ${error}`)
      }
    }
  }
  return errors
}

/**
 * What stands between a personal quiz and a Save: the quiz rules and the size
 * caps. Empty when it can be saved. The browser shows it, the server enforces it.
 */
export function personalQuizProblems(quiz: Quiz): Array<string> {
  return [...validateQuiz(quiz), ...checkQuizLimits(quiz)]
}

import { countQuestions } from './index'
import { isIndex, isMultipleAnswer, isUnique } from './question'
import {
  EXAM_SETTINGS,
  MAX_OPTIONS,
  MIN_OPTIONS,
  RESERVED_CHAPTER_IDS,
  getExamLimits,
  isInRange,
  isSlug,
} from './rules'
import type { ExamConfig, Question, Quiz } from './types'

/*
 * Checks everything the type system cannot. Each check reports relative to
 * what it checks (a question's problems carry no location, a quiz's carry
 * chapter > question), and the caller adds where that is: the seed adds the
 * quiz, the quiz assistant shows them as they are.
 */

const isBlank = (value: unknown): boolean =>
  typeof value !== 'string' || value.trim() === ''

/** One question's own problems (not its id's uniqueness); empty when valid. */
export function validateQuestion(question: Question): Array<string> {
  const errors: Array<string> = []
  const fail = (message: string) => errors.push(message)

  if (!isSlug(question.id)) {
    fail('id must be a URL-safe slug like "1-01"')
  }
  if (isBlank(question.question)) fail('"question" must not be empty')
  if (isBlank(question.explanation)) fail('"explanation" must not be empty')

  const { options } = question
  if (!Array.isArray(options)) {
    fail('"options" must be an array')
    return errors
  }
  if (options.length < MIN_OPTIONS || options.length > MAX_OPTIONS) {
    fail(`needs ${MIN_OPTIONS}-${MAX_OPTIONS} options, found ${options.length}`)
  }
  options.forEach((option, index) => {
    if (isBlank(option)) fail(`option ${index} must not be empty`)
  })
  const seen = new Set<string>()
  for (const option of options) {
    const key = String(option).trim().toLowerCase()
    if (seen.has(key)) fail(`duplicate option text "${option}"`)
    seen.add(key)
  }

  const inRange = (index: number): boolean => isIndex(index, options.length)
  const range = `0-${options.length - 1}`

  if ('correctIndex' in question && 'correctIndexes' in question) {
    fail('set either "correctIndex" or "correctIndexes", not both')
  } else if (isMultipleAnswer(question)) {
    const indexes: Array<number> = question.correctIndexes
    if (!Array.isArray(indexes)) {
      fail('"correctIndexes" must be an array')
      return errors
    }
    const bad = indexes.filter((index) => !inRange(index))
    if (bad.length > 0) {
      fail(`correctIndexes ${JSON.stringify(bad)} out of range (${range})`)
    }
    if (!isUnique(indexes)) {
      fail(`correctIndexes ${JSON.stringify(indexes)} contains duplicates`)
    }
    const unique = new Set(indexes.filter(inRange))
    if (unique.size < 2) {
      fail('correctIndexes needs at least 2 entries (use correctIndex for one)')
    }
    if (unique.size >= options.length) {
      fail('correctIndexes must be fewer than the number of options')
    }
  } else if (!inRange(question.correctIndex)) {
    fail(
      `correctIndex ${JSON.stringify(question.correctIndex)} out of range (${range})`,
    )
  }
  return errors
}

/** Mock exam settings for a quiz with `totalQuestions` questions. */
export function validateExamConfig(
  exam: ExamConfig,
  totalQuestions: number,
): Array<string> {
  const limits = getExamLimits(totalQuestions)
  const describe = {
    questionCount: ` (the quiz's total questions)`,
    minutes: '',
    passPercent: '',
  }
  return EXAM_SETTINGS.flatMap((key) =>
    isInRange(exam[key], limits[key])
      ? []
      : [
          `exam.${key} ${JSON.stringify(exam[key])} must be an integer from ${limits[key].min} to ${limits[key].max}${describe[key]}`,
        ],
  )
}

/**
 * One quiz's content: text, chapters, questions and exam settings. Not its
 * id: built-in quiz ids are checked with the seed (validateQuizzes), personal
 * quiz ids are picked by the server. `where` is put in front of every
 * problem's location, e.g. `quiz "az-900"`.
 */
export function validateQuiz(quiz: Quiz, where = ''): Array<string> {
  const errors: Array<string> = []
  const report = (location: Array<string>, message: string) => {
    const at = [where, ...location].filter(Boolean).join(' > ')
    errors.push(at ? `${at}: ${message}` : message)
  }
  if (isBlank(quiz.title)) report([], 'title must not be empty')
  if (isBlank(quiz.description)) report([], 'description must not be empty')
  if (quiz.chapters.length === 0) report([], 'needs at least one chapter')

  const questionIds = new Set<string>()
  const chapterIds = new Set<string>()
  const chapterNumbers = new Set<number>()
  for (const chapter of quiz.chapters) {
    const chapterAt = [`chapter "${chapter.id}"`]
    const fail = (message: string) => report(chapterAt, message)
    if (!isSlug(chapter.id)) {
      fail('id must be a URL-safe slug like "1-basics"')
    }
    if (chapterIds.has(chapter.id)) fail('duplicate chapter id within the quiz')
    if (RESERVED_CHAPTER_IDS.includes(chapter.id)) {
      fail(
        `chapter id is reserved (used by the ${chapter.id} route), pick another`,
      )
    }
    chapterIds.add(chapter.id)
    if (!Number.isInteger(chapter.number) || chapter.number < 1) {
      fail('number must be a whole number of 1 or more')
    }
    if (chapterNumbers.has(chapter.number)) {
      fail(`duplicate chapter number ${chapter.number}`)
    }
    chapterNumbers.add(chapter.number)
    if (isBlank(chapter.title)) fail('title must not be empty')
    if (chapter.questions.length === 0) fail('needs at least one question')

    chapter.questions.forEach((question, index) => {
      const questionAt = [...chapterAt, `question #${index + 1}`]
      for (const error of validateQuestion(question)) report(questionAt, error)
      if (questionIds.has(question.id)) {
        report(
          questionAt,
          `duplicate question id "${question.id}" within the quiz`,
        )
      }
      questionIds.add(question.id)
    })
  }

  if (quiz.exam) {
    for (const error of validateExamConfig(quiz.exam, countQuestions(quiz))) {
      report([], error)
    }
  }
  return errors
}

/**
 * A set of built-in quizzes: every quiz, plus their ids (URL-safe slugs,
 * unique). Each error starts with its quiz; an empty array means valid.
 */
function validateQuizzes(quizzes: ReadonlyArray<Quiz>): Array<string> {
  const errors: Array<string> = []
  const quizIds = new Set<string>()
  for (const quiz of quizzes) {
    const where = `quiz "${quiz.id}"`
    if (!isSlug(quiz.id)) {
      errors.push(`${where}: id must be a URL-safe slug like "my-quiz"`)
    }
    if (quizIds.has(quiz.id)) errors.push(`${where}: duplicate quiz id`)
    quizIds.add(quiz.id)
    errors.push(...validateQuiz(quiz, where))
  }
  return errors
}

/** Throws one error listing every problem of the seed quizzes. */
export function assertValidQuizzes(quizzes: ReadonlyArray<Quiz>): void {
  const errors = validateQuizzes(quizzes)
  if (errors.length === 0) return
  throw new Error(
    `Invalid seed quizzes (${errors.length} problem${errors.length === 1 ? '' : 's'}):\n` +
      errors.map((error) => `  - ${error}`).join('\n'),
  )
}

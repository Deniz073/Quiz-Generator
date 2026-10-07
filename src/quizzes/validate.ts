import { isMultipleAnswer } from './question'
import type { Question, Quiz } from './types'

/** Lowercase letters/digits separated by single hyphens, e.g. "1-cloud-basics". */
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

/** Static route segments that would shadow a chapter page of the same name. */
const RESERVED_CHAPTER_IDS: ReadonlyArray<string> = [
  'practice',
  'exam',
  'study',
  'flagged',
]

/** The quiz UI has hotkeys for options 1-6 / A-F. */
export const MIN_OPTIONS = 2
export const MAX_OPTIONS = 6

const isBlank = (value: unknown): boolean =>
  typeof value !== 'string' || value.trim() === ''

function validateQuestion(
  question: Question,
  where: string,
  errors: Array<string>,
) {
  const fail = (message: string) => errors.push(`${where}: ${message}`)

  if (typeof question.id !== 'string' || !SLUG.test(question.id)) {
    fail('id must be a URL-safe slug like "1-01"')
  }
  if (isBlank(question.question)) fail('"question" must not be empty')
  if (isBlank(question.explanation)) fail('"explanation" must not be empty')

  const { options } = question
  if (!Array.isArray(options)) {
    fail('"options" must be an array')
    return
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

  const inRange = (index: unknown): boolean =>
    Number.isInteger(index) &&
    (index as number) >= 0 &&
    (index as number) < options.length
  const range = `0-${options.length - 1}`

  if ('correctIndex' in question && 'correctIndexes' in question) {
    fail('set either "correctIndex" or "correctIndexes", not both')
  } else if (isMultipleAnswer(question)) {
    const indexes: Array<number> = question.correctIndexes
    if (!Array.isArray(indexes)) {
      fail('"correctIndexes" must be an array')
      return
    }
    const bad = indexes.filter((index) => !inRange(index))
    if (bad.length > 0) {
      fail(`correctIndexes ${JSON.stringify(bad)} out of range (${range})`)
    }
    if (new Set(indexes).size !== indexes.length) {
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
}

function validateExam(
  quiz: Quiz,
  quizWhere: string,
  totalQuestions: number,
  errors: Array<string>,
) {
  const { exam } = quiz
  if (exam == null) return
  const { questionCount, minutes, passPercent } = exam
  if (
    !Number.isInteger(questionCount) ||
    questionCount < 1 ||
    questionCount > totalQuestions
  ) {
    errors.push(
      `${quizWhere}: exam.questionCount ${JSON.stringify(questionCount)} must be an integer from 1 to ${totalQuestions} (the quiz's total questions)`,
    )
  }
  if (!Number.isInteger(minutes) || minutes < 1) {
    errors.push(
      `${quizWhere}: exam.minutes ${JSON.stringify(minutes)} must be an integer of at least 1`,
    )
  }
  if (!Number.isInteger(passPercent) || passPercent < 1 || passPercent > 100) {
    errors.push(
      `${quizWhere}: exam.passPercent ${JSON.stringify(passPercent)} must be an integer from 1 to 100`,
    )
  }
}

/**
 * Checks everything the type system cannot: slugs, uniqueness, non-empty
 * text, option counts, answer indexes, question ids, reserved ids and exam settings. Returns human-readable errors with
 * quiz / chapter / question location; an empty array means valid.
 */
export function validateQuizzes(quizzes: ReadonlyArray<Quiz>): Array<string> {
  const errors: Array<string> = []
  const quizIds = new Set<string>()

  for (const quiz of quizzes) {
    const quizWhere = `quiz "${quiz.id}"`
    if (!SLUG.test(quiz.id)) {
      errors.push(`${quizWhere}: id must be a URL-safe slug like "my-quiz"`)
    }
    if (quizIds.has(quiz.id)) errors.push(`${quizWhere}: duplicate quiz id`)
    quizIds.add(quiz.id)
    if (isBlank(quiz.title))
      errors.push(`${quizWhere}: title must not be empty`)
    if (isBlank(quiz.description)) {
      errors.push(`${quizWhere}: description must not be empty`)
    }
    if (quiz.chapters.length === 0) {
      errors.push(`${quizWhere}: needs at least one chapter`)
    }

    const questionIds = new Set<string>()
    const chapterIds = new Set<string>()
    const chapterNumbers = new Set<number>()
    for (const chapter of quiz.chapters) {
      const chapterWhere = `${quizWhere} > chapter "${chapter.id}"`
      if (!SLUG.test(chapter.id)) {
        errors.push(
          `${chapterWhere}: id must be a URL-safe slug like "1-basics"`,
        )
      }
      if (chapterIds.has(chapter.id)) {
        errors.push(`${chapterWhere}: duplicate chapter id within the quiz`)
      }
      if (RESERVED_CHAPTER_IDS.includes(chapter.id)) {
        errors.push(
          `${chapterWhere}: chapter id is reserved (used by the ${chapter.id} route), pick another`,
        )
      }
      chapterIds.add(chapter.id)
      if (!Number.isInteger(chapter.number)) {
        errors.push(`${chapterWhere}: number must be an integer`)
      }
      if (chapterNumbers.has(chapter.number)) {
        errors.push(
          `${chapterWhere}: duplicate chapter number ${chapter.number}`,
        )
      }
      chapterNumbers.add(chapter.number)
      if (isBlank(chapter.title)) {
        errors.push(`${chapterWhere}: title must not be empty`)
      }
      if (chapter.questions.length === 0) {
        errors.push(`${chapterWhere}: needs at least one question`)
      }

      chapter.questions.forEach((question, index) => {
        const where = `${chapterWhere} > question #${index + 1}`
        validateQuestion(question, where, errors)
        if (questionIds.has(question.id)) {
          errors.push(
            `${where}: duplicate question id "${question.id}" within the quiz`,
          )
        }
        questionIds.add(question.id)
      })
    }

    validateExam(
      quiz,
      quizWhere,
      quiz.chapters.reduce((sum, c) => sum + c.questions.length, 0),
      errors,
    )
  }

  return errors
}

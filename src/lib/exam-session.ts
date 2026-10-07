import type { PlannedQuestion } from '#/lib/quiz-plan'
import type { ExamState } from '#/lib/exam-state'
import type { Quiz } from '#/quizzes/types'
import { getCorrectIndexes } from '#/quizzes/question'

/*
 * The unfinished mock exam of a quiz, kept in localStorage so a reload or an
 * accidental navigation doesn't lose it. Questions are stored by reference
 * (chapter id, index, text) and not by content, so a deploy that edits the
 * quiz can't resurrect stale questions: anything that no longer lines up with
 * the current quiz data discards the whole session. Like progress.ts, nothing
 * here throws: reads fall back to "no session", writes are best effort. Bump
 * the key's version if the shape ever changes incompatibly.
 */

const KEY_PREFIX = 'quiz-generator:exam-session:v1:'

interface StoredQuestion {
  chapterId: string
  /** Index into the chapter's `questions`. */
  questionIndex: number
  /** Guards against the question at that index having changed. */
  questionText: string
  optionOrder: Array<number>
}

interface StoredSession {
  startedAt: number
  endsAt: number
  current: number
  reviewing: boolean
  questions: Array<StoredQuestion>
  picks: Array<Array<number>>
  flagged: Array<number>
}

function storageKey(quizId: string): string {
  return `${KEY_PREFIX}${quizId}`
}

/** Best effort, every time the exam changes. Never throws. */
export function saveExamSession(quiz: Quiz, state: ExamState): void {
  const questions: Array<StoredQuestion> = []
  for (const item of state.plan) {
    const stored = toStoredQuestion(quiz, item)
    // Can't be referenced (not from this quiz): better no session than a wrong one.
    if (!stored) return
    questions.push(stored)
  }
  const session: StoredSession = {
    startedAt: state.startedAt,
    endsAt: state.endsAt,
    current: state.current,
    reviewing: state.reviewing,
    questions,
    picks: state.picks.map((pick) => [...pick]),
    flagged: [...state.flagged],
  }
  try {
    localStorage.setItem(storageKey(quiz.id), JSON.stringify(session))
  } catch (error) {
    console.warn('Could not save the exam session', error)
  }
}

export function clearExamSession(quizId: string): void {
  try {
    localStorage.removeItem(storageKey(quizId))
  } catch {
    // Unavailable storage: nothing to clear.
  }
}

/**
 * The saved unfinished exam resolved against the current quiz data, or
 * undefined if there is none or it no longer matches (then it is deleted).
 * The deadline may already have passed; that is for the caller to handle.
 */
export function loadExamSession(quiz: Quiz): ExamState | undefined {
  let raw: string | null
  try {
    raw = localStorage.getItem(storageKey(quiz.id))
  } catch {
    return undefined
  }
  if (raw === null) return undefined

  const state = parseSession(raw, quiz)
  if (!state) clearExamSession(quiz.id)
  return state
}

function toStoredQuestion(
  quiz: Quiz,
  { question, optionOrder, chapter }: PlannedQuestion,
): StoredQuestion | undefined {
  if (!chapter) return undefined
  const questionIndex = quiz.chapters
    .find(({ id }) => id === chapter.id)
    ?.questions.indexOf(question)
  if (questionIndex === undefined || questionIndex < 0) return undefined
  return {
    chapterId: chapter.id,
    questionIndex,
    questionText: question.question,
    optionOrder: [...optionOrder],
  }
}

// --- Parsing --------------------------------------------------------------

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isIndexArray(value: unknown): value is Array<number> {
  return Array.isArray(value) && value.every((i) => Number.isInteger(i))
}

/** `order` contains each of 0..count-1 exactly once. */
function isPermutation(order: ReadonlyArray<number>, count: number): boolean {
  return (
    order.length === count &&
    new Set(order).size === count &&
    order.every((i) => i >= 0 && i < count)
  )
}

function parseSession(raw: string, quiz: Quiz): ExamState | undefined {
  let data: unknown
  try {
    data = JSON.parse(raw)
  } catch {
    return undefined
  }
  if (!isRecord(data)) return undefined
  const { startedAt, endsAt, current, reviewing, questions, picks, flagged } =
    data
  if (
    typeof startedAt !== 'number' ||
    typeof endsAt !== 'number' ||
    !Number.isFinite(startedAt) ||
    !Number.isFinite(endsAt) ||
    typeof reviewing !== 'boolean' ||
    !Number.isInteger(current) ||
    !Array.isArray(questions) ||
    questions.length === 0 ||
    !Array.isArray(picks) ||
    picks.length !== questions.length ||
    !isIndexArray(flagged)
  ) {
    return undefined
  }
  const total = questions.length
  const currentIndex = current as number
  if (currentIndex < 0 || currentIndex >= total) return undefined
  if (new Set(flagged).size !== flagged.length) return undefined
  if (flagged.some((i) => i < 0 || i >= total)) return undefined

  const plan: Array<PlannedQuestion> = []
  const seen = new Set<PlannedQuestion['question']>()
  const parsedPicks: Array<Array<number>> = []
  for (const [position, entry] of questions.entries()) {
    const item = resolveQuestion(quiz, entry)
    if (!item) return undefined
    // The same question twice means the data is not one of our sessions.
    if (seen.has(item.question)) return undefined
    seen.add(item.question)

    const pick: unknown = picks[position]
    const optionCount = item.question.options.length
    if (
      !isIndexArray(pick) ||
      new Set(pick).size !== pick.length ||
      pick.length > getCorrectIndexes(item.question).length ||
      pick.some((i) => i < 0 || i >= optionCount)
    ) {
      return undefined
    }
    plan.push(item)
    parsedPicks.push(pick)
  }

  return {
    plan,
    picks: parsedPicks,
    flagged,
    current: currentIndex,
    reviewing,
    submitted: false,
    startedAt,
    endsAt,
  }
}

function resolveQuestion(
  quiz: Quiz,
  entry: unknown,
): PlannedQuestion | undefined {
  if (!isRecord(entry)) return undefined
  const { chapterId, questionIndex, questionText, optionOrder } = entry
  if (
    typeof chapterId !== 'string' ||
    !Number.isInteger(questionIndex) ||
    typeof questionText !== 'string' ||
    !isIndexArray(optionOrder)
  ) {
    return undefined
  }
  const chapter = quiz.chapters.find(({ id }) => id === chapterId)
  const question = chapter?.questions.at(questionIndex as number)
  if (
    (questionIndex as number) < 0 ||
    !chapter ||
    !question ||
    question.question !== questionText ||
    !isPermutation(optionOrder, question.options.length)
  ) {
    return undefined
  }
  return {
    question,
    optionOrder,
    chapter: { id: chapter.id, number: chapter.number, title: chapter.title },
  }
}

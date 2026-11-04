import { QUIZ_LIMITS, checkQuizLimits } from '#/quizzes/limits'
import { getCorrectIndexes, isMultipleAnswer } from '#/quizzes/question'
import type { Chapter, ExamConfig, Question, Quiz } from '#/quizzes/types'
import { validateQuestionContent, validateQuizzes } from '#/quizzes/validate'

/*
 * The working copy: the quiz as the quiz assistant is editing it, before
 * Save. Pure operations, run by the assistant's client tools in the browser.
 *
 * Ids are assigned here, never by the model: a chapter or question keeps its
 * id while edited, and a new one gets an id never used in this quiz (as far
 * as this working copy knows), because users' flags and attempts hang off
 * them. A new quiz has the empty id until its first Save; the server picks it.
 */

export interface WorkingCopy {
  quiz: Quiz
  /** Every chapter id and question id this quiz has used, kept or not. */
  usedChapterIds: ReadonlyArray<string>
  usedQuestionIds: ReadonlyArray<string>
}

/** A question as the tools take and give it: always a list of correct indexes. */
export interface QuestionInput {
  question: string
  options: Array<string>
  correctIndexes: Array<number>
  explanation: string
}

export type EditResult<T = object> =
  ({ ok: true; copy: WorkingCopy } & T) | { ok: false; error: string }

const RESERVED_CHAPTER_IDS = new Set(['practice', 'exam', 'study', 'flagged'])

export function emptyQuiz(): Quiz {
  return { id: '', title: '', description: '', chapters: [] }
}

export function createWorkingCopy(quiz: Quiz): WorkingCopy {
  return {
    quiz,
    usedChapterIds: quiz.chapters.map((c) => c.id),
    usedQuestionIds: quiz.chapters.flatMap((c) => c.questions.map((q) => q.id)),
  }
}

/** After a Save: the saved quiz (with its id) is the new starting point. */
export function rebaseWorkingCopy(copy: WorkingCopy, saved: Quiz): WorkingCopy {
  const next = createWorkingCopy(saved)
  return {
    quiz: saved,
    usedChapterIds: [
      ...new Set([...copy.usedChapterIds, ...next.usedChapterIds]),
    ],
    usedQuestionIds: [
      ...new Set([...copy.usedQuestionIds, ...next.usedQuestionIds]),
    ],
  }
}

function slugify(text: string): string {
  return text
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40)
    .replace(/-+$/, '')
}

function toQuestion(id: string, input: QuestionInput): Question {
  const base = {
    id,
    question: input.question.trim(),
    options: input.options.map((option) => option.trim()),
    explanation: input.explanation.trim(),
  }
  return input.correctIndexes.length === 1
    ? { ...base, correctIndex: input.correctIndexes[0] }
    : { ...base, correctIndexes: [...input.correctIndexes] }
}

export function toQuestionInput(question: Question): QuestionInput {
  return {
    question: question.question,
    options: [...question.options],
    correctIndexes: getCorrectIndexes(question),
    explanation: question.explanation,
  }
}

function questionCount(quiz: Quiz): number {
  return quiz.chapters.reduce((sum, c) => sum + c.questions.length, 0)
}

function questionProblems(input: QuestionInput): Array<string> {
  if (input.correctIndexes.length === 0) {
    return ['correctIndexes needs at least one entry']
  }
  // Any id passes the slug check; uniqueness is the working copy's job.
  const errors = validateQuestionContent(toQuestion('check', input))
  const max = QUIZ_LIMITS.textLength
  if (input.question.length > max) errors.push(`text is over ${max} characters`)
  if (input.options.some((o) => o.length > max)) {
    errors.push(`an option is over ${max} characters`)
  }
  if (input.explanation.length > QUIZ_LIMITS.explanationLength) {
    errors.push(
      `explanation is over ${QUIZ_LIMITS.explanationLength} characters`,
    )
  }
  return errors
}

function nextQuestionId(
  chapterNumber: number,
  used: ReadonlySet<string>,
): string {
  for (let n = 1; ; n++) {
    const id = `${chapterNumber}-${String(n).padStart(2, '0')}`
    if (!used.has(id)) return id
  }
}

function findChapter(quiz: Quiz, chapterId: string): Chapter | undefined {
  return quiz.chapters.find((c) => c.id === chapterId)
}

function withQuiz(copy: WorkingCopy, quiz: Quiz): WorkingCopy {
  return { ...copy, quiz }
}

// --- Operations -------------------------------------------------------------

export function setDetails(
  copy: WorkingCopy,
  details: { title?: string; description?: string },
): EditResult {
  const title = details.title?.trim()
  const description = details.description?.trim()
  if (title === '' || description === '') {
    return { ok: false, error: 'Title and description must not be empty.' }
  }
  const max = QUIZ_LIMITS.textLength
  if ((title?.length ?? 0) > max || (description?.length ?? 0) > max) {
    return {
      ok: false,
      error: `Keep title and description under ${max} characters.`,
    }
  }
  return {
    ok: true,
    copy: withQuiz(copy, {
      ...copy.quiz,
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
    }),
  }
}

export function setExam(
  copy: WorkingCopy,
  exam: ExamConfig | null,
): EditResult {
  if (exam === null) {
    const { exam: _removed, ...rest } = copy.quiz
    return { ok: true, copy: withQuiz(copy, rest) }
  }
  const total = questionCount(copy.quiz)
  const { questionCount: count, minutes, passPercent } = exam
  if (!Number.isInteger(count) || count < 1 || count > total) {
    return {
      ok: false,
      error: `questionCount must be a whole number from 1 to ${total} (the quiz's questions).`,
    }
  }
  if (!Number.isInteger(minutes) || minutes < 1) {
    return { ok: false, error: 'minutes must be a whole number of at least 1.' }
  }
  if (!Number.isInteger(passPercent) || passPercent < 1 || passPercent > 100) {
    return {
      ok: false,
      error: 'passPercent must be a whole number from 1 to 100.',
    }
  }
  return {
    ok: true,
    copy: withQuiz(copy, { ...copy.quiz, exam: { ...exam } }),
  }
}

export function addChapter(
  copy: WorkingCopy,
  title: string,
): EditResult<{ chapterId: string; number: number }> {
  const trimmed = title.trim()
  if (trimmed === '') return { ok: false, error: 'Title must not be empty.' }
  if (trimmed.length > QUIZ_LIMITS.textLength) {
    return { ok: false, error: 'Chapter title is too long.' }
  }
  if (copy.quiz.chapters.length >= QUIZ_LIMITS.chapters) {
    return {
      ok: false,
      error: `A quiz has at most ${QUIZ_LIMITS.chapters} chapters.`,
    }
  }
  const number =
    copy.quiz.chapters.reduce((max, c) => Math.max(max, c.number), 0) + 1
  const used = new Set(copy.usedChapterIds)
  const base = [String(number), slugify(trimmed)].filter(Boolean).join('-')
  let chapterId = base
  for (
    let n = 2;
    used.has(chapterId) || RESERVED_CHAPTER_IDS.has(chapterId);
    n++
  ) {
    chapterId = `${base}-${n}`
  }
  const chapter: Chapter = {
    id: chapterId,
    number,
    title: trimmed,
    questions: [],
  }
  return {
    ok: true,
    chapterId,
    number,
    copy: {
      ...copy,
      quiz: { ...copy.quiz, chapters: [...copy.quiz.chapters, chapter] },
      usedChapterIds: [...copy.usedChapterIds, chapterId],
    },
  }
}

export function renameChapter(
  copy: WorkingCopy,
  chapterId: string,
  title: string,
): EditResult {
  const trimmed = title.trim()
  if (!findChapter(copy.quiz, chapterId)) {
    return { ok: false, error: `No chapter "${chapterId}".` }
  }
  if (trimmed === '') return { ok: false, error: 'Title must not be empty.' }
  if (trimmed.length > QUIZ_LIMITS.textLength) {
    return { ok: false, error: 'Chapter title is too long.' }
  }
  return {
    ok: true,
    copy: withQuiz(copy, {
      ...copy.quiz,
      chapters: copy.quiz.chapters.map((c) =>
        c.id === chapterId ? { ...c, title: trimmed } : c,
      ),
    }),
  }
}

/** Removes a chapter with its questions; the rest are numbered 1..n again. */
export function removeChapter(
  copy: WorkingCopy,
  chapterId: string,
): EditResult {
  if (!findChapter(copy.quiz, chapterId)) {
    return { ok: false, error: `No chapter "${chapterId}".` }
  }
  const chapters = copy.quiz.chapters
    .filter((c) => c.id !== chapterId)
    .sort((a, b) => a.number - b.number)
    .map((c, index) => ({ ...c, number: index + 1 }))
  return { ok: true, copy: withQuiz(copy, { ...copy.quiz, chapters }) }
}

export interface RejectedQuestion {
  index: number
  problems: Array<string>
}

/** Adds the valid questions to a chapter; invalid ones are reported, not added. */
export function addQuestions(
  copy: WorkingCopy,
  chapterId: string,
  inputs: ReadonlyArray<QuestionInput>,
): EditResult<{ addedIds: Array<string>; rejected: Array<RejectedQuestion> }> {
  const chapter = findChapter(copy.quiz, chapterId)
  if (!chapter) return { ok: false, error: `No chapter "${chapterId}".` }
  const room = QUIZ_LIMITS.questions - questionCount(copy.quiz)
  const used = new Set(copy.usedQuestionIds)
  const added: Array<Question> = []
  const rejected: Array<RejectedQuestion> = []
  inputs.forEach((input, index) => {
    const problems = questionProblems(input)
    if (added.length >= room) {
      problems.push(`the quiz is full (${QUIZ_LIMITS.questions} questions)`)
    }
    if (problems.length > 0) {
      rejected.push({ index, problems })
      return
    }
    const id = nextQuestionId(chapter.number, used)
    used.add(id)
    added.push(toQuestion(id, input))
  })
  const addedIds = added.map((q) => q.id)
  return {
    ok: true,
    addedIds,
    rejected,
    copy: {
      quiz: {
        ...copy.quiz,
        chapters: copy.quiz.chapters.map((c) =>
          c.id === chapterId
            ? { ...c, questions: [...c.questions, ...added] }
            : c,
        ),
      },
      usedChapterIds: copy.usedChapterIds,
      usedQuestionIds: [...copy.usedQuestionIds, ...addedIds],
    },
  }
}

export interface QuestionPatch {
  question?: string
  options?: Array<string>
  correctIndexes?: Array<number>
  explanation?: string
  /** Moves the question to the end of another chapter; it keeps its id. */
  chapterId?: string
}

export function updateQuestion(
  copy: WorkingCopy,
  questionId: string,
  patch: QuestionPatch,
): EditResult {
  const from = copy.quiz.chapters.find((c) =>
    c.questions.some((q) => q.id === questionId),
  )
  const current = from?.questions.find((q) => q.id === questionId)
  if (!from || !current) {
    return { ok: false, error: `No question "${questionId}".` }
  }
  const to = patch.chapterId ?? from.id
  if (!findChapter(copy.quiz, to)) {
    return { ok: false, error: `No chapter "${to}".` }
  }
  if (patch.options && !patch.correctIndexes) {
    return {
      ok: false,
      error:
        'When changing options, also give correctIndexes for the new options.',
    }
  }
  const input = { ...toQuestionInput(current), ...definedOnly(patch) }
  const problems = questionProblems(input)
  if (problems.length > 0) {
    return { ok: false, error: `Not changed: ${problems.join('; ')}.` }
  }
  const updated = toQuestion(questionId, input)
  const chapters = copy.quiz.chapters.map((c) => {
    if (c.id === from.id && c.id === to) {
      return {
        ...c,
        questions: c.questions.map((q) => (q.id === questionId ? updated : q)),
      }
    }
    if (c.id === from.id) {
      return { ...c, questions: c.questions.filter((q) => q.id !== questionId) }
    }
    if (c.id === to) return { ...c, questions: [...c.questions, updated] }
    return c
  })
  return { ok: true, copy: withQuiz(copy, { ...copy.quiz, chapters }) }
}

function definedOnly(patch: QuestionPatch): Partial<QuestionInput> {
  const result: Partial<QuestionInput> = {}
  if (patch.question !== undefined) result.question = patch.question
  if (patch.options !== undefined) result.options = patch.options
  if (patch.correctIndexes !== undefined) {
    result.correctIndexes = patch.correctIndexes
  }
  if (patch.explanation !== undefined) result.explanation = patch.explanation
  return result
}

export function removeQuestions(
  copy: WorkingCopy,
  questionIds: ReadonlyArray<string>,
): EditResult<{ removedIds: Array<string>; unknownIds: Array<string> }> {
  const existing = new Set(
    copy.quiz.chapters.flatMap((c) => c.questions.map((q) => q.id)),
  )
  const removedIds = questionIds.filter((id) => existing.has(id))
  const unknownIds = questionIds.filter((id) => !existing.has(id))
  const remove = new Set(removedIds)
  return {
    ok: true,
    removedIds,
    unknownIds,
    copy: withQuiz(copy, {
      ...copy.quiz,
      chapters: copy.quiz.chapters.map((c) => ({
        ...c,
        questions: c.questions.filter((q) => !remove.has(q.id)),
      })),
    }),
  }
}

// --- Reading ----------------------------------------------------------------

/**
 * What still stands between the working copy and a Save: the quiz rules and
 * the size caps. Empty when it can be saved.
 */
export function saveProblems(quiz: Quiz): Array<string> {
  // A new quiz has no id yet; any valid slug stands in for the check.
  const checked = quiz.id === '' ? { ...quiz, id: 'new-quiz' } : quiz
  const prefix = `quiz "${checked.id}"`
  return [
    ...validateQuizzes([checked]).map((error) =>
      error.startsWith(`${prefix} > `)
        ? error.slice(prefix.length + 3)
        : error.startsWith(`${prefix}: `)
          ? error.slice(prefix.length + 2)
          : error,
    ),
    ...checkQuizLimits(checked),
  ]
}

function shorten(text: string, max: number): string {
  const flat = text.replace(/\s+/g, ' ').trim()
  return flat.length > max ? `${flat.slice(0, max - 1)}…` : flat
}

/**
 * A compact text outline of the working copy for the model: details, mock
 * exam and every chapter and question id with (shortened) question text.
 */
export function outline(quiz: Quiz): string {
  const lines: Array<string> = []
  lines.push(`Title: ${quiz.title || '(not set)'}`)
  lines.push(`Description: ${quiz.description || '(not set)'}`)
  lines.push(
    quiz.exam
      ? `Mock exam: ${quiz.exam.questionCount} questions, ${quiz.exam.minutes} minutes, pass mark ${quiz.exam.passPercent}%`
      : 'Mock exam: none',
  )
  if (quiz.chapters.length === 0) {
    lines.push('Chapters: none yet')
  }
  for (const chapter of [...quiz.chapters].sort(
    (a, b) => a.number - b.number,
  )) {
    lines.push(
      `Chapter ${chapter.number} [id ${chapter.id}] ${chapter.title} (${chapter.questions.length} questions)`,
    )
    for (const q of chapter.questions) {
      const kind = isMultipleAnswer(q)
        ? `${q.correctIndexes.length} of ${q.options.length}`
        : `1 of ${q.options.length}`
      lines.push(`  - [${q.id}] (${kind}) ${shorten(q.question, 140)}`)
    }
  }
  return lines.join('\n')
}

/** Full questions, by id or by chapter, as the tools give them. */
export function readQuestions(
  quiz: Quiz,
  selection: { questionIds?: ReadonlyArray<string>; chapterId?: string },
): Array<QuestionInput & { id: string; chapterId: string }> {
  const ids = selection.questionIds ? new Set(selection.questionIds) : null
  return quiz.chapters.flatMap((c) =>
    c.questions
      .filter((q) => (ids ? ids.has(q.id) : selection.chapterId === c.id))
      .map((q) => ({ id: q.id, chapterId: c.id, ...toQuestionInput(q) })),
  )
}

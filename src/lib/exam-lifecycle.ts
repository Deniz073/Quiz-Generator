import type { PlannedQuestion } from '#/lib/quiz-plan'
import type { ExamState } from '#/lib/exam-state'
import type { StoredExam } from '#/domain/mock-exam'
import { examMinutes, isTimeUp } from '#/domain/mock-exam'
import type { ExamConfig, Quiz } from '#/quizzes/types'
import { examReducer, startExam } from '#/lib/exam-state'
import { chapterRef } from '#/lib/quiz-plan'
import { answerKey, isLegalPick, isPermutation } from '#/quizzes/question'

/*
 * What happens to a mock exam outside its reducer: deciding between a new,
 * a resumable and an expired exam, and converting between the exam's state
 * and what the server stores (see ./exam-api). Plain functions (the clock is
 * a parameter), no React: see ./use-exam for the hook that drives them.
 */

export type ExamStart =
  /** An unfinished exam with time left: the user decides what to do with it. */
  | { kind: 'prompt'; state: ExamState; sessionId: string }
  /** A saved exam whose time ran out, submitted here: it still has to be sent. */
  | { kind: 'expired'; state: ExamState; sessionId: string }
  /** A new exam, not stored yet. */
  | { kind: 'new'; state: ExamState }

/**
 * Client only (shuffles). A stored exam that no longer lines up with the quiz
 * (its content changed) is ignored: starting a new exam replaces it.
 */
export function resumeOrStart(
  quiz: Quiz,
  exam: ExamConfig,
  stored: StoredExam | null | undefined,
  now = Date.now(),
): ExamStart {
  const saved = stored ? resolveStoredExam(quiz, stored) : undefined
  if (!stored || !saved) return { kind: 'new', state: startExam(quiz, exam) }
  if (!isTimeUp(saved.endsAt, now)) {
    return { kind: 'prompt', state: saved, sessionId: stored.id }
  }
  // Time ran out while away: submit what was picked.
  return {
    kind: 'expired',
    state: examReducer(saved, { type: 'submit' }),
    sessionId: stored.id,
  }
}

/** The stored exam against the current quiz data, or undefined if it doesn't fit. */
export function resolveStoredExam(
  quiz: Quiz,
  stored: StoredExam,
): ExamState | undefined {
  const byId = new Map(
    quiz.chapters.flatMap((chapter) =>
      chapter.questions.map(
        (question) =>
          [question.id, { question, chapter: chapterRef(chapter) }] as const,
      ),
    ),
  )
  const total = stored.questions.length
  if (
    total === 0 ||
    stored.current < 0 ||
    stored.current >= total ||
    !Number.isFinite(stored.startedAt) ||
    !Number.isFinite(stored.endsAt)
  ) {
    return undefined
  }
  const plan: Array<PlannedQuestion> = []
  const picks: Array<Array<number>> = []
  const flagged: Array<number> = []
  for (const [position, entry] of stored.questions.entries()) {
    const found = byId.get(entry.questionId)
    if (
      !found ||
      !isPermutation(entry.optionOrder, found.question.options.length) ||
      !isLegalPick(answerKey(found.question), entry.picks)
    ) {
      return undefined
    }
    plan.push({
      question: found.question,
      optionOrder: [...entry.optionOrder],
      chapter: found.chapter,
    })
    picks.push([...entry.picks])
    if (entry.flagged) flagged.push(position)
  }
  return {
    plan,
    picks,
    flagged,
    current: stored.current,
    reviewing: stored.reviewing,
    submitted: false,
    startedAt: stored.startedAt,
    endsAt: stored.endsAt,
    passPercent: stored.passPercent,
  }
}

/** How far the server's clock (`serverNow`, epoch ms) is ahead of this device's. */
export function clockOffset(serverNow: number): number {
  return serverNow - Date.now()
}

/** The server's times on this device's clock (the countdown uses Date.now()). */
export function toDeviceTimes<T extends { startedAt: number; endsAt: number }>(
  times: T,
  offset: number,
): T {
  return {
    ...times,
    startedAt: times.startedAt - offset,
    endsAt: times.endsAt - offset,
  }
}

/** What the server needs to start storing a new exam. */
export function toNewSession(quizId: string, state: ExamState) {
  return {
    quizId,
    minutes: examMinutes(state.startedAt, state.endsAt),
    passPercent: state.passPercent,
    questions: state.plan.map((item) => ({
      questionId: item.question.id,
      optionOrder: [...item.optionOrder],
    })),
  }
}

/** The exam's state as the server stores it. */
export function toStoredState(sessionId: string, state: ExamState) {
  return {
    sessionId,
    current: state.current,
    reviewing: state.reviewing,
    flagged: [...state.flagged],
    picks: state.picks.map((pick) => [...pick]),
  }
}

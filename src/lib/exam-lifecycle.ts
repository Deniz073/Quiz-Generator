import type { ExamState } from '#/lib/exam-state'
import type { ExamConfig, Quiz } from '#/quizzes/types'
import {
  clearExamSession,
  loadExamSession,
  saveExamSession,
} from '#/lib/exam-session'
import { examReducer, getScore, startExam } from '#/lib/exam-state'
import { recordResult } from '#/lib/progress'

/*
 * What happens to a mock exam outside its reducer: deciding between a new,
 * a resumable and an expired exam, and keeping storage and progress in step
 * with it. Plain functions (the clock is a parameter), no React: see
 * ./use-exam for the hook that drives them.
 */

export type ExamStart =
  /** An unfinished exam with time left: the user decides what to do with it. */
  | { kind: 'prompt'; state: ExamState }
  /** A new exam, or a saved one whose time ran out (already submitted). */
  | { kind: 'run'; state: ExamState }

/**
 * Client only (reads storage and shuffles). Never throws: unreadable or stale
 * storage just means a new exam.
 */
export function resumeOrStart(
  quiz: Quiz,
  exam: ExamConfig,
  now = Date.now(),
): ExamStart {
  const saved = loadExamSession(quiz)
  if (!saved) return { kind: 'run', state: startExam(quiz, exam) }
  if (saved.endsAt > now) return { kind: 'prompt', state: saved }
  // Time ran out while away: submit what was picked. persistExam then records
  // the result and deletes the session.
  return { kind: 'run', state: examReducer(saved, { type: 'submit' }) }
}

/** Drops the saved exam and returns a new one starting now. */
export function discardAndStart(quiz: Quiz, exam: ExamConfig): ExamState {
  clearExamSession(quiz.id)
  return startExam(quiz, exam)
}

// Plans whose result is recorded already: once per exam, even if effects run
// twice (StrictMode) or the hook is reused for a restart (new plan).
const recorded = new WeakSet<ExamState['plan']>()

/**
 * Keeps storage in step with the exam, to be called on every change. While it
 * runs the session is saved; once submitted it is deleted and the result is
 * recorded (once).
 */
export function persistExam(quiz: Quiz, state: ExamState): void {
  if (!state.submitted) {
    saveExamSession(quiz, state)
    return
  }
  clearExamSession(quiz.id)
  if (recorded.has(state.plan)) return
  recorded.add(state.plan)
  recordResult(quiz.id, { exam: true }, getScore(state), state.plan.length)
}

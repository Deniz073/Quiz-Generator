import { useEffect, useReducer, useState } from 'react'
import type { ExamOverrides } from '#/domain/exam-settings'
import type { StoredExam } from '#/domain/mock-exam'
import type { ExamConfig, Quiz } from '#/quizzes/types'
import { resolveExamConfig } from '#/domain/exam-settings'
import { clockOffset, resumeOrStart, toDeviceTimes } from '#/lib/exam-lifecycle'
import { examReducer, startExam } from '#/lib/exam-state'
import { createExamSync } from '#/lib/exam-sync'
import { noteExamAttempt, useUserId } from '#/lib/user-data'
import { useCountdown } from '#/lib/use-countdown'
import { countQuestions } from '#/quizzes'

/** What the exam page loaded for a signed-in user (null for a visitor). */
export type ExamStartData = {
  overrides: ExamOverrides
  session: StoredExam | null
  /** The server's clock when this was loaded (epoch ms). */
  serverNow: number
} | null

/** The score the server recorded for a submitted exam. */
export interface ExamScore {
  score: number
  total: number
}

/**
 * A mock exam from opening the page to the result: offers to resume an
 * unfinished exam, runs the clock (submitting at the deadline) and, for a
 * signed-in user, has ./exam-sync keep the server in step. A visitor's exam is
 * kept nowhere. Call on the client only: it shuffles during init, which the
 * exam route guarantees (`ssr: 'data-only'`).
 *
 * `phase` is 'choosing' while an unfinished exam with time left waits for
 * `resume` or `discard`; the clock and the server are untouched until then.
 *
 * `defaults` are the quiz's exam settings; every new exam applies the user's
 * adjustments (`start.overrides`) on top of them. A resumed exam keeps its own.
 */
export function useExam(
  quiz: Quiz,
  defaults: ExamConfig,
  start: ExamStartData,
) {
  const userId = useUserId()
  const config = () =>
    resolveExamConfig(defaults, start?.overrides, countQuestions(quiz))
  const [initial] = useState(() => {
    const session =
      userId && start?.session
        ? toDeviceTimes(start.session, clockOffset(start.serverNow))
        : null
    return resumeOrStart(quiz, config(), session)
  })
  const [state, dispatch] = useReducer(examReducer, initial.state)
  const [choosing, setChoosing] = useState(initial.kind === 'prompt')
  const [recorded, setRecorded] = useState<ExamScore>()
  const [saveFailed, setSaveFailed] = useState(false)

  const [sync] = useState(() =>
    userId
      ? createExamSync(
          quiz.id,
          {
            onClock: (times) => dispatch({ type: 'clock', ...times }),
            onRecorded: (result) => {
              setRecorded(result)
              noteExamAttempt(userId, quiz.id, {
                ...result,
                at: new Date().toISOString(),
              })
            },
            onFailed: () => setSaveFailed(true),
          },
          initial.kind === 'new'
            ? undefined
            : { plan: initial.state.plan, sessionId: initial.sessionId },
        )
      : undefined,
  )

  // Stops ticking once submitted (the timer is not shown on results). A
  // stored exam whose time ran out was submitted by resumeOrStart.
  const secondsLeft = useCountdown(
    state.submitted || choosing ? undefined : state.endsAt,
  )
  useEffect(() => {
    if (secondsLeft === 0) dispatch({ type: 'submit' })
  }, [secondsLeft])

  useEffect(() => {
    if (!choosing) sync?.update(state)
  }, [sync, state, choosing])

  // Leaving the exam (in-app or by closing the tab) sends a pending save now.
  useEffect(() => {
    if (!sync) return
    window.addEventListener('pagehide', sync.flush)
    return () => {
      window.removeEventListener('pagehide', sync.flush)
      sync.flush()
    }
  }, [sync])

  return {
    phase: choosing ? ('choosing' as const) : ('running' as const),
    state,
    dispatch,
    secondsLeft,
    /** Whether the exam is kept, so leaving it doesn't lose it. */
    saved: userId !== undefined && !saveFailed,
    /** A save or the submit failed: the exam may not be (fully) recorded. */
    saveFailed,
    /** The server's score once it has recorded the submitted exam. */
    recorded,
    resume: () => setChoosing(false),
    /** Drops the unfinished exam for a new one (storing it replaces the old). */
    discard: () => {
      dispatch({ type: 'restart', state: startExam(quiz, config()) })
      setChoosing(false)
    },
    /** A new exam after the results. */
    restart: () => {
      setRecorded(undefined)
      setSaveFailed(false)
      dispatch({ type: 'restart', state: startExam(quiz, config()) })
    },
  }
}

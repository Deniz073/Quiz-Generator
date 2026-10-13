import { useEffect, useReducer, useState } from 'react'
import type { ExamConfig, Quiz } from '#/quizzes/types'
import { examReducer, startExam } from '#/lib/exam-state'
import {
  discardAndStart,
  persistExam,
  resumeOrStart,
} from '#/lib/exam-lifecycle'
import { useCountdown } from '#/lib/use-countdown'

/**
 * A mock exam from opening the page to the recorded result: finds a saved
 * exam, runs the clock (submitting at the deadline) and keeps storage and
 * progress in step. Call on the client only: it shuffles and reads storage
 * during init, which the exam routes guarantee (`ssr: 'data-only'`).
 *
 * `phase` is 'choosing' while a saved exam with time left waits for
 * `resume` or `discard`; the clock and storage are untouched until then.
 */
export function useExam(quiz: Quiz, exam: ExamConfig) {
  const [start] = useState(() => resumeOrStart(quiz, exam))
  const [state, dispatch] = useReducer(examReducer, start.state)
  const [choosing, setChoosing] = useState(start.kind === 'prompt')

  // Stops ticking once submitted (the timer is not shown on results). A
  // restored session whose time ran out was submitted by resumeOrStart.
  const secondsLeft = useCountdown(
    state.submitted || choosing ? undefined : state.endsAt,
  )
  useEffect(() => {
    if (secondsLeft === 0) dispatch({ type: 'submit' })
  }, [secondsLeft])

  useEffect(() => {
    if (!choosing) persistExam(quiz, state)
  }, [quiz, state, choosing])

  return {
    phase: choosing ? ('choosing' as const) : ('running' as const),
    state,
    dispatch,
    secondsLeft,
    resume: () => setChoosing(false),
    discard: () => {
      dispatch({ type: 'restart', state: discardAndStart(quiz, exam) })
      setChoosing(false)
    },
    /** A new exam after the results. */
    restart: () => dispatch({ type: 'restart', state: startExam(quiz, exam) }),
  }
}

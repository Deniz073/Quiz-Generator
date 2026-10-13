import { useEffect, useEffectEvent, useReducer, useRef, useState } from 'react'
import { useHotkey, useHotkeys } from '@tanstack/react-hotkeys'
import { useBlocker } from '@tanstack/react-router'
import type { PlannedQuestion } from '#/lib/quiz-plan'
import type { ExamState } from '#/lib/exam-state'
import type { ExamConfig, Quiz } from '#/quizzes/types'
import { clearExamSession, saveExamSession } from '#/lib/exam-session'
import { examReducer, getAnswers, getScore, startExam } from '#/lib/exam-state'
import { OPTION_KEYS } from '#/lib/option-keys'
import { reshufflePlan } from '#/lib/quiz-plan'
import { useCountdown } from '#/lib/use-countdown'
import { ExamQuestionView } from '#/components/ExamQuestionView'
import { ExamReview } from '#/components/ExamReview'
import { LeavePrompt } from '#/components/LeavePrompt'
import { QuizRunner } from '#/components/QuizRunner'
import { ResultsScreen } from '#/components/ResultsScreen'

interface Props {
  quiz: Quiz
  exam: ExamConfig
  /** A new exam, or a restored one (possibly already submitted on timeout). */
  initialState: ExamState
  /** Called once per finished exam (user submit or timeout), never for retries. */
  onFinish: (score: number, total: number) => void
}

// Always block while the exam runs; the blocker is disabled otherwise.
const alwaysBlock = () => true

export function ExamRunner(props: Props) {
  // Plain practice on the incorrect questions after the results. Rendered
  // instead of the exam (not inside it), so the exam's hotkeys are unmounted
  // and don't clash with the practice round's.
  const [retryItems, setRetryItems] = useState<Array<PlannedQuestion>>()
  if (retryItems) {
    return (
      <QuizRunner
        quizId={props.quiz.id}
        mode="subset"
        buildPlan={() => reshufflePlan(retryItems)}
      />
    )
  }
  return <ExamSession {...props} onRetryIncorrect={setRetryItems} />
}

/**
 * The timed mock exam: free navigation between questions, a review screen,
 * auto-submit at the deadline. The session is saved to localStorage on every
 * change while the exam runs and deleted once it is submitted.
 */
function ExamSession({
  quiz,
  exam,
  initialState,
  onFinish,
  onRetryIncorrect,
}: Props & { onRetryIncorrect: (items: Array<PlannedQuestion>) => void }) {
  const [state, dispatch] = useReducer(examReducer, initialState)
  const { submitted, reviewing, current, plan } = state

  // Stops ticking once submitted (the timer is not shown on results). A
  // restored session whose time ran out starts at 0 and is submitted at once.
  const secondsLeft = useCountdown(submitted ? undefined : state.endsAt)
  useEffect(() => {
    if (secondsLeft === 0) dispatch({ type: 'submit' })
  }, [secondsLeft])

  // Keep the saved session in step with the exam; on submit delete it and
  // record the result. recordedPlan makes recording once per exam even if
  // effects run twice (StrictMode) or a restart reuses this component.
  const recordedPlan = useRef<ExamState['plan'] | undefined>(undefined)
  const recordResult = useEffectEvent(() => {
    onFinish(getScore(state), plan.length)
  })
  useEffect(() => {
    if (!submitted) {
      saveExamSession(quiz, state)
      return
    }
    clearExamSession(quiz.id)
    if (recordedPlan.current !== plan) {
      recordedPlan.current = plan
      recordResult()
    }
  }, [quiz, state, submitted, plan])

  // Warn before leaving a running exam: in-app navigation gets the inline
  // prompt below, reload/close the browser's own prompt. Disabled once
  // submitted, so the results screen's links navigate freely.
  const blocker = useBlocker({
    shouldBlockFn: alwaysBlock,
    enableBeforeUnload: true,
    disabled: submitted,
    withResolver: true,
  })
  const blocked = blocker.status === 'blocked'
  useEffect(() => {
    // Timeout while the prompt is open: drop the pending navigation.
    if (submitted && blocker.status === 'blocked') blocker.reset()
  }, [submitted, blocker])

  // Back at the top after jumping between questions or to/from the review.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [current, reviewing])

  const questionKeys = !submitted && !reviewing && !blocked

  // Enter = Next. It keeps its native meaning (a click) on a focused button
  // other than an option, e.g. Previous or Flag, so don't prevent it there.
  // requireReset: holding Enter moves one question, not through all of them.
  useHotkey(
    'Enter',
    (event) => {
      const target = event.target
      if (
        target instanceof Element &&
        target.closest('button:not([data-option]), a, summary')
      ) {
        return
      }
      event.preventDefault()
      dispatch({ type: 'next' })
    },
    { enabled: questionKeys, preventDefault: false, requireReset: true },
  )
  useHotkey('ArrowLeft', () => dispatch({ type: 'prev' }), {
    enabled: questionKeys,
  })
  useHotkey('ArrowRight', () => dispatch({ type: 'next' }), {
    enabled: questionKeys,
  })

  // 1-6 / A-F pick (single answer) or toggle (multiple answer) the option
  // shown at that position.
  const item = plan[current]
  useHotkeys(
    OPTION_KEYS.flatMap(({ digit, letter }, position) =>
      [digit, letter].map((hotkey) => ({
        hotkey,
        callback: () =>
          dispatch({
            type: 'toggle',
            originalIndex: item.optionOrder[position],
          }),
        options: {
          enabled: questionKeys && position < item.optionOrder.length,
        },
      })),
    ),
  )

  if (submitted) {
    const answers = getAnswers(state)
    return (
      <ResultsScreen
        quizId={quiz.id}
        answers={answers}
        score={getScore(state)}
        retryLabel="New mock exam"
        passPercent={exam.passPercent}
        onRetry={() =>
          dispatch({ type: 'restart', state: startExam(quiz, exam) })
        }
        onRetryIncorrect={() =>
          onRetryIncorrect(
            answers.filter((answer) => !answer.correct).map((a) => a.item),
          )
        }
      />
    )
  }

  return (
    <>
      {blocked ? (
        <LeavePrompt
          title="Leave the exam?"
          description="Your progress is saved and you can resume it."
          stayLabel="Stay on the exam"
          leaveLabel="Leave exam"
          onStay={blocker.reset}
          onLeave={blocker.proceed}
        />
      ) : null}
      {reviewing ? (
        <ExamReview
          state={state}
          secondsLeft={secondsLeft}
          dispatch={dispatch}
        />
      ) : (
        <ExamQuestionView
          state={state}
          secondsLeft={secondsLeft}
          dispatch={dispatch}
        />
      )}
    </>
  )
}

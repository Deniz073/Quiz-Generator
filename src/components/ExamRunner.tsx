import type { Dispatch } from 'react'
import { useEffect, useState } from 'react'
import { useHotkey, useHotkeys } from '@tanstack/react-hotkeys'
import { useBlocker } from '@tanstack/react-router'
import type { PlannedQuestion } from '#/lib/quiz-plan'
import type { ExamAction, ExamState } from '#/lib/exam-state'
import type { ExamConfig, Quiz } from '#/quizzes/types'
import { getAnswers, getScore } from '#/lib/exam-state'
import { OPTION_KEYS } from '#/lib/option-keys'
import { reshufflePlan } from '#/lib/quiz-plan'
import { useExam } from '#/lib/use-exam'
import { ExamQuestionView } from '#/components/ExamQuestionView'
import { ExamResumePrompt } from '#/components/ExamResumePrompt'
import { ExamReview } from '#/components/ExamReview'
import { LeavePrompt } from '#/components/LeavePrompt'
import { QuizRunner } from '#/components/QuizRunner'
import { ResultsScreen } from '#/components/ResultsScreen'

interface Props {
  quiz: Quiz
  exam: ExamConfig
}

// Always block while the exam runs; the blocker is disabled otherwise.
const alwaysBlock = () => true

export function ExamRunner({ quiz, exam }: Props) {
  const { phase, state, dispatch, secondsLeft, resume, discard, restart } =
    useExam(quiz, exam)

  // Plain practice on the incorrect questions after the results. Rendered
  // instead of the exam (not inside it), so the exam's hotkeys are unmounted
  // and don't clash with the practice round's.
  const [retryItems, setRetryItems] = useState<Array<PlannedQuestion>>()
  if (retryItems) {
    return (
      <QuizRunner
        quizId={quiz.id}
        mode="subset"
        buildPlan={() => reshufflePlan(retryItems)}
      />
    )
  }
  if (phase === 'choosing') {
    return (
      <ExamResumePrompt state={state} onResume={resume} onDiscard={discard} />
    )
  }
  return (
    <ExamSession
      quizId={quiz.id}
      passPercent={exam.passPercent}
      state={state}
      dispatch={dispatch}
      secondsLeft={secondsLeft}
      onRestart={restart}
      onRetryIncorrect={setRetryItems}
    />
  )
}

interface SessionProps {
  quizId: string
  passPercent: number
  state: ExamState
  dispatch: Dispatch<ExamAction>
  secondsLeft: number | undefined
  onRestart: () => void
  onRetryIncorrect: (items: Array<PlannedQuestion>) => void
}

/**
 * The timed mock exam as the user sees it: free navigation between questions,
 * a review screen, hotkeys, results. State, clock and storage live in useExam.
 */
function ExamSession({
  quizId,
  passPercent,
  state,
  dispatch,
  secondsLeft,
  onRestart,
  onRetryIncorrect,
}: SessionProps) {
  const { submitted, reviewing, current, plan } = state

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
        quizId={quizId}
        answers={answers}
        score={getScore(state)}
        retryLabel="New mock exam"
        passPercent={passPercent}
        onRetry={onRestart}
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

import { useEffect, useReducer, useRef, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { useHotkey } from '@tanstack/react-hotkeys'
import type { Question } from '#/quizzes/types'
import { buttonClasses } from '#/lib/button-classes'
import { scrollIntoViewIfNeeded, useFocusHeadingOnChange } from '#/lib/focus'
import { buildShuffledPlan } from '#/lib/quiz-plan'
import {
  canCheck,
  createInitialState,
  getSelected,
  isSubmitted,
  quizReducer,
} from '#/lib/quiz-state'
import { useFlags } from '#/lib/user-data'
import { useFlagToggle } from '#/lib/use-flag-toggle'
import { useOptionHotkeys } from '#/lib/use-option-hotkeys'
import { isMultipleAnswer } from '#/quizzes/question'
import { Feedback } from '#/components/Feedback'
import { AnswerTip, QuestionBody } from '#/components/QuestionCard'

interface Props {
  quizId: string
  chapterId: string
  question: Question
}

/**
 * One question on its own, as opened from a shared link: answer it, see the
 * feedback, try again or go on to its chapter. Not scored and not saved.
 */
export function SingleQuestion({ quizId, chapterId, question }: Props) {
  // A new attempt remounts the question: new option order, nothing picked.
  const [attempt, setAttempt] = useState(0)

  const containerRef = useFocusHeadingOnChange(attempt)

  return (
    <div ref={containerRef}>
      <Attempt
        key={attempt}
        quizId={quizId}
        chapterId={chapterId}
        question={question}
        onRetry={() => setAttempt((value) => value + 1)}
      />
    </div>
  )
}

function Attempt({
  quizId,
  chapterId,
  question,
  onRetry,
}: Props & { onRetry: () => void }) {
  // A practice round of one question. The route renders on the client only
  // (ssr: 'data-only'), so shuffling during init can't cause a hydration
  // mismatch.
  const [state, dispatch] = useReducer(quizReducer, undefined, () =>
    createInitialState(buildShuffledPlan([question]), {}),
  )
  const { optionOrder } = state.plan[0]
  const submitted = isSubmitted(state)
  const picks = getSelected(state)
  const flags = useFlags(quizId)
  const onFlag = useFlagToggle(quizId)

  const multiple = isMultipleAnswer(question)
  const toggle = (originalIndex: number) =>
    dispatch({ type: 'toggle', originalIndex })
  const check = () => dispatch({ type: 'check' })

  useOptionHotkeys({ optionOrder, enabled: !submitted, onPick: toggle })
  // requireReset: holding Enter checks once.
  useHotkey('Enter', check, { enabled: canCheck(state), requireReset: true })

  // Once answered, the feedback and the next steps below it come into view,
  // and focus moves to the main next step (the picked option is now inert).
  const nextRef = useRef<HTMLAnchorElement>(null)
  useEffect(() => {
    const next = nextRef.current
    if (!submitted || !next) return
    next.focus({ preventScroll: true })
    scrollIntoViewIfNeeded(next)
  }, [submitted])

  return (
    <>
      <QuestionBody
        item={state.plan[0]}
        selected={picks}
        submitted={submitted}
        flagged={flags?.has(question.id) ?? false}
        onToggle={toggle}
        onFlag={() => onFlag(question)}
        shareQuizId={quizId}
      />

      <div aria-live="polite">
        {submitted ? <Feedback question={question} chosen={picks} /> : null}
      </div>

      {submitted ? (
        <div className="mt-5 flex flex-wrap items-center justify-end gap-3">
          <button
            type="button"
            onClick={onRetry}
            className={buttonClasses('secondary')}
          >
            Try again
          </button>
          <Link
            ref={nextRef}
            to="/quiz/$quizId/$chapterId"
            params={{ quizId, chapterId }}
            // Breathing room below the link when it is scrolled into view.
            className={`scroll-mb-6 ${buttonClasses('primary')}`}
          >
            Practice this chapter
          </Link>
        </div>
      ) : multiple ? (
        <div className="mt-5 flex items-center justify-between gap-3">
          <AnswerTip item={state.plan[0]} />
          <button
            type="button"
            onClick={check}
            disabled={!canCheck(state)}
            className={`ml-auto ${buttonClasses('primary')}`}
          >
            Check answer
          </button>
        </div>
      ) : (
        <AnswerTip item={state.plan[0]} className="mt-5" />
      )}
    </>
  )
}

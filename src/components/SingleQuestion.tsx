import { useEffect, useRef, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { useHotkey } from '@tanstack/react-hotkeys'
import type { Question } from '#/quizzes/types'
import { buttonClasses } from '#/lib/button-classes'
import { toggleFlag } from '#/lib/flags'
import { focusHeading, isFocusLost } from '#/lib/focus'
import { describeOptionKeys } from '#/lib/option-keys'
import { shuffle } from '#/lib/shuffle'
import { useFlags } from '#/lib/use-flags'
import { useOptionHotkeys } from '#/lib/use-option-hotkeys'
import {
  getCorrectIndexes,
  isMultipleAnswer,
  togglePick,
} from '#/quizzes/question'
import { Feedback } from '#/components/Feedback'
import {
  QuestionBody,
  scrollIntoViewIfNeeded,
  tipClasses,
} from '#/components/QuestionCard'

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

  // "Try again" unmounts with the old attempt; put focus on the question.
  const containerRef = useRef<HTMLDivElement>(null)
  const shownAttempt = useRef(attempt)
  useEffect(() => {
    if (shownAttempt.current === attempt) return
    shownAttempt.current = attempt
    if (isFocusLost()) focusHeading(containerRef.current?.querySelector('h2'))
  }, [attempt])

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
  // The route renders on the client only (ssr: 'data-only'), so shuffling
  // during init can't cause a hydration mismatch.
  const [optionOrder] = useState(() =>
    shuffle(question.options.map((_, index) => index)),
  )
  const [picks, setPicks] = useState<ReadonlyArray<number>>([])
  const [submitted, setSubmitted] = useState(false)
  const flags = useFlags(quizId)

  const multiple = isMultipleAnswer(question)
  const required = getCorrectIndexes(question).length
  const canCheck = multiple && !submitted && picks.length === required
  const keyTip = describeOptionKeys(optionOrder.length)

  // As in practice rounds: a single answer locks in on the first pick, multiple
  // answers are toggled and then checked.
  const pick = (originalIndex: number) => {
    if (submitted) return
    if (multiple) {
      setPicks((current) => togglePick(question, current, originalIndex))
    } else {
      setPicks([originalIndex])
      setSubmitted(true)
    }
  }

  useOptionHotkeys({ optionOrder, enabled: !submitted, onPick: pick })
  // requireReset: holding Enter checks once.
  useHotkey('Enter', () => setSubmitted(true), {
    enabled: canCheck,
    requireReset: true,
  })

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
        item={{ question, optionOrder }}
        selected={picks}
        submitted={submitted}
        flagged={flags?.has(question.id) ?? false}
        onToggle={pick}
        onFlag={() => toggleFlag(quizId, question)}
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
          <p className={tipClasses}>
            Tip: press {keyTip} to toggle, Enter to check.
          </p>
          <button
            type="button"
            onClick={() => setSubmitted(true)}
            disabled={!canCheck}
            className={`ml-auto ${buttonClasses('primary')}`}
          >
            Check answer
          </button>
        </div>
      ) : (
        <p className={`mt-5 ${tipClasses}`}>Tip: press {keyTip} to answer.</p>
      )}
    </>
  )
}

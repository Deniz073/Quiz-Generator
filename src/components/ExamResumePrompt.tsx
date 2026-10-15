import { useEffect, useId, useRef, useState } from 'react'
import type { ExamState } from '#/lib/exam-state'
import { buttonClasses } from '#/lib/button-classes'
import { getCounts } from '#/lib/exam-state'
import { formatSeconds, useCountdown } from '#/lib/use-countdown'

interface Props {
  state: ExamState
  onResume: () => void
  onDiscard: () => void
}

/** Shown when an unfinished mock exam with time left was found in storage. */
export function ExamResumePrompt({ state, onResume, onDiscard }: Props) {
  const { answered } = getCounts(state)
  const secondsLeft = useCountdown(state.endsAt)
  const [confirming, setConfirming] = useState(false)
  const confirmTitleId = useId()
  const cancelRef = useRef<HTMLButtonElement>(null)
  const discardRef = useRef<HTMLButtonElement>(null)
  const wasConfirming = useRef(false)

  // The safe choice gets focus, so Enter can't discard by accident. After
  // cancelling, focus returns to the button that opened the confirmation.
  useEffect(() => {
    if (confirming) cancelRef.current?.focus()
    else if (wasConfirming.current) discardRef.current?.focus()
    wasConfirming.current = confirming
  }, [confirming])

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
      <h2 className="text-lg font-semibold">
        You have an unfinished mock exam
      </h2>
      <p className="mt-1 text-slate-600 dark:text-slate-400">
        {answered} of {state.plan.length} answered
        {secondsLeft === undefined
          ? ''
          : `, ${formatSeconds(secondsLeft)} left`}
        . The clock kept running while you were away.
      </p>
      {confirming ? (
        <div role="alertdialog" aria-labelledby={confirmTitleId}>
          <p id={confirmTitleId} className="mt-5 font-semibold">
            Discard this exam?
          </p>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Your answers are deleted and a new exam starts.
          </p>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row">
            <button
              ref={cancelRef}
              type="button"
              onClick={() => setConfirming(false)}
              className={buttonClasses('primary')}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onDiscard}
              className={buttonClasses('secondary')}
            >
              Discard and start new
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onResume}
            className={buttonClasses('primary')}
          >
            Resume exam
          </button>
          <button
            ref={discardRef}
            type="button"
            onClick={() => setConfirming(true)}
            className={buttonClasses('secondary')}
          >
            Discard and start new
          </button>
        </div>
      )}
    </div>
  )
}

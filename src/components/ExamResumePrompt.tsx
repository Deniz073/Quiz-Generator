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
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onResume}
          className={buttonClasses('primary')}
        >
          Resume exam
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
  )
}

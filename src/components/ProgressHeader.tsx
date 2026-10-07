import { formatSeconds } from '#/lib/use-countdown'

interface Props {
  /** Zero-based index of the current question. */
  index: number
  total: number
  /** Running score; omit in exam mode, where nothing is revealed until the end. */
  score?: number
  /** Questions answered so far, counting the current one once submitted. */
  answeredCount: number
  /** Exam only: whole seconds left. */
  secondsLeft?: number
}

export function ProgressHeader({
  index,
  total,
  score,
  answeredCount,
  secondsLeft,
}: Props) {
  return (
    <>
      <div className="flex items-center justify-between text-sm font-medium text-slate-600 dark:text-slate-400">
        <span>
          Question {index + 1} of {total}
        </span>
        {secondsLeft !== undefined ? (
          // role="timer" is not announced on change, so screen readers are not
          // interrupted every second.
          <span
            role="timer"
            className={`tabular-nums ${
              secondsLeft <= 60 ? 'text-red-700 dark:text-red-400' : ''
            }`}
          >
            Time left: {formatSeconds(secondsLeft)}
          </span>
        ) : score !== undefined ? (
          <span>
            Score: {score} / {answeredCount}
          </span>
        ) : null}
      </div>
      <div
        className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={answeredCount}
        aria-label="Quiz progress"
      >
        <div
          className="h-full bg-sky-500 transition-all"
          style={{ width: `${(answeredCount / total) * 100}%` }}
        />
      </div>
    </>
  )
}

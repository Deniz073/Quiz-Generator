interface Props {
  /** Zero-based index of the current question. */
  index: number
  total: number
  score: number
  /** Questions answered so far, counting the current one once submitted. */
  answeredCount: number
}

export function ProgressHeader({ index, total, score, answeredCount }: Props) {
  return (
    <>
      <div className="flex items-center justify-between text-sm font-medium text-slate-600 dark:text-slate-400">
        <span>
          Question {index + 1} of {total}
        </span>
        <span>
          Score: {score} / {answeredCount}
        </span>
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

import type { QuestionStatus } from '#/lib/exam-state'

interface Props {
  statuses: ReadonlyArray<QuestionStatus>
  /** Plan indexes of flagged questions. */
  flagged: ReadonlyArray<number>
  /** Zero-based question being shown; omit on the review screen. */
  current?: number
  onSelect: (index: number) => void
}

// Fill and border differ per status, so the state doesn't rely on colour alone.
const STATUS_CLASSES: Record<QuestionStatus, string> = {
  answered:
    'border-sky-600 bg-sky-600 text-white hover:bg-sky-700 dark:border-sky-500 dark:bg-sky-600',
  incomplete:
    'border-dashed border-sky-600 bg-sky-50 text-sky-900 hover:bg-sky-100 dark:border-sky-400 dark:bg-slate-800 dark:text-sky-100 dark:hover:bg-slate-700',
  unanswered:
    'border-slate-300 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800',
}

const STATUS_LABELS: Record<QuestionStatus, string> = {
  answered: 'answered',
  incomplete: 'incomplete',
  unanswered: 'not answered',
}

/** Numbered grid of all questions; clicking one jumps to it. */
export function QuestionNavigator({
  statuses,
  flagged,
  current,
  onSelect,
}: Props) {
  return (
    <div>
      <ol className="grid grid-cols-[repeat(auto-fill,minmax(2.75rem,1fr))] gap-1.5">
        {statuses.map((status, index) => {
          const isFlagged = flagged.includes(index)
          return (
            <li key={index}>
              <button
                type="button"
                onClick={() => onSelect(index)}
                aria-current={index === current ? 'true' : undefined}
                aria-label={`Question ${index + 1}, ${STATUS_LABELS[status]}${isFlagged ? ', flagged' : ''}`}
                className={`relative h-10 w-full rounded-md border text-sm font-medium tabular-nums focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 ${
                  STATUS_CLASSES[status]
                } ${
                  index === current
                    ? 'ring-2 ring-slate-900 ring-offset-2 dark:ring-slate-100 dark:ring-offset-slate-950'
                    : ''
                }`}
              >
                {index + 1}
                {isFlagged ? (
                  <span
                    aria-hidden="true"
                    className="absolute -top-1.5 -right-1.5 rounded-full bg-amber-400 px-1 text-[10px] leading-4 text-amber-950"
                  >
                    &#9873;
                  </span>
                ) : null}
              </button>
            </li>
          )
        })}
      </ol>
      <p className="mt-3 text-xs text-slate-500">
        Filled: answered. Dashed: incomplete. Outlined: not answered. &#9873;:
        flagged.
      </p>
    </div>
  )
}

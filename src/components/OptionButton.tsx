import type { ReactNode } from 'react'
import type { OptionState } from '#/lib/option-state'

interface OptionStyle {
  classes: string
  /** Visual-only result marker shown after answering. */
  mark?: ReactNode
  /** Screen-reader equivalent of the colour and marker. */
  srLabel?: string
}

const base =
  'flex w-full items-start gap-3 rounded-lg border px-4 py-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500'

const correctClasses =
  'border-emerald-500 bg-emerald-50 text-emerald-900 dark:border-emerald-500 dark:bg-emerald-950 dark:text-emerald-100'
const unavailableClasses =
  'border-slate-200 bg-white text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-500'

const OPTION_STYLES: Record<OptionState, OptionStyle> = {
  idle: {
    classes:
      'cursor-pointer border-slate-300 bg-white hover:border-sky-500 hover:bg-sky-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-sky-400 dark:hover:bg-slate-800',
  },
  selected: {
    classes:
      'cursor-pointer border-sky-500 bg-sky-50 hover:bg-sky-100 dark:border-sky-400 dark:bg-slate-800 dark:hover:bg-slate-700',
  },
  blocked: { classes: `cursor-not-allowed ${unavailableClasses}` },
  correct: {
    classes: correctClasses,
    mark: <span aria-hidden="true">&#10003;</span>,
    srLabel: '(correct answer)',
  },
  correctSelected: {
    classes: correctClasses,
    mark: <span aria-hidden="true">&#10003;</span>,
    srLabel: '(correct answer, selected)',
  },
  missed: {
    classes:
      'border-dashed border-emerald-500 bg-white text-emerald-800 dark:border-emerald-500 dark:bg-slate-900 dark:text-emerald-300',
    mark: (
      <span aria-hidden="true" className="text-xs font-medium">
        missed
      </span>
    ),
    srLabel: '(correct answer, not selected)',
  },
  wrong: {
    classes:
      'border-red-500 bg-red-50 text-red-900 dark:border-red-500 dark:bg-red-950 dark:text-red-100',
    mark: <span aria-hidden="true">&#10007;</span>,
    srLabel: '(your answer, incorrect)',
  },
  dim: { classes: `cursor-default ${unavailableClasses}` },
}

interface Props {
  state: OptionState
  multiple: boolean
  chosen: boolean
  /** True once the answer is locked and feedback is shown. */
  answered: boolean
  /** Exam mode: a single-answer pick can still be changed, so expose its state. */
  changeable: boolean
  letter: string
  text: string
  onClick: () => void
}

export function OptionButton({
  state,
  multiple,
  chosen,
  answered,
  changeable,
  letter,
  text,
  onClick,
}: Props) {
  const { classes, mark, srLabel } = OPTION_STYLES[state]
  return (
    <button
      type="button"
      className={`${base} ${classes}`}
      role={multiple ? 'checkbox' : undefined}
      aria-checked={multiple ? chosen : undefined}
      aria-pressed={!multiple && changeable ? chosen : undefined}
      aria-disabled={answered || state === 'blocked'}
      onClick={onClick}
    >
      {multiple ? (
        <span
          aria-hidden="true"
          className={`mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-sm border-2 border-current text-sm font-bold ${
            chosen ? 'bg-current/15' : ''
          }`}
        >
          {chosen ? (answered ? '■' : '✓') : ''}
        </span>
      ) : null}
      <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded border border-current text-xs font-semibold">
        {letter}
      </span>
      <span className="flex-1">{text}</span>
      {srLabel ? <span className="sr-only">{srLabel}</span> : null}
      {mark}
    </button>
  )
}

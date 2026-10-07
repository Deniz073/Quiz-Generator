import { useEffect, useRef, useState } from 'react'
import type { Dispatch } from 'react'
import type { ExamAction, ExamState } from '#/lib/exam-state'
import { buttonClasses } from '#/lib/button-classes'
import { getCounts, getStatuses } from '#/lib/exam-state'
import { FilterButton } from '#/components/FilterButton'
import { ProgressHeader } from '#/components/ProgressHeader'
import { QuestionNavigator } from '#/components/QuestionNavigator'

type JumpFilter = 'unanswered' | 'flagged' | 'all'

interface Props {
  state: ExamState
  /** Whole seconds left; the clock keeps running while reviewing. */
  secondsLeft: number | undefined
  dispatch: Dispatch<ExamAction>
}

/** Overview before submitting: counts, navigator, jump list, submit. */
export function ExamReview({ state, secondsLeft, dispatch }: Props) {
  const { plan, flagged } = state
  const total = plan.length
  const counts = getCounts(state)
  const statuses = getStatuses(state)
  const [filter, setFilter] = useState<JumpFilter>(
    counts.unanswered > 0
      ? 'unanswered'
      : flagged.length > 0
        ? 'flagged'
        : 'all',
  )
  const [confirming, setConfirming] = useState(false)
  const confirmRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (confirming) confirmRef.current?.focus()
  }, [confirming])

  const listed = plan
    .map((item, index) => ({ item, index }))
    .filter(({ index }) =>
      filter === 'all'
        ? true
        : filter === 'flagged'
          ? flagged.includes(index)
          : statuses[index] !== 'answered',
    )

  const goto = (index: number) => dispatch({ type: 'goto', index })

  return (
    <div>
      <ProgressHeader
        label="Review answers"
        total={total}
        answeredCount={counts.answered}
        secondsLeft={secondsLeft}
      />

      <dl className="mt-6 grid grid-cols-3 gap-3 text-center">
        <Stat label="Answered" value={counts.answered} />
        <Stat
          label="Unanswered"
          value={counts.unanswered}
          warn={counts.unanswered > 0}
        />
        <Stat label="Flagged" value={counts.flagged} />
      </dl>
      {counts.unanswered > 0 ? (
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Incomplete answers count as unanswered. Unanswered questions score as
          wrong.
        </p>
      ) : null}

      <div className="mt-6">
        <QuestionNavigator
          statuses={statuses}
          flagged={flagged}
          onSelect={goto}
        />
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">Jump to</h2>
        <div
          role="group"
          aria-label="Questions to jump to"
          className="inline-flex rounded-lg border border-slate-300 p-0.5 text-sm dark:border-slate-700"
        >
          <FilterButton
            active={filter === 'unanswered'}
            onClick={() => setFilter('unanswered')}
          >
            Unanswered ({counts.unanswered})
          </FilterButton>
          <FilterButton
            active={filter === 'flagged'}
            onClick={() => setFilter('flagged')}
          >
            Flagged ({counts.flagged})
          </FilterButton>
          <FilterButton
            active={filter === 'all'}
            onClick={() => setFilter('all')}
          >
            All ({total})
          </FilterButton>
        </div>
      </div>
      {listed.length === 0 ? (
        <p className="mt-3 text-slate-600 dark:text-slate-400">
          {filter === 'unanswered'
            ? 'Every question is answered.'
            : 'No flagged questions.'}
        </p>
      ) : (
        <ol className="mt-3 flex flex-col gap-2">
          {listed.map(({ item, index }) => (
            <li key={index}>
              <button
                type="button"
                onClick={() => goto(index)}
                className="flex w-full items-baseline gap-3 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-left hover:border-sky-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-sky-400"
              >
                <span className="font-semibold tabular-nums">{index + 1}.</span>
                <span className="line-clamp-2 flex-1">
                  {item.question.question}
                </span>
                {statuses[index] !== 'answered' ? (
                  <span className="shrink-0 text-xs font-semibold tracking-wide text-red-700 uppercase dark:text-red-400">
                    {statuses[index] === 'incomplete'
                      ? 'Incomplete'
                      : 'Not answered'}
                  </span>
                ) : null}
                {flagged.includes(index) ? (
                  <span className="shrink-0 text-xs font-semibold tracking-wide text-amber-700 uppercase dark:text-amber-400">
                    Flagged
                  </span>
                ) : null}
              </button>
            </li>
          ))}
        </ol>
      )}

      {confirming ? (
        <div
          role="alertdialog"
          aria-labelledby="submit-confirm-title"
          className="mt-8 rounded-lg border border-amber-500 bg-amber-50 p-4 text-amber-950 dark:bg-amber-950 dark:text-amber-50"
        >
          <p id="submit-confirm-title" className="font-semibold">
            Submit with {counts.unanswered} unanswered{' '}
            {counts.unanswered === 1 ? 'question' : 'questions'}?
          </p>
          <p className="mt-1 text-sm">
            They will count as wrong. You can't change your answers after
            submitting.
          </p>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row">
            <button
              ref={confirmRef}
              type="button"
              onClick={() => dispatch({ type: 'submit' })}
              className={buttonClasses('primary')}
            >
              Submit anyway
            </button>
            <button
              type="button"
              onClick={() => setConfirming(false)}
              className={buttonClasses('secondary')}
            >
              Keep reviewing
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between">
          <button
            type="button"
            onClick={() => dispatch({ type: 'back' })}
            className={buttonClasses('secondary')}
          >
            Back to questions
          </button>
          <button
            type="button"
            onClick={() =>
              counts.unanswered > 0
                ? setConfirming(true)
                : dispatch({ type: 'submit' })
            }
            className={buttonClasses('primary')}
          >
            Submit exam
          </button>
        </div>
      )}
    </div>
  )
}

function Stat({
  label,
  value,
  warn = false,
}: {
  label: string
  value: number
  warn?: boolean
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
      <dt className="text-xs font-medium text-slate-600 dark:text-slate-400">
        {label}
      </dt>
      <dd
        className={`text-2xl font-bold tabular-nums ${
          warn ? 'text-red-700 dark:text-red-400' : ''
        }`}
      >
        {value}
      </dd>
    </div>
  )
}

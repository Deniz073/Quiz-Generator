import type { Dispatch } from 'react'
import type { ExamAction, ExamState } from '#/lib/exam-state'
import { buttonClasses } from '#/lib/button-classes'
import { getCounts, getStatuses } from '#/lib/exam-state'
import { describeOptionKeys } from '#/lib/option-keys'
import { ProgressHeader } from '#/components/ProgressHeader'
import { QuestionBody, tipClasses } from '#/components/QuestionCard'
import { QuestionNavigator } from '#/components/QuestionNavigator'

interface Props {
  state: ExamState
  /** Whole seconds left. */
  secondsLeft: number | undefined
  dispatch: Dispatch<ExamAction>
}

/**
 * One exam question: no feedback, the pick stays editable and the user can
 * move back and forth, skip, or jump anywhere via the navigator.
 */
export function ExamQuestionView({ state, secondsLeft, dispatch }: Props) {
  const { plan, picks, flagged, current } = state
  const item = plan[current]
  const total = plan.length
  const { answered } = getCounts(state)
  const isLast = current === total - 1

  return (
    <div>
      <ProgressHeader
        label={`Question ${current + 1} of ${total}`}
        total={total}
        answeredCount={answered}
        secondsLeft={secondsLeft}
      />

      {/* key: don't carry focus or hover state over to the next question. */}
      <div key={current}>
        <QuestionBody
          item={item}
          selected={picks[current]}
          submitted={false}
          changeable
          flagged={flagged.includes(current)}
          onToggle={(originalIndex) =>
            dispatch({ type: 'toggle', originalIndex })
          }
          onFlag={() => dispatch({ type: 'flag' })}
        />
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => dispatch({ type: 'prev' })}
          disabled={current === 0}
          className={buttonClasses('secondary')}
        >
          Previous
        </button>
        <button
          type="button"
          onClick={() => dispatch({ type: 'next' })}
          className={buttonClasses('primary')}
        >
          {isLast ? 'Review answers' : 'Next'}
        </button>
      </div>
      <div className="mt-3 flex items-center justify-between gap-3">
        <p className={tipClasses}>
          Tip: press {describeOptionKeys(item.optionOrder.length)} to answer,
          &larr; &rarr; or Enter to move.
        </p>
        <button
          type="button"
          onClick={() => dispatch({ type: 'review' })}
          className={`ml-auto ${buttonClasses('secondary')}`}
        >
          Review &amp; submit
        </button>
      </div>

      <details className="mt-6 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <summary className="cursor-pointer text-sm font-medium">
          Question navigator
        </summary>
        <div className="mt-4">
          <QuestionNavigator
            statuses={getStatuses(state)}
            flagged={flagged}
            current={current}
            onSelect={(index) => dispatch({ type: 'goto', index })}
          />
        </div>
      </details>
    </div>
  )
}

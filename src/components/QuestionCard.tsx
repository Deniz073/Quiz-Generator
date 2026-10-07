import { useEffect, useId, useRef } from 'react'
import type { PlannedQuestion } from '#/lib/quiz-plan'
import { buttonClasses } from '#/lib/button-classes'
import { describeOptionKeys, getOptionLetter } from '#/lib/option-keys'
import { getOptionState } from '#/lib/option-state'
import { getCorrectIndexes, isMultipleAnswer } from '#/quizzes/question'
import { Feedback } from '#/components/Feedback'
import { OptionButton } from '#/components/OptionButton'
import { ProgressHeader } from '#/components/ProgressHeader'

export const tipClasses = 'hidden text-xs text-slate-500 sm:block'

interface BodyProps {
  item: PlannedQuestion
  /**
   * Original indexes of the picked options. For multiple-answer questions this
   * is the draft selection until `submitted` is true.
   */
  selected: ReadonlyArray<number>
  /** True once the answer is locked and feedback is shown. */
  submitted: boolean
  /** Exam: picks stay editable, so a single-answer pick shows as selected. */
  changeable?: boolean
  flagged: boolean
  /** Practice single answer: locks the answer. Otherwise: toggles/replaces the pick. */
  onToggle: (originalIndex: number) => void
  onFlag: () => void
}

/** Question text, flag button and options. Shared by practice and the exam. */
export function QuestionBody({
  item,
  selected,
  submitted,
  changeable = false,
  flagged,
  onToggle,
  onFlag,
}: BodyProps) {
  const { question, optionOrder } = item
  const multiple = isMultipleAnswer(question)
  const correctIndexes = getCorrectIndexes(question)
  const required = correctIndexes.length
  const selectionFull = selected.length >= required
  const hintId = useId()

  return (
    <>
      <div className="mt-6 flex items-start justify-between gap-4">
        <h2 className="text-xl font-semibold leading-snug">
          {question.question}
        </h2>
        <button
          type="button"
          aria-pressed={flagged}
          onClick={onFlag}
          // Enter is the global "check / next" hotkey; keep it from hijacking
          // this button so keyboard users can still toggle it with Enter.
          onKeyDown={(event) => {
            if (event.key === 'Enter') event.stopPropagation()
          }}
          className={`shrink-0 rounded-md border px-2.5 py-1 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 ${
            flagged
              ? 'border-amber-500 bg-amber-100 text-amber-900 dark:border-amber-500 dark:bg-amber-950 dark:text-amber-100'
              : 'border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'
          }`}
        >
          Flag for review
        </button>
      </div>

      {multiple ? (
        <p
          id={hintId}
          className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-400"
        >
          Select {required} answers.
        </p>
      ) : null}

      <div
        className="mt-5 flex flex-col gap-3"
        role={multiple ? 'group' : undefined}
        aria-describedby={multiple ? hintId : undefined}
        aria-label={multiple ? 'Answer options' : undefined}
      >
        {optionOrder.map((originalIndex, position) => {
          const chosen = selected.includes(originalIndex)
          return (
            <OptionButton
              key={originalIndex}
              state={getOptionState({
                multiple,
                answered: submitted,
                changeable,
                chosen,
                isAnswer: correctIndexes.includes(originalIndex),
                selectionFull,
              })}
              multiple={multiple}
              chosen={chosen}
              answered={submitted}
              changeable={changeable}
              letter={getOptionLetter(position)}
              text={question.options[originalIndex]}
              onClick={() => onToggle(originalIndex)}
            />
          )
        })}
      </div>
    </>
  )
}

interface Props extends Omit<BodyProps, 'changeable'> {
  index: number
  total: number
  score: number
  isLast: boolean
  /** Practice multiple answers only: submits the current selection. */
  onCheck: () => void
  onNext: () => void
}

/** One practice question with immediate feedback (the exam has its own view). */
export function QuestionCard({
  item,
  selected,
  submitted,
  index,
  total,
  score,
  isLast,
  flagged,
  onToggle,
  onCheck,
  onNext,
  onFlag,
}: Props) {
  const { question, optionOrder } = item
  const multiple = isMultipleAnswer(question)
  const required = getCorrectIndexes(question).length
  const answeredCount = index + (submitted ? 1 : 0)
  const keyTip = describeOptionKeys(optionOrder.length)
  const nextRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (submitted) nextRef.current?.focus()
  }, [submitted])

  return (
    <div>
      <ProgressHeader
        label={`Question ${index + 1} of ${total}`}
        total={total}
        score={score}
        answeredCount={answeredCount}
      />

      <QuestionBody
        item={item}
        selected={selected}
        submitted={submitted}
        flagged={flagged}
        onToggle={onToggle}
        onFlag={onFlag}
      />

      <div aria-live="polite">
        {submitted ? <Feedback question={question} chosen={selected} /> : null}
      </div>

      {submitted ? (
        <div className="mt-5 flex items-center justify-end gap-3">
          <span className="hidden text-xs text-slate-500 sm:inline">
            Press Enter
          </span>
          <button
            ref={nextRef}
            type="button"
            onClick={onNext}
            className={buttonClasses('primary')}
          >
            {isLast ? 'See results' : 'Next question'}
          </button>
        </div>
      ) : multiple ? (
        <div className="mt-5 flex items-center justify-between gap-3">
          <p className={tipClasses}>
            Tip: press {keyTip} to toggle, Enter to check.
          </p>
          <button
            type="button"
            onClick={onCheck}
            disabled={selected.length !== required}
            className={`ml-auto ${buttonClasses('primary')}`}
          >
            Check answer
          </button>
        </div>
      ) : (
        <p className={`mt-5 ${tipClasses}`}>Tip: press {keyTip} to answer.</p>
      )}
    </div>
  )
}

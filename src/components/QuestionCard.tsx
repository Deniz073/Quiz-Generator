import { useEffect, useId, useRef } from 'react'
import type { PlannedQuestion } from '#/lib/quiz-plan'
import { buttonClasses } from '#/lib/button-classes'
import { describeOptionKeys, getOptionLetter } from '#/lib/option-keys'
import { getOptionState } from '#/lib/option-state'
import { getCorrectIndexes, isMultipleAnswer } from '#/quizzes/question'
import { Feedback } from '#/components/Feedback'
import { OptionButton } from '#/components/OptionButton'
import { ProgressHeader } from '#/components/ProgressHeader'

interface Props {
  item: PlannedQuestion
  /**
   * Original indexes of the picked options. For multiple-answer questions this
   * is the draft selection until `submitted` is true.
   */
  selected: ReadonlyArray<number>
  /** True once the answer is locked and feedback is shown. */
  submitted: boolean
  index: number
  total: number
  score: number
  isLast: boolean
  /** Single answer: locks the answer. Multiple answers: toggles the option. */
  onToggle: (originalIndex: number) => void
  /** Multiple answers only: submits the current selection. */
  onCheck: () => void
  onNext: () => void
}

const tipClasses = 'hidden text-xs text-slate-500 sm:block'

export function QuestionCard({
  item,
  selected,
  submitted,
  index,
  total,
  score,
  isLast,
  onToggle,
  onCheck,
  onNext,
}: Props) {
  const { question, optionOrder } = item
  const multiple = isMultipleAnswer(question)
  const correctIndexes = getCorrectIndexes(question)
  const required = correctIndexes.length
  const selectionFull = selected.length >= required
  const answeredCount = index + (submitted ? 1 : 0)
  const keyTip = describeOptionKeys(optionOrder.length)
  const nextRef = useRef<HTMLButtonElement>(null)
  const hintId = useId()

  useEffect(() => {
    if (submitted) nextRef.current?.focus()
  }, [submitted])

  return (
    <div>
      <ProgressHeader
        index={index}
        total={total}
        score={score}
        answeredCount={answeredCount}
      />

      <h2 className="mt-6 text-xl font-semibold leading-snug">
        {question.question}
      </h2>

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
                chosen,
                isAnswer: correctIndexes.includes(originalIndex),
                selectionFull,
              })}
              multiple={multiple}
              chosen={chosen}
              answered={submitted}
              letter={getOptionLetter(position)}
              text={question.options[originalIndex]}
              onClick={() => onToggle(originalIndex)}
            />
          )
        })}
      </div>

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

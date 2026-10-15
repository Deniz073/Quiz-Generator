import { useEffect, useId, useRef } from 'react'
import type { PlannedQuestion } from '#/lib/quiz-plan'
import { buttonClasses } from '#/lib/button-classes'
import { describeOptionKeys, getOptionLetter } from '#/lib/option-keys'
import { getOptionState } from '#/lib/option-state'
import { getCorrectIndexes, isMultipleAnswer } from '#/quizzes/question'
import { Feedback } from '#/components/Feedback'
import { OptionButton } from '#/components/OptionButton'
import { ProgressHeader } from '#/components/ProgressHeader'

export const tipClasses =
  'hidden text-xs text-slate-600 dark:text-slate-400 sm:block'

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
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <h2 className="text-xl font-semibold leading-snug sm:text-2xl">
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
          className={`self-start rounded-md border px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 sm:shrink-0 ${
            flagged
              ? 'border-amber-500 bg-amber-100 text-amber-900 dark:border-amber-500 dark:bg-amber-950 dark:text-amber-100'
              : 'border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'
          }`}
        >
          {/* The flag mark makes the state visible without relying on colour. */}
          {flagged ? <span aria-hidden="true">&#9873; </span> : null}
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
  /** Questions answered so far, which can be ahead of `index` when reviewing. */
  answeredCount: number
  isLast: boolean
  /** Practice multiple answers only: submits the current selection. */
  onCheck: () => void
  onNext: () => void
  /** Undefined on the first question. */
  onPrevious: (() => void) | undefined
}

/**
 * Scrolls the element in only if part of it is outside the viewport, smoothly
 * unless the user prefers reduced motion. The element's `scroll-margin` keeps
 * it off the edge.
 */
function scrollIntoViewIfNeeded(element: HTMLElement) {
  const reduceMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches
  element.scrollIntoView({
    block: 'nearest',
    behavior: reduceMotion ? 'auto' : 'smooth',
  })
}

/** One practice question with immediate feedback (the exam has its own view). */
export function QuestionCard({
  item,
  selected,
  submitted,
  index,
  total,
  score,
  answeredCount,
  isLast,
  flagged,
  onToggle,
  onCheck,
  onNext,
  onPrevious,
  onFlag,
}: Props) {
  const { question, optionOrder } = item
  const multiple = isMultipleAnswer(question)
  const required = getCorrectIndexes(question).length
  const keyTip = describeOptionKeys(optionOrder.length)
  const nextRef = useRef<HTMLButtonElement>(null)
  const wasSubmitted = useRef(submitted)

  useEffect(() => {
    const justSubmitted = submitted && !wasSubmitted.current
    wasSubmitted.current = submitted
    const next = nextRef.current
    if (!submitted || !next) return
    if (!justSubmitted) {
      // Opened on an answered question (Previous): focus it as before, and
      // leave the scroll position to the browser.
      next.focus()
      return
    }
    // The answer was just locked in. focus() alone scrolls the bare minimum
    // (or nothing on some mobile browsers), leaving the button on or past the
    // viewport edge. Bring it, and the feedback above it, properly into view.
    next.focus({ preventScroll: true })
    scrollIntoViewIfNeeded(next)
  }, [submitted])

  // The selection just became complete: bring "Check answer" into view. Focus
  // stays where it is, so the user can still change the selection.
  const checkRef = useRef<HTMLButtonElement>(null)
  const readyToCheck = multiple && !submitted && selected.length === required
  useEffect(() => {
    if (readyToCheck && checkRef.current)
      scrollIntoViewIfNeeded(checkRef.current)
  }, [readyToCheck])

  const previousButton = onPrevious ? (
    <button
      type="button"
      onClick={onPrevious}
      className={`mr-auto ${buttonClasses('secondary')}`}
    >
      Previous
    </button>
  ) : null

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
          {previousButton}
          <span className="hidden text-xs text-slate-600 dark:text-slate-400 sm:inline">
            Press Enter
          </span>
          <button
            ref={nextRef}
            type="button"
            onClick={onNext}
            // Breathing room below the button when it is scrolled into view.
            className={`scroll-mb-6 ${buttonClasses('primary')}`}
          >
            {isLast ? 'See results' : 'Next question'}
          </button>
        </div>
      ) : multiple ? (
        <div className="mt-5 flex items-center justify-between gap-3">
          {previousButton}
          <p className={tipClasses}>
            Tip: press {keyTip} to toggle, Enter to check.
          </p>
          <button
            ref={checkRef}
            type="button"
            onClick={onCheck}
            disabled={selected.length !== required}
            className={`ml-auto scroll-mb-6 ${buttonClasses('primary')}`}
          >
            Check answer
          </button>
        </div>
      ) : (
        <div className="mt-5 flex items-center justify-between gap-3">
          {previousButton}
          <p className={tipClasses}>Tip: press {keyTip} to answer.</p>
        </div>
      )}
    </div>
  )
}

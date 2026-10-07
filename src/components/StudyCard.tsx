import { getOptionLetter } from '#/lib/option-keys'
import { getCorrectIndexes, isMultipleAnswer } from '#/quizzes/question'
import type { Question } from '#/quizzes/types'

const optionBase = 'flex items-start gap-3 rounded-lg border px-4 py-3'

const OPTION_CLASSES = {
  neutral: 'border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900',
  correct:
    'border-emerald-500 bg-emerald-50 text-emerald-900 dark:border-emerald-500 dark:bg-emerald-950 dark:text-emerald-100',
  dim: 'border-slate-200 bg-white text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-500',
}

interface Props {
  question: Question
  /** True once the answer and explanation are shown. */
  revealed: boolean
}

/** One flashcard: options stay in their original order, nothing is clickable. */
export function StudyCard({ question, revealed }: Props) {
  const multiple = isMultipleAnswer(question)
  const correctIndexes = getCorrectIndexes(question)
  // Options are not shuffled, so the original index is the displayed position.
  const answerLetters = correctIndexes.map(getOptionLetter).join(', ')

  return (
    <div>
      <h2 className="text-xl font-semibold leading-snug">
        {question.question}
      </h2>

      {multiple ? (
        <p className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-400">
          Select {correctIndexes.length} answers.
        </p>
      ) : null}

      <ol className="mt-5 flex flex-col gap-3">
        {question.options.map((option, index) => {
          const state = !revealed
            ? 'neutral'
            : correctIndexes.includes(index)
              ? 'correct'
              : 'dim'
          return (
            <li
              key={index}
              className={`${optionBase} ${OPTION_CLASSES[state]}`}
            >
              <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded border border-current text-xs font-semibold">
                {getOptionLetter(index)}
              </span>
              <span className="flex-1">{option}</span>
              {state === 'correct' ? (
                <>
                  <span className="sr-only">(correct answer)</span>
                  <span aria-hidden="true">&#10003;</span>
                </>
              ) : null}
            </li>
          )
        })}
      </ol>

      {/* Stays mounted so screen readers announce the answer when it appears. */}
      <div aria-live="polite">
        {revealed ? (
          <div className="mt-5 rounded-lg border border-emerald-300 bg-emerald-50 px-4 py-3 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-100">
            <p className="font-semibold">
              {correctIndexes.length === 1
                ? 'Correct answer'
                : 'Correct answers'}
              : {answerLetters}
            </p>
            <p className="mt-1 text-sm">{question.explanation}</p>
          </div>
        ) : null}
      </div>
    </div>
  )
}

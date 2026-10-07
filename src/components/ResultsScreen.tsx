import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import type { Answer } from '#/lib/quiz-state'
import { buttonClasses } from '#/lib/button-classes'
import { getCorrectIndexes } from '#/quizzes/question'
import { FilterButton } from '#/components/FilterButton'

type ReviewFilter = 'incorrect' | 'all' | 'flagged'

interface Props {
  quizId: string
  answers: ReadonlyArray<Answer>
  score: number
  /** Label of the button that starts a fresh full round, e.g. "Retry chapter". */
  retryLabel: string
  /** Exam only: pass mark in percent. Shows a PASSED / FAILED verdict. */
  passPercent?: number
  nextChapterId?: string
  onRetry: () => void
  /** Starts a practice round with only the questions answered wrong. */
  onRetryIncorrect: () => void
}

export function ResultsScreen({
  quizId,
  answers,
  score,
  retryLabel,
  passPercent,
  nextChapterId,
  onRetry,
  onRetryIncorrect,
}: Props) {
  const total = answers.length
  const wrong = answers.filter((answer) => !answer.correct)
  const [filter, setFilter] = useState<ReviewFilter>('incorrect')
  const flaggedAnswers = answers.filter((answer) => answer.flagged)
  const shown =
    filter === 'all' ? answers : filter === 'flagged' ? flaggedAnswers : wrong
  const percent = total === 0 ? 0 : Math.round((score / total) * 100)
  const passed = passPercent !== undefined && score * 100 >= passPercent * total

  return (
    <div>
      <div className="rounded-xl border border-slate-200 bg-white p-6 text-center dark:border-slate-800 dark:bg-slate-900">
        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
          Your result
        </p>
        <p className="mt-1 text-4xl font-bold">
          {score} / {total}
        </p>
        <p className="mt-1 text-lg text-slate-600 dark:text-slate-400">
          {percent}%
        </p>
        {passPercent !== undefined ? (
          <p
            className={`mt-3 text-xl font-bold tracking-wide ${
              passed
                ? 'text-emerald-700 dark:text-emerald-400'
                : 'text-red-700 dark:text-red-400'
            }`}
          >
            {passed ? 'PASSED' : 'FAILED'}
            <span className="ml-2 text-sm font-medium text-slate-600 dark:text-slate-400">
              Pass mark {passPercent}%
            </span>
          </p>
        ) : null}
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onRetry}
          className={buttonClasses('primary')}
        >
          {retryLabel}
        </button>
        {wrong.length > 0 ? (
          <button
            type="button"
            onClick={onRetryIncorrect}
            className={buttonClasses('secondary')}
          >
            Retry incorrect ({wrong.length})
          </button>
        ) : null}
        {nextChapterId ? (
          <Link
            to="/quiz/$quizId/$chapterId"
            params={{ quizId, chapterId: nextChapterId }}
            className={buttonClasses('secondary')}
          >
            Next chapter
          </Link>
        ) : null}
        <Link
          to="/quiz/$quizId"
          params={{ quizId }}
          className={buttonClasses('secondary')}
        >
          Back to chapters
        </Link>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">Review</h2>
        <div
          role="group"
          aria-label="Questions to review"
          className="inline-flex rounded-lg border border-slate-300 p-0.5 text-sm dark:border-slate-700"
        >
          <FilterButton
            active={filter === 'incorrect'}
            onClick={() => setFilter('incorrect')}
          >
            Incorrect ({wrong.length})
          </FilterButton>
          <FilterButton
            active={filter === 'all'}
            onClick={() => setFilter('all')}
          >
            All ({total})
          </FilterButton>
          {flaggedAnswers.length > 0 ? (
            <FilterButton
              active={filter === 'flagged'}
              onClick={() => setFilter('flagged')}
            >
              Flagged ({flaggedAnswers.length})
            </FilterButton>
          ) : null}
        </div>
      </div>
      {shown.length === 0 ? (
        <p className="mt-3 text-slate-600 dark:text-slate-400">
          Perfect score, nothing to review.
        </p>
      ) : null}
      <ol className="mt-3 flex flex-col gap-4">
        {shown.map(
          ({ index, item, chosen, correct: answeredCorrectly, flagged }) => {
            const { question, chapter } = item
            const correct = getCorrectIndexes(question)
            const chosenSorted = [...chosen].sort((x, y) => x - y)
            const showStatus = filter !== 'incorrect'
            return (
              <li
                key={index}
                className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
              >
                {showStatus || flagged || chapter ? (
                  <div className="mb-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                    {showStatus ? (
                      <span
                        className={`font-semibold tracking-wide uppercase ${
                          answeredCorrectly
                            ? 'text-emerald-700 dark:text-emerald-400'
                            : 'text-red-700 dark:text-red-400'
                        }`}
                      >
                        {answeredCorrectly ? 'Correct' : 'Incorrect'}
                      </span>
                    ) : null}
                    {flagged ? (
                      <span className="font-semibold tracking-wide text-amber-700 uppercase dark:text-amber-400">
                        Flagged
                      </span>
                    ) : null}
                    {chapter ? (
                      <span className="text-slate-500">
                        Chapter {chapter.number}: {chapter.title}
                      </span>
                    ) : null}
                  </div>
                ) : null}
                <p className="font-medium">{question.question}</p>
                {answeredCorrectly ? null : (
                  <AnswerList
                    label={
                      chosenSorted.length > 1 ? 'Your answers' : 'Your answer'
                    }
                    labelClass="text-red-700 dark:text-red-400"
                    texts={
                      chosenSorted.length === 0
                        ? ['(not answered)']
                        : chosenSorted.map((i) => question.options[i])
                    }
                  />
                )}
                <AnswerList
                  label={
                    correct.length > 1 ? 'Correct answers' : 'Correct answer'
                  }
                  labelClass="text-emerald-700 dark:text-emerald-400"
                  texts={correct.map((i) => question.options[i])}
                />
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  {question.explanation}
                </p>
              </li>
            )
          },
        )}
      </ol>
    </div>
  )
}

function AnswerList({
  label,
  labelClass,
  texts,
}: {
  label: string
  labelClass: string
  texts: Array<string>
}) {
  return (
    <div className="mt-2 text-sm first-of-type:mt-3">
      <span className={`font-semibold ${labelClass}`}>{label}:</span>
      {texts.length === 1 ? (
        <span> {texts[0]}</span>
      ) : (
        <ul className="mt-1 list-disc pl-5">
          {texts.map((text) => (
            <li key={text}>{text}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

import { Link } from '@tanstack/react-router'
import type { Answer } from '#/lib/quiz-state'
import { buttonClasses } from '#/lib/button-classes'
import { getCorrectIndexes } from '#/quizzes/question'

interface Props {
  quizId: string
  answers: ReadonlyArray<Answer>
  score: number
  nextChapterId: string | undefined
  onRetry: () => void
}

export function ResultsScreen({
  quizId,
  answers,
  score,
  nextChapterId,
  onRetry,
}: Props) {
  const total = answers.length
  const wrong = answers.filter((answer) => !answer.correct)
  const percent = total === 0 ? 0 : Math.round((score / total) * 100)

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
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onRetry}
          className={buttonClasses('primary')}
        >
          Retry chapter
        </button>
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

      <h2 className="mt-8 text-lg font-semibold">
        {wrong.length === 0
          ? 'Perfect score, nothing to review.'
          : `Review incorrect answers (${wrong.length})`}
      </h2>
      <ol className="mt-3 flex flex-col gap-4">
        {wrong.map(({ item, chosen }) => {
          const { question } = item
          const correct = getCorrectIndexes(question)
          const chosenSorted = [...chosen].sort((x, y) => x - y)
          return (
            <li
              key={question.question}
              className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
            >
              <p className="font-medium">{question.question}</p>
              <AnswerList
                label={chosenSorted.length > 1 ? 'Your answers' : 'Your answer'}
                labelClass="text-red-700 dark:text-red-400"
                texts={chosenSorted.map((i) => question.options[i])}
              />
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
        })}
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

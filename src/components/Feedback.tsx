import type { Question } from '#/quizzes/types'
import {
  getCorrectIndexes,
  isAnswerCorrect,
  isMultipleAnswer,
} from '#/quizzes/question'

interface Props {
  question: Question
  /** Original indexes of the submitted picks. */
  chosen: ReadonlyArray<number>
}

export function Feedback({ question, chosen }: Props) {
  const isCorrect = isAnswerCorrect(question, chosen)
  const correctIndexes = getCorrectIndexes(question)
  const correctCount = chosen.filter((i) => correctIndexes.includes(i)).length

  return (
    <div className="mt-5 rounded-lg border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
      <p
        className={`font-semibold ${
          isCorrect
            ? 'text-emerald-700 dark:text-emerald-400'
            : 'text-red-700 dark:text-red-400'
        }`}
      >
        {isCorrect ? 'Correct!' : 'Incorrect'}
        {isMultipleAnswer(question) && !isCorrect ? (
          <span className="ml-2 text-sm font-normal text-slate-600 dark:text-slate-400">
            ({correctCount} of {correctIndexes.length} correct)
          </span>
        ) : null}
      </p>
      <p className="mt-1">{question.explanation}</p>
    </div>
  )
}

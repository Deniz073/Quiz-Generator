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
    <div
      className={`mt-5 rounded-lg border px-4 py-3 ${
        isCorrect
          ? 'border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-100'
          : 'border-red-300 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950 dark:text-red-100'
      }`}
    >
      <p className="font-semibold">
        {isCorrect ? 'Correct!' : 'Incorrect'}
        {isMultipleAnswer(question) && !isCorrect ? (
          <span className="ml-2 text-sm font-normal">
            ({correctCount} of {correctIndexes.length} correct)
          </span>
        ) : null}
      </p>
      <p className="mt-1 text-sm">{question.explanation}</p>
    </div>
  )
}

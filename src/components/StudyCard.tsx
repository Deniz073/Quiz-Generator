import { CheckIcon } from 'lucide-react'
import { Separator } from '#/components/ui/separator'
import { cn } from '#/lib/utils'
import { getOptionLetter } from '#/lib/option-keys'
import { getCorrectIndexes, isMultipleAnswer } from '#/quizzes/question'
import type { Question } from '#/quizzes/types'

interface Props {
  question: Question
  /** True once the answer and explanation are shown. */
  revealed: boolean
}

const COUNT_WORDS = ['', 'One', 'Two', 'Three', 'Four', 'Five']

/**
 * One flashcard: the question first, the options as plain rows in their
 * original order (nothing is clickable), and once revealed the correct ones
 * marked and the explanation below.
 */
export function StudyCard({ question, revealed }: Props) {
  const correctIndexes = getCorrectIndexes(question)
  // Options are not shuffled, so the original index is the displayed position.
  const answerLetters = correctIndexes.map(getOptionLetter)
  const count = correctIndexes.length

  return (
    <div>
      <h2 className="max-w-[65ch] text-xl leading-snug font-semibold text-balance sm:text-2xl">
        {question.question}
      </h2>
      {isMultipleAnswer(question) ? (
        <p className="mt-2 text-sm text-muted-foreground">
          {COUNT_WORDS[count] ?? count} answers are correct.
        </p>
      ) : null}

      <ol className="mt-6 flex flex-col gap-1">
        {question.options.map((option, index) => {
          const correct = revealed && correctIndexes.includes(index)
          return (
            <li
              key={index}
              className={cn(
                'flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors',
                correct && 'bg-success/10',
                revealed && !correct && 'text-muted-foreground',
              )}
            >
              <span
                className={cn(
                  'w-4 shrink-0 text-sm leading-6 font-semibold text-muted-foreground',
                  correct && 'text-success',
                )}
              >
                {getOptionLetter(index)}
              </span>
              <span className="min-w-0 flex-1 leading-6 break-words">
                {option}
              </span>
              {correct ? (
                <>
                  <span className="sr-only">(correct answer)</span>
                  <CheckIcon
                    aria-hidden="true"
                    className="mt-1 size-4 shrink-0 text-success"
                  />
                </>
              ) : null}
            </li>
          )
        })}
      </ol>

      {/* Stays mounted so screen readers announce the answer when it appears. */}
      <div aria-live="polite">
        {revealed ? (
          <>
            <Separator className="my-5" />
            <p className="max-w-[65ch] leading-relaxed">
              <span className="font-semibold text-success">
                {formatLetters(answerLetters)}.
              </span>{' '}
              {question.explanation}
            </p>
          </>
        ) : null}
      </div>
    </div>
  )
}

/** "B", "B and D", "A, C and D". */
function formatLetters(letters: Array<string>): string {
  if (letters.length <= 1) return letters.join('')
  return `${letters.slice(0, -1).join(', ')} and ${letters.at(-1)}`
}

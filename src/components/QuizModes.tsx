import { useState } from 'react'
import type { ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
import { SlidersHorizontalIcon } from 'lucide-react'
import { ExamSettings } from '#/components/ExamSettings'
import { Button } from '#/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '#/components/ui/collapsible'
import { describeExamConfig } from '#/domain/exam-settings'
import type { Result } from '#/domain/progress'
import { formatResult } from '#/domain/progress'
import { FLAGGING_HINT } from '#/lib/flags'
import { PRACTICE_SIZES } from '#/lib/quiz-plan'
import { useExamConfig, useSignedIn } from '#/lib/user-data'
import type { ExamConfig, Quiz } from '#/quizzes/types'
import { countQuestions } from '#/quizzes'

/*
 * The ways to use the whole quiz (rather than one chapter), from low stakes
 * to high: study, mixed practice, flagged questions, the mock exam. One list
 * of rows, each saying what it is on the left and offering its actions on
 * the right; only the mock exam's start is a primary button.
 */

export function QuizModes({
  quiz,
  flaggedCount,
  examResult,
}: {
  quiz: Quiz
  /** Flagged questions in the whole quiz (0 until loaded, and for visitors). */
  flaggedCount: number
  examResult: Result | undefined
}) {
  const total = countQuestions(quiz)
  const practiceSizes = PRACTICE_SIZES.filter((size) => size < total)

  return (
    <section className="mt-10" aria-labelledby="whole-quiz">
      <h2 id="whole-quiz" className="text-lg font-semibold">
        Whole quiz
      </h2>
      <ul className="mt-3 divide-y rounded-lg border bg-card">
        <Mode
          title="Study"
          description="Flip through every question with its answer and explanation. Not scored."
        >
          <Button
            variant="outline"
            nativeButton={false}
            render={
              <Link to="/quiz/$quizId/study" params={{ quizId: quiz.id }} />
            }
          >
            Study all
          </Button>
        </Mode>

        <Mode
          title="Mixed practice"
          description="Random questions from all chapters, with feedback after each. Pick how many. Not saved."
        >
          {practiceSizes.map((size) => (
            <Button
              key={size}
              aria-label={`Practice ${size} questions`}
              variant="outline"
              nativeButton={false}
              render={
                <Link
                  to="/quiz/$quizId/practice"
                  params={{ quizId: quiz.id }}
                  search={{ count: size }}
                />
              }
            >
              {size}
            </Button>
          ))}
          <Button
            aria-label={`Practice all ${total} questions`}
            variant="outline"
            nativeButton={false}
            render={
              <Link
                to="/quiz/$quizId/practice"
                params={{ quizId: quiz.id }}
                search={{ count: 'all' }}
              />
            }
          >
            All {total}
          </Button>
        </Mode>

        <Mode
          title={
            flaggedCount > 0
              ? `Flagged questions (${flaggedCount})`
              : 'Flagged questions'
          }
          description={
            flaggedCount > 0
              ? 'The questions you flagged, from all chapters. Not saved.'
              : FLAGGING_HINT
          }
        >
          {flaggedCount > 0 ? (
            <>
              <Button
                variant="outline"
                nativeButton={false}
                render={
                  <Link
                    to="/quiz/$quizId/flagged"
                    params={{ quizId: quiz.id }}
                  />
                }
              >
                Practice
              </Button>
              <Button
                variant="outline"
                nativeButton={false}
                render={
                  <Link
                    to="/quiz/$quizId/flagged/review"
                    params={{ quizId: quiz.id }}
                  />
                }
              >
                Review
              </Button>
            </>
          ) : null}
        </Mode>

        {quiz.exam ? (
          <MockExamMode quiz={quiz} defaults={quiz.exam} result={examResult} />
        ) : null}
      </ul>
    </section>
  )
}

/** One row: what it is on the left, its actions on the right. */
function Mode({
  title,
  description,
  children,
}: {
  title: string
  description: ReactNode
  children?: ReactNode
}) {
  return (
    <li className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
      <ModeText title={title} description={description} />
      {children ? (
        <div className="flex shrink-0 flex-wrap gap-2">{children}</div>
      ) : null}
    </li>
  )
}

function ModeText({
  title,
  description,
}: {
  title: string
  description: ReactNode
}) {
  return (
    <div className="min-w-0">
      <h3 className="font-medium">{title}</h3>
      <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
    </div>
  )
}

/** The mock exam, with the user's own settings folded out below it. */
function MockExamMode({
  quiz,
  defaults,
  result,
}: {
  quiz: Quiz
  defaults: ExamConfig
  result: Result | undefined
}) {
  // Defaults on the server and during hydration, then the user's own settings.
  const config = useExamConfig(quiz, defaults)
  const signedIn = useSignedIn()
  const [open, setOpen] = useState(false)

  return (
    <li className="p-4">
      <Collapsible open={open} onOpenChange={setOpen}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <ModeText
            title="Mock exam"
            description={
              <>
                {describeExamConfig(config)}.
                {result ? (
                  <span className="block">{formatResult(result)}</span>
                ) : null}
                {signedIn ? null : (
                  <span className="block">
                    Sign in to change the questions, time and pass mark.
                  </span>
                )}
              </>
            }
          />
          <div className="flex shrink-0 flex-wrap gap-2">
            {signedIn ? (
              <CollapsibleTrigger render={<Button variant="ghost" />}>
                <SlidersHorizontalIcon data-icon="inline-start" />
                Settings
              </CollapsibleTrigger>
            ) : null}
            <Button
              nativeButton={false}
              render={
                <Link to="/quiz/$quizId/exam" params={{ quizId: quiz.id }} />
              }
            >
              Start mock exam
            </Button>
          </div>
        </div>
        {signedIn ? (
          <CollapsibleContent className="mt-4 border-t pt-4">
            <ExamSettings quiz={quiz} defaults={defaults} config={config} />
          </CollapsibleContent>
        ) : null}
      </Collapsible>
    </li>
  )
}

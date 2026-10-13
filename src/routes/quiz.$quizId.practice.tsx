import { createFileRoute } from '@tanstack/react-router'
import { NotFound } from '#/components/NotFound'
import { QuizPageHeader } from '#/components/QuizPageHeader'
import { QuizRunner } from '#/components/QuizRunner'
import { buildQuizPlan } from '#/lib/quiz-plan'
import { requireQuiz } from '#/lib/quiz-route'

// Numbers, not '20': the router parses search values as JSON, so `?count=20`
// arrives as a number and stays a clean URL.
export type PracticeCount = 20 | 50 | 'all'

const PRACTICE_COUNTS: ReadonlyArray<unknown> = [20, 50, 'all']

export const Route = createFileRoute('/quiz/$quizId/practice')({
  // Invalid or missing values fall back to all questions.
  validateSearch: (
    search: Record<string, unknown>,
  ): { count: PracticeCount } => {
    const { count } = search
    return {
      count: PRACTICE_COUNTS.includes(count) ? (count as PracticeCount) : 'all',
    }
  },
  // Random question draw and shuffling: client-only component, see the
  // chapter route. The loader still runs on the server for a real 404.
  ssr: 'data-only',
  loader: ({ params }) => {
    requireQuiz(params.quizId)
  },
  component: PracticePage,
  notFoundComponent: () => <NotFound message="Quiz not found." />,
})

function PracticePage() {
  const { quizId } = Route.useParams()
  const { count } = Route.useSearch()
  const quiz = requireQuiz(quizId)

  const limit = count === 'all' ? undefined : count

  return (
    <div>
      <QuizPageHeader quiz={quiz} title="Mixed practice" />
      {/* key resets runner state when the size changes. Not recorded in progress. */}
      <QuizRunner
        key={count}
        quizId={quizId}
        mode="practice"
        buildPlan={() => buildQuizPlan(quiz, limit)}
      />
    </div>
  )
}

import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { NotFound } from '#/components/NotFound'
import { QuizRunner } from '#/components/QuizRunner'
import { buildQuizPlan } from '#/lib/quiz-plan'
import { getQuiz } from '#/quizzes'

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
    if (!getQuiz(params.quizId)) throw notFound()
  },
  component: PracticePage,
  notFoundComponent: () => <NotFound message="Quiz not found." />,
})

function PracticePage() {
  const { quizId } = Route.useParams()
  const { count } = Route.useSearch()
  const quiz = getQuiz(quizId)
  if (!quiz) return null

  const limit = count === 'all' ? undefined : count

  return (
    <div>
      <Link
        to="/quiz/$quizId"
        params={{ quizId }}
        className="text-sm text-sky-700 hover:underline dark:text-sky-400"
      >
        &larr; {quiz.title}
      </Link>
      <h1 className="mt-3 mb-6 text-2xl font-bold">Mixed practice</h1>
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

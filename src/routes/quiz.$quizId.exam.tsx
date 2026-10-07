import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { NotFound } from '#/components/NotFound'
import { QuizRunner } from '#/components/QuizRunner'
import { buildQuizPlan } from '#/lib/quiz-plan'
import { recordResult } from '#/lib/progress'
import { getQuiz } from '#/quizzes'

export const Route = createFileRoute('/quiz/$quizId/exam')({
  // Random question draw and shuffling: client-only component, see the
  // chapter route. The loader still runs on the server, so unknown quizzes and
  // quizzes without exam settings get a real 404.
  ssr: 'data-only',
  loader: ({ params }) => {
    if (!getQuiz(params.quizId)?.exam) throw notFound()
  },
  component: ExamPage,
  notFoundComponent: () => <NotFound message="Mock exam not found." />,
})

function ExamPage() {
  const { quizId } = Route.useParams()
  const quiz = getQuiz(quizId)
  const exam = quiz?.exam
  if (!quiz || !exam) return null

  return (
    <div>
      <Link
        to="/quiz/$quizId"
        params={{ quizId }}
        className="text-sm text-sky-700 hover:underline dark:text-sky-400"
      >
        &larr; {quiz.title}
      </Link>
      <h1 className="mt-3 mb-6 text-2xl font-bold">Mock exam</h1>
      <QuizRunner
        quizId={quizId}
        mode="exam"
        minutes={exam.minutes}
        passPercent={exam.passPercent}
        buildPlan={() => buildQuizPlan(quiz, exam.questionCount)}
        onFinish={(score, total) =>
          recordResult(quizId, { exam: true }, score, total)
        }
      />
    </div>
  )
}

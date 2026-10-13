import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { ExamRunner } from '#/components/ExamRunner'
import { NotFound } from '#/components/NotFound'
import { backLinkClasses } from '#/lib/button-classes'
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
      <Link to="/quiz/$quizId" params={{ quizId }} className={backLinkClasses}>
        &larr; {quiz.title}
      </Link>
      <h1 className="mt-3 mb-6 text-2xl font-bold">Mock exam</h1>
      <ExamRunner quiz={quiz} exam={exam} />
    </div>
  )
}

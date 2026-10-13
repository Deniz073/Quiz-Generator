import { createFileRoute } from '@tanstack/react-router'
import { ExamRunner } from '#/components/ExamRunner'
import { NotFound } from '#/components/NotFound'
import { QuizPageHeader } from '#/components/QuizPageHeader'
import { requireExam } from '#/lib/quiz-route'

export const Route = createFileRoute('/quiz/$quizId/exam')({
  // Random question draw and shuffling: client-only component, see the
  // chapter route. The loader still runs on the server, so unknown quizzes and
  // quizzes without exam settings get a real 404.
  ssr: 'data-only',
  loader: ({ params }) => {
    requireExam(params.quizId)
  },
  component: ExamPage,
  notFoundComponent: () => <NotFound message="Mock exam not found." />,
})

function ExamPage() {
  const { quizId } = Route.useParams()
  const { quiz, exam } = requireExam(quizId)

  return (
    <div>
      <QuizPageHeader quiz={quiz} title="Mock exam" />
      <ExamRunner quiz={quiz} exam={exam} />
    </div>
  )
}

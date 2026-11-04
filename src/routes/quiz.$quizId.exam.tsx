import { createFileRoute } from '@tanstack/react-router'
import { ExamRunner } from '#/components/ExamRunner'
import { NotFound } from '#/components/NotFound'
import { QuizPageHeader } from '#/components/QuizPageHeader'
import { pageTitle } from '#/lib/page-title'
import { fetchExamStart } from '#/lib/exam-api'
import { requireExam } from '#/lib/quiz-route'

export const Route = createFileRoute('/quiz/$quizId/exam')({
  // Random question draw and shuffling: client-only component, see the
  // chapter route. The loader still runs on the server, so unknown quizzes and
  // quizzes without exam settings get a real 404.
  ssr: 'data-only',
  loader: async ({ params }) => {
    const [found, start] = await Promise.all([
      requireExam(params.quizId),
      fetchExamStart({ data: { quizId: params.quizId } }),
    ])
    return { ...found, start }
  },
  // Always fresh, loaded when the page opens: the exam is built once from
  // this data (useExam), so it must reflect the settings and the unfinished
  // exam as they are now (saved a moment ago, or changed in another tab).
  // No hover preload (its result would be reused), nothing kept afterwards.
  preload: false,
  gcTime: 0,
  shouldReload: true,
  head: ({ loaderData }) => ({
    meta: [{ title: pageTitle('Mock exam', loaderData?.quiz.title) }],
  }),
  component: ExamPage,
  notFoundComponent: () => <NotFound message="Mock exam not found." />,
})

function ExamPage() {
  const { quiz, exam, start } = Route.useLoaderData()

  return (
    <div>
      <QuizPageHeader quiz={quiz} title="Mock exam" />
      <ExamRunner quiz={quiz} exam={exam} start={start} />
    </div>
  )
}

import { createFileRoute } from '@tanstack/react-router'
import { NotFound } from '#/components/NotFound'
import { QuizPageHeader } from '#/components/QuizPageHeader'
import { StudySession } from '#/components/StudySession'
import { pageTitle } from '#/lib/page-title'
import { requireQuiz } from '#/lib/quiz-route'
import { validateStudySearch } from '#/lib/study-search'

export const Route = createFileRoute('/quiz/$quizId/study')({
  validateSearch: validateStudySearch,
  // Shuffling uses Math.random, which can't match between server and client, so
  // the component renders on the client only, see the chapter route. The loader
  // still runs on the server, so unknown ids get a real 404.
  ssr: 'data-only',
  loader: ({ params }) => requireQuiz(params.quizId),
  head: ({ loaderData }) => ({
    meta: [{ title: pageTitle('Study', loaderData?.title) }],
  }),
  component: StudyPage,
  notFoundComponent: () => <NotFound message="Quiz not found." />,
})

function StudyPage() {
  const quiz = Route.useLoaderData()
  const search = Route.useSearch()
  const navigate = Route.useNavigate()
  return (
    <div>
      <QuizPageHeader
        quiz={quiz}
        title="Study"
        className="mb-4"
        signInBanner={false}
      />
      <StudySession
        quiz={quiz}
        search={search}
        onSearchChange={(next) =>
          void navigate({ search: (prev) => ({ ...prev, ...next }) })
        }
      />
    </div>
  )
}

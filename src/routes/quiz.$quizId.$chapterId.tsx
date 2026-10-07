import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { NotFound } from '#/components/NotFound'
import { QuizRunner } from '#/components/QuizRunner'
import { getChapter, getQuiz } from '#/quizzes'

export const Route = createFileRoute('/quiz/$quizId/$chapterId')({
  // The runner shuffles questions with Math.random, which can't match between
  // server and client, so the component renders on the client only. The loader
  // still runs on the server, so unknown ids get a real 404.
  ssr: 'data-only',
  loader: ({ params }) => {
    if (!getChapter(params.quizId, params.chapterId)) throw notFound()
  },
  component: ChapterPage,
  notFoundComponent: () => <NotFound message="Chapter not found." />,
})

function ChapterPage() {
  const { quizId, chapterId } = Route.useParams()
  const quiz = getQuiz(quizId)
  const chapter = getChapter(quizId, chapterId)
  if (!quiz || !chapter) return null

  const index = quiz.chapters.findIndex((c) => c.id === chapter.id)
  const nextChapter = quiz.chapters
    .slice(index + 1)
    .find((c) => c.questions.length > 0)

  return (
    <div>
      <Link
        to="/quiz/$quizId"
        params={{ quizId }}
        className="text-sm text-sky-700 hover:underline dark:text-sky-400"
      >
        &larr; {quiz.title}
      </Link>
      <h1 className="mt-3 mb-6 text-2xl font-bold">
        Chapter {chapter.number} &mdash; {chapter.title}
      </h1>
      {/* key resets runner state when navigating to another chapter */}
      <QuizRunner
        key={chapter.id}
        quizId={quizId}
        chapter={chapter}
        nextChapterId={nextChapter?.id}
      />
    </div>
  )
}

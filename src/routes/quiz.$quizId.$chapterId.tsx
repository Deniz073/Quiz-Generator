import { createFileRoute } from '@tanstack/react-router'
import { NotFound } from '#/components/NotFound'
import { QuizPageHeader } from '#/components/QuizPageHeader'
import { QuizRunner } from '#/components/QuizRunner'
import { formatChapter } from '#/lib/chapter-label'
import { pageTitle } from '#/lib/page-title'
import { buildShuffledPlan } from '#/lib/quiz-plan'
import { requireChapter } from '#/lib/quiz-route'

export const Route = createFileRoute('/quiz/$quizId/$chapterId')({
  // The runner shuffles questions with Math.random, which can't match between
  // server and client, so the component renders on the client only. The loader
  // still runs on the server, so unknown ids get a real 404.
  ssr: 'data-only',
  loader: ({ params }) => requireChapter(params.quizId, params.chapterId),
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData
          ? pageTitle(formatChapter(loaderData.chapter), loaderData.quiz.title)
          : pageTitle(),
      },
    ],
  }),
  component: ChapterPage,
  notFoundComponent: () => <NotFound message="Chapter not found." />,
})

function ChapterPage() {
  const { quiz, chapter } = Route.useLoaderData()

  const index = quiz.chapters.findIndex((c) => c.id === chapter.id)
  const nextChapter = quiz.chapters
    .slice(index + 1)
    .find((c) => c.questions.length > 0)

  return (
    <div>
      <QuizPageHeader quiz={quiz} title={formatChapter(chapter)} />
      {/* key resets runner state when navigating to another chapter */}
      <QuizRunner
        key={chapter.id}
        quizId={quiz.id}
        mode="chapter"
        buildPlan={() => buildShuffledPlan(chapter.questions)}
        nextChapterId={nextChapter?.id}
        record={{ chapterId: chapter.id }}
      />
    </div>
  )
}

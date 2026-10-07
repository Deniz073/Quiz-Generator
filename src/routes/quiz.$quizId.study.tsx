import { useState } from 'react'
import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { NotFound } from '#/components/NotFound'
import { StudyControls } from '#/components/StudyControls'
import { StudyDeck } from '#/components/StudyDeck'
import { getQuiz } from '#/quizzes'

export const Route = createFileRoute('/quiz/$quizId/study')({
  // Invalid or missing values fall back to all chapters, in order. Booleans
  // arrive typed (the router parses search values as JSON), so `?shuffle=true`
  // stays a clean URL. Defaults are left out of the returned search entirely.
  validateSearch: (
    search: Record<string, unknown>,
  ): { chapter?: string; shuffle?: boolean } => {
    const { chapter, shuffle } = search
    return {
      // A numeric-looking chapter id like `1` is parsed as a number.
      chapter:
        typeof chapter === 'string' || typeof chapter === 'number'
          ? String(chapter)
          : undefined,
      shuffle: shuffle === true || shuffle === 'true' ? true : undefined,
    }
  },
  // Shuffling uses Math.random, which can't match between server and client, so
  // the component renders on the client only, see the chapter route. The loader
  // still runs on the server, so unknown ids get a real 404.
  ssr: 'data-only',
  loader: ({ params }) => {
    if (!getQuiz(params.quizId)) throw notFound()
  },
  component: StudyPage,
  notFoundComponent: () => <NotFound message="Quiz not found." />,
})

function StudyPage() {
  const { quizId } = Route.useParams()
  const { chapter, shuffle } = Route.useSearch()
  const navigate = Route.useNavigate()
  // Kept here, not in the deck, so it survives a chapter or shuffle change.
  const [showAll, setShowAll] = useState(false)
  const quiz = getQuiz(quizId)
  if (!quiz) return null

  // An unknown chapter id (e.g. a stale link) falls back to all chapters.
  const chapterId = quiz.chapters.some((c) => c.id === chapter)
    ? chapter
    : undefined
  const shuffled = shuffle === true

  return (
    <div>
      <Link
        to="/quiz/$quizId"
        params={{ quizId }}
        className="text-sm text-sky-700 hover:underline dark:text-sky-400"
      >
        &larr; {quiz.title}
      </Link>
      <h1 className="mt-3 mb-4 text-2xl font-bold">Study</h1>
      <StudyControls
        chapters={quiz.chapters}
        chapterId={chapterId}
        shuffled={shuffled}
        showAll={showAll}
        onChapterChange={(next) =>
          void navigate({ search: (prev) => ({ ...prev, chapter: next }) })
        }
        onShuffledChange={(next) =>
          // undefined drops the param, so the default stays out of the URL.
          void navigate({
            search: (prev) => ({ ...prev, shuffle: next ? true : undefined }),
          })
        }
        onShowAllChange={setShowAll}
      />
      <div className="mt-6">
        {/* key restarts at card 1 when the chapter or shuffle changes. Not recorded in progress. */}
        <StudyDeck
          key={`${chapterId ?? 'all'}:${shuffled}`}
          quiz={quiz}
          chapterId={chapterId}
          shuffled={shuffled}
          showAll={showAll}
        />
      </div>
    </div>
  )
}

import { createFileRoute } from '@tanstack/react-router'
import { NotFound } from '#/components/NotFound'
import { QuizPageHeader } from '#/components/QuizPageHeader'
import { StudyControls } from '#/components/StudyControls'
import { StudyDeck } from '#/components/StudyDeck'
import { requireQuiz } from '#/lib/quiz-route'

export const Route = createFileRoute('/quiz/$quizId/study')({
  // Invalid or missing values fall back to all chapters, in order, answers
  // hidden. Booleans arrive typed (the router parses search values as JSON), so
  // `?shuffle=true` stays a clean URL. Defaults are left out of the returned
  // search entirely.
  validateSearch: (
    search: Record<string, unknown>,
  ): { chapter?: string; shuffle?: boolean; showAnswers?: boolean } => {
    const { chapter, shuffle, showAnswers } = search
    return {
      // A numeric-looking chapter id like `1` is parsed as a number.
      chapter:
        typeof chapter === 'string' || typeof chapter === 'number'
          ? String(chapter)
          : undefined,
      shuffle: shuffle === true || shuffle === 'true' ? true : undefined,
      showAnswers:
        showAnswers === true || showAnswers === 'true' ? true : undefined,
    }
  },
  // Shuffling uses Math.random, which can't match between server and client, so
  // the component renders on the client only, see the chapter route. The loader
  // still runs on the server, so unknown ids get a real 404.
  ssr: 'data-only',
  loader: ({ params }) => requireQuiz(params.quizId),
  component: StudyPage,
  notFoundComponent: () => <NotFound message="Quiz not found." />,
})

function StudyPage() {
  const quiz = Route.useLoaderData()
  const { chapter, shuffle, showAnswers } = Route.useSearch()
  const navigate = Route.useNavigate()

  // An unknown chapter id (e.g. a stale link) falls back to all chapters.
  const chapterId = quiz.chapters.some((c) => c.id === chapter)
    ? chapter
    : undefined
  const shuffled = shuffle === true
  // In the URL, not in the deck, so it survives a chapter or shuffle change.
  const showAll = showAnswers === true

  return (
    <div>
      <QuizPageHeader quiz={quiz} title="Study" className="mb-4" />
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
        onShowAllChange={(next) =>
          void navigate({
            search: (prev) => ({
              ...prev,
              showAnswers: next ? true : undefined,
            }),
          })
        }
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

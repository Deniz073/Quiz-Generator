import { Suspense } from 'react'
import { Await, Link, createFileRoute } from '@tanstack/react-router'
import { SparklesIcon } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { NotFound } from '#/components/NotFound'
import { NotesSection } from '#/components/NotesSection'
import {
  NotesSectionSkeleton,
  QuizPageSkeleton,
} from '#/components/PageSkeleton'
import { QuizMarketplace } from '#/components/QuizMarketplace'
import { QuizModes } from '#/components/QuizModes'
import { fetchQuizStanding } from '#/lib/marketplace-api'
import { fetchQuizNotes } from '#/lib/notes-api'
import { SignInBanner } from '#/components/SignInBanner'
import { backLinkClasses } from '#/lib/button-classes'
import { getFlaggedQuestions } from '#/lib/flags'
import { formatChapter } from '#/lib/chapter-label'
import { pageTitle } from '#/lib/page-title'
import { formatResult } from '#/domain/progress'
import { forgetQuiz, requireQuizOutline } from '#/lib/quiz-route'
import { settledSoon } from '#/lib/skeleton-delay'
import { useFlags, useQuizProgress } from '#/lib/user-data'
import { countQuestions } from '#/quizzes'

const cardLinkClasses =
  'rounded-lg border border-slate-200 bg-white px-4 py-3 transition-colors hover:border-sky-500 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-sky-400'

export const Route = createFileRoute('/quiz/$quizId/')({
  loader: async ({ params, context }) => {
    // Only the quiz's outline (no question content), which may come from
    // the browser's cache; its Marketplace standing
    // (published or not) and the user's notes are always fresh. Those two
    // are not awaited for long: the quiz decides the 404 and the title, and
    // if they take a while the page shows without them and they are
    // streamed in.
    const standing = fetchQuizStanding({ data: { quizId: params.quizId } })
    const notes = context.user
      ? fetchQuizNotes({ data: { quizId: params.quizId } })
      : null
    // No standing: the quiz is gone since the browser cached it (deleted in
    // another tab). The next navigation then asks again and gets the 404.
    void standing.then(
      (found) => {
        if (!found) forgetQuiz(params.quizId)
      },
      () => {},
    )
    const [quiz] = await Promise.all([
      requireQuizOutline(params.quizId),
      settledSoon(standing, notes),
    ])
    return { quiz, standing, notes }
  },
  head: ({ loaderData }) => ({
    meta: [{ title: pageTitle(loaderData?.quiz.title) }],
  }),
  pendingComponent: QuizPageSkeleton,
  component: QuizPage,
  notFoundComponent: () => <NotFound message="Quiz not found." />,
})

function QuizPage() {
  const { quiz, standing, notes } = Route.useLoaderData()
  const { user } = Route.useRouteContext()
  // Empty on the server and during hydration, then loaded (visitors: empty).
  const progress = useQuizProgress(quiz.id)
  const flags = useFlags(quiz.id)

  const countFlagged = (chapterId?: string) =>
    flags ? getFlaggedQuestions(quiz, flags, chapterId).length : 0
  const totalFlagged = countFlagged()

  const total = countQuestions(quiz)

  return (
    <div>
      <Link to="/" className={backLinkClasses}>
        <span aria-hidden="true">&larr;</span> All quizzes
      </Link>
      <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
        <h1 className="text-3xl font-bold tracking-tight">{quiz.title}</h1>
        {user ? (
          // Its own boundary: without one, waiting here would put the whole
          // page back behind its skeleton.
          <Suspense>
            <Await promise={standing}>
              {(loaded) =>
                loaded && !loaded.builtIn ? (
                  <Button
                    variant="outline"
                    nativeButton={false}
                    render={
                      <Link
                        to="/assistant/$quizId"
                        params={{ quizId: quiz.id }}
                      />
                    }
                  >
                    <SparklesIcon data-icon="inline-start" />
                    Edit with assistant
                  </Button>
                ) : null
              }
            </Await>
          </Suspense>
        ) : null}
      </div>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        {quiz.description} {total} questions in total.
      </p>
      <SignInBanner className="mt-4" />
      <h2 className="mt-8 text-lg font-semibold">Chapters</h2>
      <ul className="mt-3 flex flex-col gap-3">
        {quiz.chapters.map((chapter) => {
          const count = chapter.questions.length
          const result = progress?.chapters[chapter.id]
          const flagged = countFlagged(chapter.id)
          return (
            <li key={chapter.id} className="flex items-stretch gap-2 sm:gap-3">
              {/* Siblings, not nested: a link inside a link is invalid HTML. */}
              <Link
                to="/quiz/$quizId/$chapterId"
                params={{ quizId: quiz.id, chapterId: chapter.id }}
                className={`flex min-w-0 flex-1 flex-col gap-0.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4 ${cardLinkClasses}`}
              >
                <span>
                  <span className="font-medium">{formatChapter(chapter)}</span>
                  {result ? (
                    <span className="mt-0.5 block text-sm text-slate-600 dark:text-slate-400">
                      {formatResult(result)}
                    </span>
                  ) : null}
                </span>
                <span className="shrink-0 text-sm text-slate-600 tabular-nums dark:text-slate-400">
                  {count}&nbsp;{count === 1 ? 'question' : 'questions'}
                </span>
              </Link>
              <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:gap-3">
                <Link
                  to="/quiz/$quizId/study"
                  params={{ quizId: quiz.id }}
                  search={{ chapter: chapter.id }}
                  aria-label={`Study chapter ${chapter.number}: ${chapter.title}`}
                  className={`flex flex-1 items-center justify-center text-sm font-medium text-slate-700 dark:text-slate-300 ${cardLinkClasses}`}
                >
                  Study
                </Link>
                {flagged > 0 ? (
                  <Link
                    to="/quiz/$quizId/flagged"
                    params={{ quizId: quiz.id }}
                    search={{ chapter: chapter.id }}
                    aria-label={`Flagged (${flagged}), practice in chapter ${chapter.number}: ${chapter.title}`}
                    className={`flex flex-1 items-center justify-center text-sm font-medium text-amber-700 dark:text-amber-400 ${cardLinkClasses}`}
                  >
                    Flagged ({flagged})
                  </Link>
                ) : null}
              </div>
            </li>
          )
        })}
      </ul>

      <QuizModes
        quiz={quiz}
        flaggedCount={totalFlagged}
        examResult={progress?.exam}
      />

      {notes ? (
        <Await promise={notes} fallback={<NotesSectionSkeleton />}>
          {(loaded) => <NotesSection quizId={quiz.id} notes={loaded} />}
        </Await>
      ) : (
        <NotesSection quizId={quiz.id} notes={null} />
      )}

      <Suspense>
        <Await promise={standing}>
          {(loaded) =>
            loaded && user ? (
              <QuizMarketplace
                quiz={quiz}
                standing={loaded}
                userName={user.name}
              />
            ) : null
          }
        </Await>
      </Suspense>
    </div>
  )
}

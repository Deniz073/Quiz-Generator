import { useState } from 'react'
import { Await, Link, createFileRoute } from '@tanstack/react-router'
import { SparklesIcon } from 'lucide-react'
import type { QuizSummary } from '#/lib/quiz-api'
import { CardListSkeleton } from '#/components/PageSkeleton'
import { SignInBanner } from '#/components/SignInBanner'
import { TitleSearch, filterByTitle } from '#/components/TitleSearch'
import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '#/components/ui/tabs'
import { formatResult } from '#/domain/progress'
import { fetchQuizSummaries } from '#/lib/quiz-api'
import { SKELETON_DELAY_MS, settledSoon } from '#/lib/skeleton-delay'

export const Route = createFileRoute('/')({
  // Not awaited for long: if the quizzes take a while, the page shows
  // without them and they are streamed in.
  loader: async () => {
    const quizzes = fetchQuizSummaries()
    await settledSoon(quizzes)
    return { quizzes }
  },
  // The loader never takes long, so only a slow first download of the page's
  // code shows the whole-page skeleton; not just ahead of the list's own.
  pendingMs: 2 * SKELETON_DELAY_MS,
  component: Home,
})

function Home() {
  const { quizzes } = Route.useLoaderData()
  const { user } = Route.useRouteContext()
  const [query, setQuery] = useState('')
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold tracking-tight">Quizzes</h1>
        {user ? (
          <Button
            nativeButton={false}
            render={<Link to="/assistant/$quizId" params={{ quizId: 'new' }} />}
          >
            <SparklesIcon data-icon="inline-start" />
            Create with assistant
          </Button>
        ) : null}
      </div>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        Pick a quiz to practice chapter by chapter.
      </p>
      <SignInBanner className="mt-4" />
      <TitleSearch
        value={query}
        onChange={setQuery}
        label="Search quizzes by name"
        className="mt-6"
      />
      <Await
        promise={quizzes}
        fallback={<CardListSkeleton label="Loading quizzes" />}
      >
        {(loaded) => <Quizzes quizzes={loaded} query={query} />}
      </Await>
    </div>
  )
}

function Quizzes({
  quizzes,
  query,
}: {
  quizzes: ReadonlyArray<QuizSummary>
  query: string
}) {
  const matches = filterByTitle(quizzes, query)
  const builtIn = matches.filter((quiz) => quiz.builtIn)
  const personal = matches.filter((quiz) => !quiz.builtIn)
  // Tabs only make sense once the user has personal quizzes at all.
  const hasPersonal = quizzes.some((quiz) => !quiz.builtIn)
  if (!hasPersonal) return <QuizList quizzes={builtIn} query={query} />
  return (
    <Tabs defaultValue="personal" className="mt-6">
      <TabsList>
        <TabsTrigger value="personal">
          My quizzes ({personal.length})
        </TabsTrigger>
        <TabsTrigger value="built-in">
          Built-in quizzes ({builtIn.length})
        </TabsTrigger>
      </TabsList>
      <TabsContent value="personal">
        <QuizList quizzes={personal} query={query} />
      </TabsContent>
      <TabsContent value="built-in">
        <QuizList quizzes={builtIn} query={query} />
      </TabsContent>
    </Tabs>
  )
}

function QuizList({
  quizzes,
  query,
}: {
  quizzes: ReadonlyArray<QuizSummary>
  query: string
}) {
  if (quizzes.length === 0) {
    return (
      <p className="mt-6 text-muted-foreground">
        {query.trim()
          ? `No quizzes match “${query.trim()}”.`
          : 'No quizzes yet.'}
      </p>
    )
  }
  return (
    <section className="mt-4">
      <ul className="flex flex-col gap-4">
        {quizzes.map((quiz) => (
          <li key={quiz.id}>
            <Link
              to="/quiz/$quizId"
              params={{ quizId: quiz.id }}
              className="block rounded-xl border border-slate-200 bg-white p-5 transition-colors hover:border-sky-500 hover:bg-sky-50/50 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-sky-400 dark:hover:bg-slate-900/60"
            >
              <h2 className="flex flex-wrap items-center gap-2 text-xl font-semibold">
                {quiz.title}
                {quiz.imported ? (
                  <Badge variant="secondary">Imported</Badge>
                ) : null}
              </h2>
              <p className="mt-1 text-slate-600 dark:text-slate-400">
                {quiz.description}
              </p>
              <p className="mt-3 text-sm text-slate-600 tabular-nums dark:text-slate-400">
                {quiz.chapterCount}&nbsp;chapters &middot; {quiz.questionCount}
                &nbsp;questions
              </p>
              {quiz.examResult ? (
                <p className="mt-1 text-sm text-slate-600 tabular-nums dark:text-slate-400">
                  Mock exam: {formatResult(quiz.examResult)}
                </p>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

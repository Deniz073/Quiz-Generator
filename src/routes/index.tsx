import { useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { Search } from 'lucide-react'
import type { QuizSummary } from '#/lib/quiz-api'
import { SignInBanner } from '#/components/SignInBanner'
import { Input } from '#/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '#/components/ui/tabs'
import { formatResult } from '#/domain/progress'
import { fetchQuizSummaries } from '#/lib/quiz-api'

export const Route = createFileRoute('/')({
  loader: () => fetchQuizSummaries(),
  component: Home,
})

function Home() {
  const quizzes = Route.useLoaderData()
  const [query, setQuery] = useState('')
  const needle = query.trim().toLowerCase()
  const matches = needle
    ? quizzes.filter((quiz) => quiz.title.toLowerCase().includes(needle))
    : quizzes
  const builtIn = matches.filter((quiz) => quiz.builtIn)
  const personal = matches.filter((quiz) => !quiz.builtIn)
  // Tabs only make sense once the user has personal quizzes at all.
  const hasPersonal = quizzes.some((quiz) => !quiz.builtIn)
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Quizzes</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        Pick a quiz to practice chapter by chapter.
      </p>
      <SignInBanner className="mt-4" />
      <div className="relative mt-6">
        <Search
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search quizzes by name"
          aria-label="Search quizzes by name"
          className="h-9 pl-8"
        />
      </div>
      {hasPersonal ? (
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
      ) : (
        <QuizList quizzes={builtIn} query={query} />
      )}
    </div>
  )
}

function QuizList({
  quizzes,
  query,
}: {
  quizzes: Array<QuizSummary>
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
              <h2 className="text-xl font-semibold">{quiz.title}</h2>
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

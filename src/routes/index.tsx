import { Link, createFileRoute } from '@tanstack/react-router'
import { DataBackup } from '#/components/DataBackup'
import { getQuizSummaries } from '#/lib/quiz-summaries'

export const Route = createFileRoute('/')({
  loader: () => getQuizSummaries(),
  component: Home,
})

function Home() {
  const quizzes = Route.useLoaderData()
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Quizzes</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        Pick a quiz to practice chapter by chapter.
      </p>
      <ul className="mt-6 flex flex-col gap-4">
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
            </Link>
          </li>
        ))}
      </ul>
      <DataBackup />
    </div>
  )
}

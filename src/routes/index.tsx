import { Link, createFileRoute } from '@tanstack/react-router'
import type { QuizSummary } from '#/lib/quiz-api'
import { SignInBanner } from '#/components/SignInBanner'
import { formatResult } from '#/domain/progress'
import { fetchQuizSummaries } from '#/lib/quiz-api'

export const Route = createFileRoute('/')({
  loader: () => fetchQuizSummaries(),
  component: Home,
})

function Home() {
  const quizzes = Route.useLoaderData()
  const builtIn = quizzes.filter((quiz) => quiz.builtIn)
  const personal = quizzes.filter((quiz) => !quiz.builtIn)
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Quizzes</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        Pick a quiz to practice chapter by chapter.
      </p>
      <SignInBanner className="mt-4" />
      {personal.length > 0 ? (
        <>
          <QuizList title="Built-in quizzes" quizzes={builtIn} />
          <QuizList title="My quizzes" quizzes={personal} />
        </>
      ) : (
        <QuizList quizzes={builtIn} />
      )}
    </div>
  )
}

function QuizList({
  title,
  quizzes,
}: {
  /** Omitted when it is the only list. */
  title?: string
  quizzes: Array<QuizSummary>
}) {
  // Card titles sit one level below the list's own heading, if any.
  const CardHeading = title ? 'h3' : 'h2'
  return (
    <section className="mt-8">
      {title ? <h2 className="text-lg font-semibold">{title}</h2> : null}
      <ul className={`flex flex-col gap-4 ${title ? 'mt-3' : ''}`}>
        {quizzes.map((quiz) => (
          <li key={quiz.id}>
            <Link
              to="/quiz/$quizId"
              params={{ quizId: quiz.id }}
              className="block rounded-xl border border-slate-200 bg-white p-5 transition-colors hover:border-sky-500 hover:bg-sky-50/50 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-sky-400 dark:hover:bg-slate-900/60"
            >
              <CardHeading className="text-xl font-semibold">
                {quiz.title}
              </CardHeading>
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

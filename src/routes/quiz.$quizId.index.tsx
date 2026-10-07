import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { NotFound } from '#/components/NotFound'
import { countQuestions, getQuiz } from '#/quizzes'

export const Route = createFileRoute('/quiz/$quizId/')({
  loader: ({ params }) => {
    if (!getQuiz(params.quizId)) throw notFound()
  },
  component: QuizPage,
  notFoundComponent: () => <NotFound message="Quiz not found." />,
})

function QuizPage() {
  const { quizId } = Route.useParams()
  const quiz = getQuiz(quizId)
  if (!quiz) return null

  return (
    <div>
      <Link
        to="/"
        className="text-sm text-sky-700 hover:underline dark:text-sky-400"
      >
        &larr; All quizzes
      </Link>
      <h1 className="mt-3 text-3xl font-bold">{quiz.title}</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        {quiz.description} {countQuestions(quiz)} questions in total.
      </p>
      <ul className="mt-6 flex flex-col gap-3">
        {quiz.chapters.map((chapter) => {
          const count = chapter.questions.length
          return (
            <li key={chapter.id}>
              <Link
                to="/quiz/$quizId/$chapterId"
                params={{ quizId: quiz.id, chapterId: chapter.id }}
                className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 bg-white px-4 py-3 transition-colors hover:border-sky-500 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-sky-400"
              >
                <span className="font-medium">
                  Chapter {chapter.number} &mdash; {chapter.title}
                </span>
                <span className="shrink-0 text-sm text-slate-500">
                  {count} {count === 1 ? 'question' : 'questions'}
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

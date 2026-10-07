import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { NotFound } from '#/components/NotFound'
import { getFlaggedQuestions } from '#/lib/flags'
import { formatResult } from '#/lib/progress'
import { useFlags } from '#/lib/use-flags'
import { useQuizProgress } from '#/lib/use-progress'
import { countQuestions, getQuiz } from '#/quizzes'

const cardLinkClasses =
  'rounded-lg border border-slate-200 bg-white px-4 py-3 transition-colors hover:border-sky-500 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-sky-400'

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
  // Empty on the server and during hydration, then filled in from localStorage.
  const progress = useQuizProgress(quizId)
  const flags = useFlags(quizId)
  if (!quiz) return null

  const countFlagged = (chapterId?: string) =>
    flags ? getFlaggedQuestions(quiz, flags, chapterId).length : 0
  const totalFlagged = countFlagged()

  const total = countQuestions(quiz)
  // Offer only sizes that actually draw fewer questions than "all".
  const practiceSizes = ([20, 50] as const).filter((size) => size < total)

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
        {quiz.description} {total} questions in total.
      </p>
      <h2 className="mt-6 text-lg font-semibold">Chapters</h2>
      <ul className="mt-3 flex flex-col gap-3">
        {quiz.chapters.map((chapter) => {
          const count = chapter.questions.length
          const result = progress?.chapters[chapter.id]
          const flagged = countFlagged(chapter.id)
          return (
            <li key={chapter.id} className="flex items-stretch gap-3">
              {/* Siblings, not nested: a link inside a link is invalid HTML. */}
              <Link
                to="/quiz/$quizId/$chapterId"
                params={{ quizId: quiz.id, chapterId: chapter.id }}
                className={`flex min-w-0 flex-1 items-center justify-between gap-4 ${cardLinkClasses}`}
              >
                <span>
                  <span className="font-medium">
                    Chapter {chapter.number} &mdash; {chapter.title}
                  </span>
                  {result ? (
                    <span className="mt-0.5 block text-sm text-slate-500">
                      {formatResult(result)}
                    </span>
                  ) : null}
                </span>
                <span className="shrink-0 text-sm text-slate-500">
                  {count} {count === 1 ? 'question' : 'questions'}
                </span>
              </Link>
              <Link
                to="/quiz/$quizId/study"
                params={{ quizId: quiz.id }}
                search={{ chapter: chapter.id }}
                aria-label={`Study chapter ${chapter.number}: ${chapter.title}`}
                className={`flex shrink-0 items-center text-sm font-medium text-slate-600 dark:text-slate-400 ${cardLinkClasses}`}
              >
                Study
              </Link>
              {flagged > 0 ? (
                <Link
                  to="/quiz/$quizId/flagged"
                  params={{ quizId: quiz.id }}
                  search={{ chapter: chapter.id }}
                  aria-label={`Practice ${flagged} flagged in chapter ${chapter.number}: ${chapter.title}`}
                  className={`flex shrink-0 items-center text-sm font-medium text-amber-700 dark:text-amber-400 ${cardLinkClasses}`}
                >
                  Flagged ({flagged})
                </Link>
              ) : null}
            </li>
          )
        })}
      </ul>

      <h2 className="mt-8 text-lg font-semibold">Mixed practice</h2>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
        Random questions from all chapters, with immediate feedback. Not saved.
      </p>
      <ul className="mt-3 flex flex-wrap gap-3">
        {practiceSizes.map((size) => (
          <li key={size}>
            <Link
              to="/quiz/$quizId/practice"
              params={{ quizId: quiz.id }}
              search={{ count: size }}
              className={`block font-medium ${cardLinkClasses}`}
            >
              {size} questions
            </Link>
          </li>
        ))}
        <li>
          <Link
            to="/quiz/$quizId/practice"
            params={{ quizId: quiz.id }}
            search={{ count: 'all' }}
            className={`block font-medium ${cardLinkClasses}`}
          >
            All {total} questions
          </Link>
        </li>
      </ul>

      <h2 className="mt-8 text-lg font-semibold">Flagged questions</h2>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
        {totalFlagged > 0
          ? 'Practice the questions you flagged, from all chapters. Not saved.'
          : 'Use \u201cFlag for review\u201d during a chapter or practice round to collect questions here.'}
      </p>
      {totalFlagged > 0 ? (
        <Link
          to="/quiz/$quizId/flagged"
          params={{ quizId: quiz.id }}
          className={`mt-3 inline-block font-medium ${cardLinkClasses}`}
        >
          Practice all {totalFlagged} flagged
        </Link>
      ) : null}

      <h2 className="mt-8 text-lg font-semibold">Study</h2>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
        Flip through questions with their answers and explanations. Not scored.
      </p>
      <Link
        to="/quiz/$quizId/study"
        params={{ quizId: quiz.id }}
        className={`mt-3 inline-block font-medium ${cardLinkClasses}`}
      >
        Study all questions
      </Link>

      {quiz.exam ? (
        <>
          <h2 className="mt-8 text-lg font-semibold">Mock exam</h2>
          <Link
            to="/quiz/$quizId/exam"
            params={{ quizId: quiz.id }}
            className={`mt-3 block ${cardLinkClasses}`}
          >
            <span className="font-medium">Start mock exam</span>
            <span className="mt-0.5 block text-sm text-slate-500">
              {quiz.exam.questionCount} questions &middot; {quiz.exam.minutes}{' '}
              minutes &middot; pass mark {quiz.exam.passPercent}%
            </span>
            {progress?.exam ? (
              <span className="mt-0.5 block text-sm text-slate-500">
                {formatResult(progress.exam)}
              </span>
            ) : null}
          </Link>
        </>
      ) : null}
    </div>
  )
}

import { Link, createFileRoute } from '@tanstack/react-router'
import { CorrectAnswers } from '#/components/AnswerList'
import { NotFound } from '#/components/NotFound'
import { QuizPageHeader } from '#/components/QuizPageHeader'
import { buttonClasses } from '#/lib/button-classes'
import { formatChapter } from '#/lib/chapter-label'
import { FLAGGING_HINT, getFlaggedQuestions } from '#/lib/flags'
import { pageTitle } from '#/lib/page-title'
import { requireQuiz } from '#/lib/quiz-route'
import { useFlags } from '#/lib/user-data'

// `flagged_` keeps this out of the flagged practice route's layout: the URL is
// /quiz/<id>/flagged/review, but that route renders on its own.
export const Route = createFileRoute('/quiz/$quizId/flagged_/review')({
  loader: ({ params }) => requireQuiz(params.quizId),
  head: ({ loaderData }) => ({
    meta: [{ title: pageTitle('Review flagged questions', loaderData?.title) }],
  }),
  component: FlaggedReviewPage,
  notFoundComponent: () => <NotFound message="Quiz not found." />,
})

function FlaggedReviewPage() {
  const quiz = Route.useLoaderData()
  const quizId = quiz.id
  // Undefined on the server and during hydration, then loaded. Nothing is
  // claimed about the flags until then.
  const flags = useFlags(quizId)

  const groups = flags
    ? quiz.chapters
        .map((chapter) => ({
          chapter,
          questions: getFlaggedQuestions(quiz, flags, chapter.id),
        }))
        .filter(({ questions }) => questions.length > 0)
    : undefined
  const count = groups?.reduce(
    (sum, { questions }) => sum + questions.length,
    0,
  )

  return (
    <div>
      <QuizPageHeader
        quiz={quiz}
        title="Review flagged questions"
        className=""
      />

      {count === 0 ? (
        <p className="mt-4 text-slate-600 dark:text-slate-400">
          No flagged questions yet. {FLAGGING_HINT}
        </p>
      ) : null}

      {groups && count ? (
        <>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
            <p className="text-slate-600 dark:text-slate-400">
              {count} flagged {count === 1 ? 'question' : 'questions'}, with
              their correct answers and explanations.
            </p>
            <Link
              to="/quiz/$quizId/flagged"
              params={{ quizId }}
              className={buttonClasses('secondary')}
            >
              Practice flagged
            </Link>
          </div>

          {groups.map(({ chapter, questions }) => (
            <section key={chapter.id} className="mt-8">
              <h2 className="text-lg font-semibold">
                {formatChapter(chapter)}
              </h2>
              <ol className="mt-3 flex flex-col gap-4">
                {questions.map((question) => (
                  <li
                    key={question.id}
                    className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
                  >
                    <p className="font-medium">{question.question}</p>
                    <CorrectAnswers question={question} textClass="text-base" />
                    <p className="mt-3">{question.explanation}</p>
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </>
      ) : null}
    </div>
  )
}

import { createFileRoute } from '@tanstack/react-router'
import { NotFound } from '#/components/NotFound'
import { QuizPageHeader } from '#/components/QuizPageHeader'
import { SingleQuestion } from '#/components/SingleQuestion'
import { formatChapter } from '#/lib/chapter-label'
import { pageTitle } from '#/lib/page-title'
import { requireQuestion } from '#/lib/quiz-route'

/** Cuts long text at a word boundary for the browser tab title. */
function shorten(text: string, max = 60): string {
  if (text.length <= max) return text
  const cut = text.slice(0, max)
  const lastSpace = cut.lastIndexOf(' ')
  return `${(lastSpace > 0 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`
}

// The page a shared question link opens (see src/lib/share.ts).
export const Route = createFileRoute('/quiz/$quizId/question/$questionId')({
  // Shuffled options: client-only component, see the chapter route. The loader
  // still runs on the server, so unknown ids get a real 404 and link previews
  // get the question in their meta tags.
  ssr: 'data-only',
  loader: ({ params }) => requireQuestion(params.quizId, params.questionId),
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: pageTitle() }] }
    const { quiz, question } = loaderData
    // Never the answer: the preview should make people want to try it.
    const description = `A practice question from ${quiz.title}. Can you answer it?`
    return {
      meta: [
        { title: pageTitle(shorten(question.question), quiz.title) },
        { name: 'description', content: description },
        { property: 'og:title', content: question.question },
        { property: 'og:description', content: description },
      ],
    }
  },
  component: QuestionPage,
  notFoundComponent: () => <NotFound message="Question not found." />,
})

function QuestionPage() {
  const { quiz, chapter, question } = Route.useLoaderData()

  return (
    <div>
      <QuizPageHeader
        quiz={quiz}
        className="mb-0"
        title={
          <>
            Practice question
            <span className="mt-1 block text-lg font-medium text-slate-600 dark:text-slate-400">
              {formatChapter(chapter)}
            </span>
          </>
        }
      />
      <SingleQuestion
        // A link to another question remounts it instead of reusing the state.
        key={question.id}
        quizId={quiz.id}
        chapterId={chapter.id}
        question={question}
      />
    </div>
  )
}

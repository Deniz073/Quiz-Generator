import { createFileRoute, notFound } from '@tanstack/react-router'
import { NoteEditor } from '#/components/NoteEditor'
import { NotFound } from '#/components/NotFound'
import { QuizPageHeader } from '#/components/QuizPageHeader'
import { fetchNote } from '#/lib/notes-api'
import { pageTitle } from '#/lib/page-title'
import { requireQuiz } from '#/lib/quiz-route'

// One of the signed-in user's notes on a quiz. Anyone else (visitors too)
// gets a 404. Two segments after the quiz id, so it can't clash with a
// chapter (/quiz/<id>/<chapter>) and `notes` needs no reserved chapter id.
export const Route = createFileRoute('/quiz/$quizId/notes/$noteId')({
  loader: async ({ params }) => {
    const [quiz, note] = await Promise.all([
      requireQuiz(params.quizId),
      fetchNote({ data: { quizId: params.quizId, noteId: params.noteId } }),
    ])
    if (!note) throw notFound()
    return { quiz, note }
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: pageTitle(loaderData?.note.title, loaderData?.quiz.title) },
    ],
  }),
  component: NotePage,
  notFoundComponent: () => <NotFound message="Note not found." />,
})

function NotePage() {
  const { quiz, note } = Route.useLoaderData()

  return (
    <div>
      <QuizPageHeader quiz={quiz} title="Note" signInBanner={false} />
      <NoteEditor key={note.id} quizId={quiz.id} note={note} />
    </div>
  )
}

import { createFileRoute, notFound, redirect } from '@tanstack/react-router'
import { NotFound } from '#/components/NotFound'
import { QuizAssistant } from '#/components/QuizAssistant'
import { QuizAssistantSkeleton } from '#/components/QuizAssistantSkeleton'
import { fetchAssistantStart } from '#/lib/assistant-api'
import { assistantPageKey, takeHandover } from '#/lib/assistant-handover'
import { pageTitle } from '#/lib/page-title'

/*
 * The quiz assistant: /assistant/new for a new quiz, /assistant/<quiz id> for
 * one of the user's own personal quizzes. One route for both, so the first
 * Save can move from "new" to the quiz's id without losing the conversation.
 * ("new" is never a personal quiz's id: those always end in a random suffix.)
 */
export const Route = createFileRoute('/assistant/$quizId')({
  beforeLoad: ({ context, location }) => {
    if (!context.user) {
      throw redirect({ to: '/login', search: { redirect: location.href } })
    }
  },
  loader: async ({ params }) => {
    // Just created on this page: nothing to load (see assistant-handover).
    const handedOver = takeHandover(params.quizId)
    if (handedOver) return handedOver
    const start = await fetchAssistantStart({
      data: { quizId: params.quizId === 'new' ? null : params.quizId },
    })
    if (!start) throw notFound()
    return start
  },
  // Always fresh: the quiz and the user's keys may have changed elsewhere.
  staleTime: 0,
  gcTime: 0,
  // Same page for /assistant/new and the quiz its first Save created.
  remountDeps: ({ params }) => assistantPageKey(params.quizId),
  head: ({ loaderData }) => ({
    meta: [
      {
        title: pageTitle(
          loaderData?.editable
            ? `Quiz assistant: ${loaderData.editable.quiz.title}`
            : 'Quiz assistant',
        ),
      },
    ],
  }),
  // A skeleton soon instead of keeping the previous page up while the quiz
  // and keys load. Not at once: every navigation also checks the session
  // (root beforeLoad), and a handover must finish without one. Kept up
  // briefly once shown, so it doesn't flash.
  pendingComponent: QuizAssistantSkeleton,
  pendingMs: 150,
  pendingMinMs: 200,
  component: AssistantPage,
  notFoundComponent: () => <NotFound message="Quiz not found." />,
})

function AssistantPage() {
  const start = Route.useLoaderData()
  return <QuizAssistant start={start} />
}

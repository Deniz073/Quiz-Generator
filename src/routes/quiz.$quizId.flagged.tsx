import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import type { Quiz } from '#/quizzes/types'
import { NotFound } from '#/components/NotFound'
import { QuizPageHeader } from '#/components/QuizPageHeader'
import { QuizRunner } from '#/components/QuizRunner'
import { formatChapter } from '#/lib/chapter-label'
import { getFlaggedQuestions, getFlagsSnapshot } from '#/lib/flags'
import { buildShuffledPlan } from '#/lib/quiz-plan'
import { pageTitle } from '#/lib/page-title'
import { requireQuiz } from '#/lib/quiz-route'
import { useFlags } from '#/lib/use-flags'

export const Route = createFileRoute('/quiz/$quizId/flagged')({
  // An invalid, missing or unknown chapter falls back to the whole quiz.
  validateSearch: (search: Record<string, unknown>): { chapter?: string } => {
    const { chapter } = search
    return {
      // A numeric-looking chapter id like `1` is parsed as a number.
      chapter:
        typeof chapter === 'string' || typeof chapter === 'number'
          ? String(chapter)
          : undefined,
    }
  },
  // Flags live in localStorage and questions are shuffled: client-only
  // component, see the chapter route. The loader still runs on the server for a
  // real 404.
  ssr: 'data-only',
  loader: ({ params }) => requireQuiz(params.quizId),
  head: ({ loaderData }) => ({
    meta: [{ title: pageTitle('Flagged questions', loaderData?.title) }],
  }),
  component: FlaggedPage,
  notFoundComponent: () => <NotFound message="Quiz not found." />,
})

function FlaggedPage() {
  const quiz = Route.useLoaderData()
  const { chapter: chapterParam } = Route.useSearch()

  const chapter = quiz.chapters.find((c) => c.id === chapterParam)

  return (
    <div>
      <QuizPageHeader
        quiz={quiz}
        title={
          <>
            Flagged questions
            {chapter ? (
              <span className="mt-1 block text-lg font-medium text-slate-600 dark:text-slate-400">
                {formatChapter(chapter)}
              </span>
            ) : null}
          </>
        }
      />
      {/* key resets the round when the scope changes. Not recorded in progress. */}
      <FlaggedRound
        key={chapter?.id ?? 'all'}
        quiz={quiz}
        chapterId={chapter?.id}
      />
    </div>
  )
}

function FlaggedRound({ quiz, chapterId }: { quiz: Quiz; chapterId?: string }) {
  const flags = useFlags(quiz.id)
  const count = flags
    ? getFlaggedQuestions(quiz, flags, chapterId).length
    : undefined
  // Decided once, when the flags have loaded: unflagging questions mid-round
  // must not unmount the round that is being played.
  const [hasQuestions, setHasQuestions] = useState<boolean>()
  if (hasQuestions === undefined && count !== undefined) {
    setHasQuestions(count > 0)
  }

  if (hasQuestions === undefined) return null
  if (!hasQuestions) {
    return (
      <p className="text-slate-600 dark:text-slate-400">
        No flagged questions {chapterId ? 'in this chapter' : 'yet'}. Use
        &ldquo;Flag for review&rdquo; during a chapter or practice round to
        collect questions here.
      </p>
    )
  }

  return (
    <QuizRunner
      quizId={quiz.id}
      mode="flagged"
      // Reads the latest flags, so "retry" drops questions unflagged meanwhile.
      buildPlan={() => {
        const latest = new Set(getFlagsSnapshot()[quiz.id])
        return buildShuffledPlan(getFlaggedQuestions(quiz, latest, chapterId))
      }}
      canRetry={count !== undefined && count > 0}
    />
  )
}

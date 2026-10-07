import { useState } from 'react'
import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import type { Quiz } from '#/quizzes/types'
import { NotFound } from '#/components/NotFound'
import { QuizRunner } from '#/components/QuizRunner'
import { getFlaggedQuestions, getFlagsSnapshot } from '#/lib/flags'
import { buildShuffledPlan } from '#/lib/quiz-plan'
import { useFlags } from '#/lib/use-flags'
import { getQuiz } from '#/quizzes'

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
  loader: ({ params }) => {
    if (!getQuiz(params.quizId)) throw notFound()
  },
  component: FlaggedPage,
  notFoundComponent: () => <NotFound message="Quiz not found." />,
})

function FlaggedPage() {
  const { quizId } = Route.useParams()
  const { chapter: chapterParam } = Route.useSearch()
  const quiz = getQuiz(quizId)
  if (!quiz) return null

  const chapter = quiz.chapters.find((c) => c.id === chapterParam)

  return (
    <div>
      <Link
        to="/quiz/$quizId"
        params={{ quizId }}
        className="text-sm text-sky-700 hover:underline dark:text-sky-400"
      >
        &larr; {quiz.title}
      </Link>
      <h1 className="mt-3 mb-6 text-2xl font-bold">
        Flagged questions
        {chapter ? (
          <span className="mt-1 block text-lg font-medium text-slate-600 dark:text-slate-400">
            Chapter {chapter.number} &mdash; {chapter.title}
          </span>
        ) : null}
      </h1>
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

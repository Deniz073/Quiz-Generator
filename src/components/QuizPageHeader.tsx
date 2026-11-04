import type { ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
import type { Quiz } from '#/quizzes/types'
import { SignInBanner } from '#/components/SignInBanner'
import { backLinkClasses } from '#/lib/button-classes'

/** The back link to the quiz and the h1 of a page inside a quiz. */
export function QuizPageHeader({
  quiz,
  title,
  className = 'mb-6',
  signInBanner = true,
}: {
  quiz: Quiz
  title: ReactNode
  /** Spacing below the title. */
  className?: string
  /** The "sign in to keep your progress" note; pointless where nothing is kept. */
  signInBanner?: boolean
}) {
  return (
    <>
      <Link
        to="/quiz/$quizId"
        params={{ quizId: quiz.id }}
        className={backLinkClasses}
      >
        <span aria-hidden="true">&larr;</span> {quiz.title}
      </Link>
      {signInBanner ? <SignInBanner className="mt-3" /> : null}
      <h1 className={`mt-3 text-2xl font-bold ${className}`}>{title}</h1>
    </>
  )
}

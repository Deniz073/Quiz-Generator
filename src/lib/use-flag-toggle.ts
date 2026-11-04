import { useLocation, useNavigate } from '@tanstack/react-router'
import type { Question } from '#/quizzes/types'
import { toggleFlag, useUserId } from '#/lib/user-data'

/**
 * What "Flag for review" does: flags or unflags the question for a signed-in
 * user; for a visitor it opens the sign-in page, which returns here.
 */
export function useFlagToggle(quizId: string): (question: Question) => void {
  const userId = useUserId()
  const navigate = useNavigate()
  const href = useLocation({ select: (location) => location.href })
  return (question) => {
    if (userId) toggleFlag(userId, quizId, question)
    else void navigate({ to: '/login', search: { redirect: href } })
  }
}

import { createServerFn } from '@tanstack/react-start'
import { getRequestUser } from '#/server/request-user'

export type CurrentUser = {
  id: string
  name: string
  email: string
  image: string | null
}

/** The signed-in user, or null. Safe to call from any page. */
export const getCurrentUser = createServerFn({ method: 'GET' }).handler(
  async (): Promise<CurrentUser | null> => {
    // Runs on every page (root loader). If auth or the database is down, log it
    // and treat the visitor as signed out so the quizzes keep working.
    let user
    try {
      user = await getRequestUser()
    } catch (error) {
      console.error('Failed to load session', error)
      return null
    }
    if (!user) return null
    const { id, name, email, image } = user
    return { id, name, email, image: image ?? null }
  },
)

import { getRequestHeaders } from '@tanstack/react-start/server'
import { auth } from '#/lib/auth'

/*
 * The signed-in user of the current request, for server function handlers
 * only. The user id always comes from the session, never from the client.
 */

/** The signed-in user's id, or null for a visitor. */
export async function getRequestUserId(): Promise<string | null> {
  const session = await auth.api.getSession({ headers: getRequestHeaders() })
  return session?.user.id ?? null
}

/** The signed-in user's id; throws for a visitor (writes need an account). */
export async function requireRequestUserId(): Promise<string> {
  const userId = await getRequestUserId()
  if (!userId) throw new Error('Sign in to save your progress.')
  return userId
}

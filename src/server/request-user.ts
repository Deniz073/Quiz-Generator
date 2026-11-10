import { getRequestHeaders } from '@tanstack/react-start/server'
import { auth } from '#/server/auth'

/*
 * The signed-in user of the current request, for server function handlers
 * only. The user always comes from the session, never from the client.
 */

/** The signed-in user, or null for a visitor. */
export async function getRequestUser() {
  const session = await auth.api.getSession({ headers: getRequestHeaders() })
  return session?.user ?? null
}

export async function getRequestUserId(): Promise<string | null> {
  return (await getRequestUser())?.id ?? null
}

/** The signed-in user's id; throws for a visitor (writes need an account). */
export async function requireRequestUserId(): Promise<string> {
  const userId = await getRequestUserId()
  if (!userId) throw new Error('You need to be signed in for this.')
  return userId
}

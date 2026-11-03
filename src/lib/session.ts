import { createServerFn } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'
import { eq } from 'drizzle-orm'
import { redirect } from '@tanstack/react-router'
import { auth } from '#/lib/auth'
import { db } from '#/db'
import { userSettings } from '#/db/schema'
import { apiKeysSchema } from '#/lib/api-keys-schema'

export type CurrentUser = {
  id: string
  name: string
  email: string
  image: string | null
}

async function requireSessionUser() {
  const session = await auth.api.getSession({ headers: getRequestHeaders() })
  if (!session) throw redirect({ to: '/login' })
  return session.user
}

/** The signed-in user, or null. Safe to call from any page. */
export const getCurrentUser = createServerFn({ method: 'GET' }).handler(
  async (): Promise<CurrentUser | null> => {
    // Runs on every page (root loader). If auth or the database is down, log it
    // and treat the visitor as signed out so the quizzes keep working.
    let session
    try {
      session = await auth.api.getSession({ headers: getRequestHeaders() })
    } catch (error) {
      console.error('Failed to load session', error)
      return null
    }
    if (!session) return null
    const { id, name, email, image } = session.user
    return { id, name, email, image: image ?? null }
  },
)

/** The signed-in user's saved API keys. Redirects to /login when signed out. */
export const getApiKeys = createServerFn({ method: 'GET' }).handler(
  async () => {
    const user = await requireSessionUser()
    const rows = await db
      .select({
        claudeApiKey: userSettings.claudeApiKey,
        codexApiKey: userSettings.codexApiKey,
      })
      .from(userSettings)
      .where(eq(userSettings.userId, user.id))
      .limit(1)
    const row = rows.at(0)
    return {
      claudeApiKey: row?.claudeApiKey ?? '',
      codexApiKey: row?.codexApiKey ?? '',
    }
  },
)

/** Saves both keys; an empty string clears a key. */
export const saveApiKeys = createServerFn({ method: 'POST' })
  .validator(apiKeysSchema)
  .handler(async ({ data }) => {
    const user = await requireSessionUser()
    const values = {
      claudeApiKey: data.claudeApiKey || null,
      codexApiKey: data.codexApiKey || null,
    }
    await db
      .insert(userSettings)
      .values({ userId: user.id, ...values })
      .onConflictDoUpdate({
        target: userSettings.userId,
        set: { ...values, updatedAt: new Date() },
      })
  })

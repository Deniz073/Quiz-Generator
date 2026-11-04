import { createServerFn } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'
import { z } from 'zod'
import { redirect } from '@tanstack/react-router'
import { auth } from '#/lib/auth'
import { apiKeyProviderSchema, apiKeysSchema } from '#/lib/api-keys-schema'
import type { ApiKeysStatus } from '#/lib/api-keys-schema'
import { getApiKeysStatus, updateApiKeys } from '#/server/api-key-store'

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

/**
 * Whether the signed-in user has saved API keys, with a short hint. Never the
 * keys themselves. Redirects to /login when signed out.
 */
export const getApiKeys = createServerFn({ method: 'GET' }).handler(
  async (): Promise<ApiKeysStatus> => {
    const user = await requireSessionUser()
    return getApiKeysStatus(user.id)
  },
)

/** Saves the non-empty keys; an empty field keeps the saved key. */
export const saveApiKeys = createServerFn({ method: 'POST' })
  .validator(apiKeysSchema)
  .handler(async ({ data }) => {
    const user = await requireSessionUser()
    await updateApiKeys(user.id, {
      claude: data.claudeApiKey || undefined,
      codex: data.codexApiKey || undefined,
    })
  })

/** Removes one saved key. */
export const removeApiKey = createServerFn({ method: 'POST' })
  .validator(z.object({ provider: apiKeyProviderSchema }))
  .handler(async ({ data }) => {
    const user = await requireSessionUser()
    await updateApiKeys(user.id, { [data.provider]: null })
  })

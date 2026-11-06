import { createServerFn } from '@tanstack/react-start'
import { redirect } from '@tanstack/react-router'
import { z } from 'zod'
import {
  API_KEY_PROVIDERS,
  apiKeyField,
  apiKeyProviderSchema,
  apiKeysSchema,
} from '#/lib/api-keys-schema'
import type { ApiKeysStatus } from '#/lib/api-keys-schema'
import { getApiKeysStatus, updateApiKeys } from '#/server/api-key-store'
import { getRequestUserId, requireRequestUserId } from '#/server/request-user'

/*
 * The signed-in user's provider API keys, for the profile page. Write-only:
 * the client gets a status with a hint, never a key.
 */

/** Redirects to /login when signed out (the profile page's loader). */
export const getApiKeys = createServerFn({ method: 'GET' }).handler(
  async (): Promise<ApiKeysStatus> => {
    const userId = await getRequestUserId()
    if (!userId) throw redirect({ to: '/login' })
    return getApiKeysStatus(userId)
  },
)

/** Saves the non-empty keys; an empty field keeps the saved key. */
export const saveApiKeys = createServerFn({ method: 'POST' })
  .validator(apiKeysSchema)
  .handler(async ({ data }) => {
    const userId = await requireRequestUserId()
    await updateApiKeys(
      userId,
      Object.fromEntries(
        API_KEY_PROVIDERS.flatMap((provider) => {
          const key = data[apiKeyField[provider]]
          return key ? [[provider, key]] : []
        }),
      ),
    )
  })

/** Removes one saved key. */
export const removeApiKey = createServerFn({ method: 'POST' })
  .validator(z.object({ provider: apiKeyProviderSchema }))
  .handler(async ({ data }) => {
    const userId = await requireRequestUserId()
    await updateApiKeys(userId, { [data.provider]: null })
  })

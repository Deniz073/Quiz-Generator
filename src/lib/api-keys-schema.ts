import { z } from 'zod'

/**
 * Shared by the profile form and the server function. Write-only: an empty
 * field keeps the saved key; removing a key is a separate action.
 * No key format checks yet.
 */
export const apiKeysSchema = z.object({
  claudeApiKey: z.string().trim().max(512),
  codexApiKey: z.string().trim().max(512),
})

export type ApiKeys = z.infer<typeof apiKeysSchema>

/** Every provider the quiz assistant can run on, with a key per user. */
export const API_KEY_PROVIDERS = ['claude', 'codex'] as const

export const apiKeyProviderSchema = z.enum(API_KEY_PROVIDERS)

export type ApiKeyProvider = z.infer<typeof apiKeyProviderSchema>

/** The field of `apiKeysSchema` that holds each provider's key. */
export const apiKeyField = {
  claude: 'claudeApiKey',
  codex: 'codexApiKey',
} as const satisfies Record<ApiKeyProvider, keyof ApiKeys>

/** The provider as the UI names it ("codex" is OpenAI). */
export const providerLabels: Record<ApiKeyProvider, string> = {
  claude: 'Claude',
  codex: 'OpenAI',
}

/** What the client may know about a saved key: never the key itself. */
export type ApiKeyStatus =
  | { state: 'none' }
  | { state: 'set'; hint: string }
  // Saved, but can't be decrypted (e.g. the master key changed): re-enter it.
  | { state: 'unreadable' }

export type ApiKeysStatus = {
  // False when API_KEY_ENCRYPTION_KEY is missing: keys can't be saved.
  storageConfigured: boolean
} & Record<ApiKeyProvider, ApiKeyStatus>

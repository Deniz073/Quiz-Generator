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

/** Each provider as the UI shows it ("codex" is OpenAI). */
export const providerInfo = {
  claude: {
    label: 'Claude',
    field: 'claudeApiKey',
    description: 'Your Anthropic API key.',
    createLabel: 'Create one in the Claude Console',
    createUrl: 'https://platform.claude.com/settings/keys',
  },
  codex: {
    label: 'OpenAI',
    field: 'codexApiKey',
    description: 'Your OpenAI API key.',
    createLabel: 'Create one on the OpenAI platform',
    createUrl: 'https://platform.openai.com/api-keys',
  },
} as const satisfies Record<
  ApiKeyProvider,
  {
    label: string
    field: keyof ApiKeys
    description: string
    createLabel: string
    createUrl: string
  }
>

export const emptyApiKeys = Object.fromEntries(
  API_KEY_PROVIDERS.map((provider) => [providerInfo[provider].field, '']),
) as ApiKeys

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

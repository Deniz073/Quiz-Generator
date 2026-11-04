import { eq } from 'drizzle-orm'
import { db } from '#/db'
import { userSettings } from '#/db/schema'
import type {
  ApiKeyProvider,
  ApiKeyStatus,
  ApiKeysStatus,
} from '#/lib/api-keys-schema'
import {
  decryptSecret,
  encryptSecret,
  isSecretBoxConfigured,
} from '#/server/secret-box'

/*
 * Users' provider API keys, encrypted at rest (see secret-box). Plaintext
 * keys never leave the server: the client only gets a status with a hint.
 * Use getDecryptedApiKey right before calling the provider, and never log it.
 */

const columns = {
  claude: userSettings.claudeApiKey,
  codex: userSettings.codexApiKey,
} as const

const fieldNames = {
  claude: 'claudeApiKey',
  codex: 'codexApiKey',
} as const

const providers = Object.keys(columns) as ApiKeyProvider[]

// Binds each ciphertext to its user and column.
function aadFor(userId: string, provider: ApiKeyProvider): string {
  return `user_settings:${userId}:${provider}`
}

async function loadEncrypted(userId: string) {
  const rows = await db
    .select({ claude: columns.claude, codex: columns.codex })
    .from(userSettings)
    .where(eq(userSettings.userId, userId))
    .limit(1)
  return rows.at(0) ?? { claude: null, codex: null }
}

function tryDecrypt(
  userId: string,
  provider: ApiKeyProvider,
  stored: string,
): string | null {
  try {
    return decryptSecret(stored, aadFor(userId, provider))
  } catch (error) {
    // Wrong or missing master key, a pre-encryption plaintext value, or tampering.
    console.error(`Could not decrypt ${provider} API key for user ${userId}`, {
      reason: error instanceof Error ? error.message : String(error),
    })
    return null
  }
}

export async function getApiKeysStatus(userId: string): Promise<ApiKeysStatus> {
  const stored = await loadEncrypted(userId)
  const status = (provider: ApiKeyProvider): ApiKeyStatus => {
    const value = stored[provider]
    if (!value) return { state: 'none' }
    const plain = tryDecrypt(userId, provider, value)
    if (plain === null) return { state: 'unreadable' }
    return { state: 'set', hint: `…${plain.slice(-4)}` }
  }
  return {
    storageConfigured: isSecretBoxConfigured(),
    claude: status('claude'),
    codex: status('codex'),
  }
}

/**
 * Sets (string) or removes (null) keys; providers left out are unchanged.
 * Throws SecretBoxNotConfiguredError when setting a key without a master key.
 */
export async function updateApiKeys(
  userId: string,
  changes: Partial<Record<ApiKeyProvider, string | null>>,
): Promise<void> {
  const values: Partial<
    Record<(typeof fieldNames)[ApiKeyProvider], string | null>
  > = {}
  for (const provider of providers) {
    const value = changes[provider]
    if (value === undefined) continue
    values[fieldNames[provider]] =
      value === null ? null : encryptSecret(value, aadFor(userId, provider))
  }
  if (Object.keys(values).length === 0) return
  await db
    .insert(userSettings)
    .values({ userId, ...values })
    .onConflictDoUpdate({
      target: userSettings.userId,
      set: { ...values, updatedAt: new Date() },
    })
}

/** The plaintext key for a provider call, or null when none is usable. */
export async function getDecryptedApiKey(
  userId: string,
  provider: ApiKeyProvider,
): Promise<string | null> {
  const value = (await loadEncrypted(userId))[provider]
  if (!value) return null
  return tryDecrypt(userId, provider, value)
}

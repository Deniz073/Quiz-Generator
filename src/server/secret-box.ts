import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto'

/*
 * Encrypts small secrets (users' provider API keys) for storage in the
 * database. AES-256-GCM with a master key from API_KEY_ENCRYPTION_KEY
 * (32 random bytes, base64: `openssl rand -base64 32`). The master key never
 * touches the database; losing it makes every stored secret unreadable.
 *
 * Stored format: `v1:<iv>:<authTag>:<ciphertext>`, all base64. The version
 * prefix leaves room to rotate the master key later (add v2, decrypt v1 with
 * the old key, re-encrypt). The `aad` binds a ciphertext to where it is
 * stored (user and column), so a value copied to another row fails to decrypt.
 */

const VERSION = 'v1'
const ALGORITHM = 'aes-256-gcm'
const IV_BYTES = 12
const KEY_BYTES = 32

export class SecretBoxNotConfiguredError extends Error {
  constructor() {
    super(
      'API_KEY_ENCRYPTION_KEY is not set: API key storage is disabled. Generate one with `openssl rand -base64 32`.',
    )
    this.name = 'SecretBoxNotConfiguredError'
  }
}

/** Whether the master key is set and valid. Lets the UI disable key storage. */
export function isSecretBoxConfigured(): boolean {
  try {
    masterKey()
    return true
  } catch {
    return false
  }
}

export function encryptSecret(plaintext: string, aad: string): string {
  const iv = randomBytes(IV_BYTES)
  const cipher = createCipheriv(ALGORITHM, masterKey(), iv)
  cipher.setAAD(Buffer.from(aad, 'utf8'))
  const ciphertext = Buffer.concat([
    cipher.update(plaintext, 'utf8'),
    cipher.final(),
  ])
  const tag = cipher.getAuthTag()
  return [VERSION, iv, tag, ciphertext]
    .map((part) => (typeof part === 'string' ? part : part.toString('base64')))
    .join(':')
}

/** Throws when the value is malformed, tampered with, or stored under another aad. */
export function decryptSecret(stored: string, aad: string): string {
  const parts = stored.split(':')
  if (parts.length !== 4 || parts[0] !== VERSION) {
    throw new Error('Stored secret has an unknown format')
  }
  const [, iv, tag, ciphertext] = parts.map((part) =>
    Buffer.from(part, 'base64'),
  )
  const decipher = createDecipheriv(ALGORITHM, masterKey(), iv)
  decipher.setAAD(Buffer.from(aad, 'utf8'))
  decipher.setAuthTag(tag)
  return Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ]).toString('utf8')
}

// Read on use, not at import, so the app starts without the variable.
function masterKey(): Buffer {
  const value = process.env.API_KEY_ENCRYPTION_KEY
  if (!value) throw new SecretBoxNotConfiguredError()
  const key = Buffer.from(value, 'base64')
  if (key.length !== KEY_BYTES) {
    throw new Error(
      `API_KEY_ENCRYPTION_KEY must be ${KEY_BYTES} bytes, base64-encoded (got ${key.length} bytes).`,
    )
  }
  return key
}

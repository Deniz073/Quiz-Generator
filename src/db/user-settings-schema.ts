import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { user } from './auth-schema'

/** Per-user app settings, kept out of the generated auth schema. One row per user. */
export const userSettings = pgTable('user_settings', {
  userId: text('user_id')
    .primaryKey()
    .references(() => user.id, { onDelete: 'cascade' }),
  // Encrypted (`v1:<iv>:<tag>:<ciphertext>`); only src/server/api-key-store reads or writes them.
  claudeApiKey: text('claude_api_key'),
  codexApiKey: text('codex_api_key'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
})

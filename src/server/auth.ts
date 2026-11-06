import { betterAuth } from 'better-auth/minimal'
import { drizzleAdapter } from '@better-auth/drizzle-adapter/relations-v2'
import { tanstackStartCookies } from 'better-auth/tanstack-start'
import { db } from '#/db'
import * as schema from '#/db/schema'

// BETTER_AUTH_URL and BETTER_AUTH_SECRET are read from the environment automatically.
export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: 'pg', schema }),
  socialProviders: {
    google: {
      clientId: requireEnv('GOOGLE_CLIENT_ID'),
      clientSecret: requireEnv('GOOGLE_CLIENT_SECRET'),
    },
  },
  // Must stay last: it sets cookies through TanStack Start's response API.
  plugins: [tanstackStartCookies()],
})

function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`Missing environment variable ${name}`)
  return value
}

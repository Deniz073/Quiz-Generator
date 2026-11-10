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
  // The session is also kept in a signed cookie for a few minutes, so server
  // functions (several per page) don't each look it up in the database.
  // Until it expires, a session ended elsewhere still counts on a device
  // that has the cookie; signing out on that device clears it at once.
  session: { cookieCache: { enabled: true, maxAge: 5 * 60 } },
  // Must stay last: it sets cookies through TanStack Start's response API.
  plugins: [tanstackStartCookies()],
})

function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`Missing environment variable ${name}`)
  return value
}

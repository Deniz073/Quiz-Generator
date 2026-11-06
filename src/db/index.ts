import 'dotenv/config'
import { sql } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/node-postgres'
import { relations } from './schema'

const url = process.env.DATABASE_URL
if (!url) throw new Error('Missing environment variable DATABASE_URL')

export const db = drizzle(url, { relations })

export type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0]

export type Executor = typeof db | Transaction

/**
 * Holds `key` until the transaction ends, so work under the same key (e.g.
 * one user creating quizzes from two tabs) runs one after another.
 */
export async function lockUntilCommit(
  tx: Transaction,
  key: string,
): Promise<void> {
  await tx.execute(sql`select pg_advisory_xact_lock(hashtext(${key}))`)
}

import 'dotenv/config'
import { drizzle } from 'drizzle-orm/node-postgres'
import { relations } from './schema'

const url = process.env.DATABASE_URL
if (!url) throw new Error('Missing environment variable DATABASE_URL')

export const db = drizzle(url, { relations })

import { and, count, desc, eq } from 'drizzle-orm'
import { db, lockUntilCommit } from '#/db'
import { quizNote } from '#/db/schema'
import { DEFAULT_NOTE_TITLE, canAddNote } from '#/domain/notes'

/*
 * Storage of users' notes. Every query is scoped to the user (and the quiz),
 * so a note of someone else reads as missing. Callers have already checked
 * that the quiz is visible to the user (./quiz-access) where it matters:
 * listing and creating. Server only.
 */

/** What the quiz page lists of a note. */
export interface NoteSummary {
  id: string
  title: string
  /** ISO time of the last save. */
  updatedAt: string
}

export interface Note extends NoteSummary {
  /** Markdown. */
  body: string
}

/** Note ids are uuids; anything else is not a note (and not a query). */
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function isNoteId(noteId: string): boolean {
  return UUID.test(noteId)
}

function ownNote(userId: string, quizId: string, noteId: string) {
  return and(
    eq(quizNote.id, noteId),
    eq(quizNote.userId, userId),
    eq(quizNote.quizId, quizId),
  )
}

/** The user's notes on a quiz, most recently edited first. */
export async function listNotes(
  userId: string,
  quizId: string,
): Promise<Array<NoteSummary>> {
  const rows = await db
    .select({
      id: quizNote.id,
      title: quizNote.title,
      updatedAt: quizNote.updatedAt,
    })
    .from(quizNote)
    .where(and(eq(quizNote.userId, userId), eq(quizNote.quizId, quizId)))
    .orderBy(desc(quizNote.updatedAt), desc(quizNote.id))
  return rows.map((row) => ({
    ...row,
    updatedAt: row.updatedAt.toISOString(),
  }))
}

/** One of the user's notes on a quiz, or null. */
export async function findNote(
  userId: string,
  quizId: string,
  noteId: string,
): Promise<Note | null> {
  if (!isNoteId(noteId)) return null
  const rows = await db
    .select({
      id: quizNote.id,
      title: quizNote.title,
      body: quizNote.body,
      updatedAt: quizNote.updatedAt,
    })
    .from(quizNote)
    .where(ownNote(userId, quizId, noteId))
    .limit(1)
  const row = rows.at(0)
  return row ? { ...row, updatedAt: row.updatedAt.toISOString() } : null
}

/**
 * A new, empty note; null if the user already has as many notes on the quiz
 * as allowed. Creates for the same user and quiz run one at a time (an
 * advisory lock), so concurrent requests can't pass the cap together.
 */
export async function createNote(
  userId: string,
  quizId: string,
): Promise<{ id: string } | null> {
  return db.transaction(async (tx) => {
    await lockUntilCommit(tx, `quiz_note:${userId}:${quizId}`)
    const [{ existing }] = await tx
      .select({ existing: count() })
      .from(quizNote)
      .where(and(eq(quizNote.userId, userId), eq(quizNote.quizId, quizId)))
    if (!canAddNote(existing)) return null
    const [created] = await tx
      .insert(quizNote)
      .values({ userId, quizId, title: DEFAULT_NOTE_TITLE })
      .returning({ id: quizNote.id })
    return created
  })
}

/**
 * Replaces a note's title and body (last write wins); the new save time, or
 * null if the user has no such note.
 */
export async function updateNote(
  userId: string,
  quizId: string,
  noteId: string,
  content: { title: string; body: string },
): Promise<string | null> {
  if (!isNoteId(noteId)) return null
  const rows = await db
    .update(quizNote)
    .set({ title: content.title, body: content.body })
    .where(ownNote(userId, quizId, noteId))
    .returning({ updatedAt: quizNote.updatedAt })
  return rows.at(0)?.updatedAt.toISOString() ?? null
}

/** False if the user has no such note. */
export async function deleteNote(
  userId: string,
  quizId: string,
  noteId: string,
): Promise<boolean> {
  if (!isNoteId(noteId)) return false
  const rows = await db
    .delete(quizNote)
    .where(ownNote(userId, quizId, noteId))
    .returning({ id: quizNote.id })
  return rows.length > 0
}

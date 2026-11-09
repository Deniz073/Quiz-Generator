import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { idInput } from '#/lib/api-inputs'
import { findDisallowedUrls } from '#/lib/note-markdown'
import {
  MAX_NOTES_PER_QUIZ,
  MAX_NOTE_LENGTH,
  MAX_NOTE_TITLE_LENGTH,
  isValidNoteLength,
  isValidNoteTitle,
  normalizeNoteTitle,
} from '#/domain/notes'
import type { Note, NoteSummary } from '#/server/note-store'
import {
  createNote,
  deleteNote,
  findNote,
  listNotes,
  updateNote,
} from '#/server/note-store'
import { findQuizHeader } from '#/server/quiz-access'
import { getRequestUserId, requireRequestUserId } from '#/server/request-user'

/*
 * A signed-in user's notes on a quiz: only ever their own, on a quiz they can
 * see (a built-in quiz or one of their personal quizzes; not a Marketplace
 * preview). Visitors read null and can't write. Thin on purpose: rules are in
 * #/domain/notes, storage in #/server/note-store.
 */

export type { Note, NoteSummary }

const noteInput = z.object({ quizId: idInput, noteId: idInput })

/** Null for visitors and for quizzes the user can't see. */
export const fetchQuizNotes = createServerFn({ method: 'GET' })
  .validator(z.object({ quizId: idInput }))
  .handler(async ({ data }): Promise<Array<NoteSummary> | null> => {
    const userId = await getRequestUserId()
    if (!userId || !(await findQuizHeader(data.quizId, userId))) return null
    return listNotes(userId, data.quizId)
  })

/** Null unless it is one of the user's notes on a quiz they can see. */
export const fetchNote = createServerFn({ method: 'GET' })
  .validator(noteInput)
  .handler(async ({ data }): Promise<Note | null> => {
    const userId = await getRequestUserId()
    if (!userId || !(await findQuizHeader(data.quizId, userId))) return null
    return findNote(userId, data.quizId, data.noteId)
  })

/** A new, empty note on the quiz; its id. */
export const createQuizNote = createServerFn({ method: 'POST' })
  .validator(z.object({ quizId: idInput }))
  .handler(async ({ data }): Promise<{ id: string }> => {
    const userId = await requireRequestUserId()
    if (!(await findQuizHeader(data.quizId, userId))) {
      throw new Error('Quiz not found.')
    }
    const created = await createNote(userId, data.quizId)
    if (!created) {
      throw new Error(
        `You can keep at most ${MAX_NOTES_PER_QUIZ} notes on a quiz. Delete one to add another.`,
      )
    }
    return created
  })

/**
 * Saves a note's title and markdown (the last save wins); the new save time.
 * Links must be http(s) or mailto and images https, checked by reading the
 * markdown as the editor does.
 */
export const saveNote = createServerFn({ method: 'POST' })
  .validator(
    noteInput.extend({
      // Generous: the rules below give the precise limits and messages.
      title: z.string().max(MAX_NOTE_TITLE_LENGTH * 4),
      body: z.string().max(MAX_NOTE_LENGTH * 2),
    }),
  )
  .handler(async ({ data }): Promise<{ updatedAt: string }> => {
    const userId = await requireRequestUserId()
    const title = normalizeNoteTitle(data.title)
    if (!isValidNoteTitle(title)) {
      throw new Error(
        `Give the note a title of at most ${MAX_NOTE_TITLE_LENGTH} characters.`,
      )
    }
    if (!isValidNoteLength(data.body)) {
      throw new Error(
        `The note is too long: at most ${MAX_NOTE_LENGTH.toLocaleString('en')} characters.`,
      )
    }
    const disallowed = findDisallowedUrls(data.body)
    if (disallowed.length > 0) {
      throw new Error(
        `Links must start with https://, http:// or mailto:, and images with https://. Fix: ${disallowed.slice(0, 3).join(', ')}`,
      )
    }
    const updatedAt = await updateNote(userId, data.quizId, data.noteId, {
      title,
      body: data.body,
    })
    if (!updatedAt) throw new Error('This note no longer exists.')
    return { updatedAt }
  })

export const deleteQuizNote = createServerFn({ method: 'POST' })
  .validator(noteInput)
  .handler(async ({ data }) => {
    const userId = await requireRequestUserId()
    if (!(await deleteNote(userId, data.quizId, data.noteId))) {
      throw new Error('This note no longer exists.')
    }
  })

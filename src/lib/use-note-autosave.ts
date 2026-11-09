import { useCallback, useEffect, useRef, useState } from 'react'
import { saveNote } from '#/lib/notes-api'
import { trackWrite } from '#/lib/pending-writes'

/*
 * Autosave for the note editor: a change is saved about a second after the
 * last one, one save at a time (so they reach the server in order), and
 * `flush` saves at once (e.g. before leaving). A failed save keeps the text
 * and shows why; the next change or `flush` tries again.
 */

export type SaveStatus =
  /** Everything is saved. */
  | { kind: 'saved' }
  /** Changes wait for the next save. */
  | { kind: 'unsaved' }
  | { kind: 'saving' }
  /** The last save failed, or the content can't be saved as it is. */
  | { kind: 'error'; message: string }

/** What to save, or why it can't be saved as it is. */
export type NoteSnapshot =
  { ok: true; title: string; body: string } | { ok: false; message: string }

const DEBOUNCE_MS = 1000

export function useNoteAutosave({
  quizId,
  noteId,
  read,
  onSaved,
}: {
  quizId: string
  noteId: string
  /** The note as it is now in the editor. */
  read: () => NoteSnapshot
  /** After each successful save, with the server's save time (ISO). */
  onSaved?: (updatedAt: string) => void
}) {
  const [status, setStatus] = useState<SaveStatus>({ kind: 'saved' })
  /** Bumped by every change; `saved` is the version last stored. */
  const version = useRef(0)
  const saved = useRef(0)
  /** Saves run one after another on this chain. */
  const chain = useRef<Promise<unknown>>(Promise.resolve())
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  /** Stops all saving, e.g. once the note is deleted. */
  const stopped = useRef(false)
  const readRef = useRef(read)
  readRef.current = read
  const onSavedRef = useRef(onSaved)
  onSavedRef.current = onSaved

  // A function, not the ref itself: TypeScript would assume it unchanged
  // across an await.
  const isStopped = () => stopped.current

  const clearTimer = () => {
    clearTimeout(timer.current)
    timer.current = undefined
  }

  /**
   * Saves the latest version if it isn't yet (as `given`, if read earlier);
   * true once it is stored.
   */
  const saveLatest = useCallback(
    async (given?: NoteSnapshot): Promise<boolean> => {
      if (stopped.current) return true
      if (saved.current >= version.current) return true
      const snapshot = given ?? readRef.current()
      if (!snapshot.ok) {
        setStatus({ kind: 'error', message: snapshot.message })
        return false
      }
      const target = version.current
      setStatus({ kind: 'saving' })
      let result: { updatedAt: string }
      try {
        result = await saveNote({
          data: {
            quizId,
            noteId,
            title: snapshot.title,
            body: snapshot.body,
          },
        })
      } catch (cause) {
        if (!isStopped()) {
          setStatus({
            kind: 'error',
            message:
              cause instanceof Error ? cause.message : 'Something went wrong.',
          })
        }
        return false
      }
      saved.current = Math.max(saved.current, target)
      onSavedRef.current?.(result.updatedAt)
      if (!isStopped()) {
        // Changes made meanwhile have their own save scheduled.
        setStatus(
          saved.current >= version.current
            ? { kind: 'saved' }
            : { kind: 'unsaved' },
        )
      }
      return true
    },
    [quizId, noteId],
  )

  /** Saves now (after any save under way); true once everything is stored. */
  const flush = useCallback(
    (given?: NoteSnapshot): Promise<boolean> => {
      clearTimer()
      const next = trackWrite(chain.current.then(() => saveLatest(given)))
      chain.current = next.catch(() => false)
      return next
    },
    [saveLatest],
  )

  /** Call on every change of the title or content. */
  const changed = useCallback(() => {
    version.current += 1
    // Counted while stopped too, so `resume` still saves it.
    if (stopped.current) return
    setStatus((current) =>
      current.kind === 'saving' ? current : { kind: 'unsaved' },
    )
    clearTimer()
    timer.current = setTimeout(() => void flush(), DEBOUNCE_MS)
  }, [flush])

  /** Changes not stored yet (or failed). */
  const isDirty = useCallback(
    () => !stopped.current && saved.current < version.current,
    [],
  )

  /**
   * No more saves, e.g. the note is being deleted or the user leaves without
   * saving. Resolves once a save under way has finished.
   */
  const stop = useCallback((): Promise<unknown> => {
    stopped.current = true
    clearTimer()
    return chain.current
  }, [])

  /** Saving again after `stop` (e.g. the delete failed). */
  const resume = useCallback(() => {
    stopped.current = false
    if (saved.current < version.current) {
      setStatus({ kind: 'unsaved' })
      void flush()
    } else {
      setStatus({ kind: 'saved' })
    }
  }, [flush])

  // Leaving the page (in-app) without a prompt: save what is left. The
  // snapshot is read now, while the editor still exists.
  useEffect(
    () => () => {
      if (saved.current < version.current && !stopped.current) {
        void flush(readRef.current())
      }
    },
    [flush],
  )

  return { status, changed, flush, isDirty, stop, resume }
}

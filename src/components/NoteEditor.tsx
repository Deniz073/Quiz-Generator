import { useEffect, useId, useRef, useState } from 'react'
import { useBlocker, useNavigate } from '@tanstack/react-router'
import { EditorContent, useEditor } from '@tiptap/react'
import type { Editor } from '@tiptap/react'
import { ConfirmAction } from '#/components/ConfirmAction'
import { LeavePrompt } from '#/components/LeavePrompt'
import { NoteToolbar } from '#/components/NoteToolbar'
import { Button } from '#/components/ui/button'
import { Field, FieldError, FieldLabel } from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import { Skeleton } from '#/components/ui/skeleton'
import {
  MAX_NOTE_LENGTH,
  MAX_NOTE_TITLE_LENGTH,
  isValidNoteLength,
  isValidNoteTitle,
  normalizeNoteTitle,
} from '#/domain/notes'
import { noteEditorExtensions } from '#/lib/note-markdown'
import { registerFlush } from '#/lib/pending-writes'
import type { Note } from '#/lib/notes-api'
import { deleteQuizNote } from '#/lib/notes-api'
import type { NoteSnapshot, SaveStatus } from '#/lib/use-note-autosave'
import { useNoteAutosave } from '#/lib/use-note-autosave'

const editorProps = {
  attributes: {
    id: 'note-content',
    class: 'note-content px-4 py-3',
    'aria-label': 'Note',
    // No browser spell check: it marks everything when its language isn't
    // the note's.
    spellcheck: 'false',
  },
}

/** Why a title can't be saved, or null. */
function titleProblem(title: string): string | null {
  const normalized = normalizeNoteTitle(title)
  if (isValidNoteTitle(normalized)) return null
  return normalized === ''
    ? 'Give the note a title.'
    : `Keep the title to ${MAX_NOTE_TITLE_LENGTH} characters.`
}

/**
 * One of the user's notes, always editable: its title and its content in a
 * rich text editor that stores markdown. Saved automatically shortly after
 * each change; leaving with changes that could not be saved asks first.
 */
export function NoteEditor({ quizId, note }: { quizId: string; note: Note }) {
  const titleId = useId()
  const navigate = useNavigate()
  const [title, setTitle] = useState(note.title)
  const titleRef = useRef(title)
  const editorRef = useRef<Editor | null>(null)
  /** The newest version of the note on the server that this page knows. */
  const known = useRef(note.updatedAt)
  /** Leaving after a delete: nothing to save or ask. */
  const deleted = useRef(false)

  const read = (): NoteSnapshot => {
    const problem = titleProblem(titleRef.current)
    if (problem) return { ok: false, message: problem }
    const editor = editorRef.current
    const body = editor ? editor.getMarkdown() : initialBody
    if (!isValidNoteLength(body)) {
      return {
        ok: false,
        message: `The note is too long: at most ${MAX_NOTE_LENGTH.toLocaleString('en')} characters of markdown.`,
      }
    }
    return { ok: true, title: normalizeNoteTitle(titleRef.current), body }
  }

  const autosave = useNoteAutosave({
    quizId,
    noteId: note.id,
    read,
    onSaved: (updatedAt) => {
      if (updatedAt > known.current) known.current = updatedAt
    },
  })
  const changedRef = useRef(autosave.changed)
  changedRef.current = autosave.changed

  // Created once per note: the editor compares its options on every render.
  const [extensions] = useState(noteEditorExtensions)
  const [initialBody] = useState(note.body)
  const editor = useEditor({
    extensions,
    content: initialBody,
    contentType: 'markdown',
    // The server renders the page without the editor.
    immediatelyRender: false,
    editorProps,
    onUpdate: () => changedRef.current(),
  })
  editorRef.current = editor

  // A newer version from the server (e.g. saved in another tab, then this
  // page reloaded) replaces the content, unless there are local changes:
  // those win when they are saved.
  useEffect(() => {
    if (note.updatedAt <= known.current) return
    known.current = note.updatedAt
    if (autosave.isDirty()) return
    titleRef.current = note.title
    setTitle(note.title)
    editor?.commands.setContent(note.body, {
      contentType: 'markdown',
      emitUpdate: false,
    })
  }, [note, editor, autosave])

  // Signing out saves first (see #/lib/pending-writes).
  const { flush } = autosave
  useEffect(() => registerFlush(flush), [flush])

  // In-app navigation saves first, and asks only if that fails. Reload and
  // tab close get the browser's prompt while changes are unsaved.
  const blocker = useBlocker({
    shouldBlockFn: async () => {
      if (deleted.current) return false
      return !(await autosave.flush())
    },
    enableBeforeUnload: () => autosave.isDirty(),
    withResolver: true,
  })

  const remove = async () => {
    // No save may reach the server after the delete (it would fail).
    await autosave.stop()
    try {
      await deleteQuizNote({ data: { quizId, noteId: note.id } })
    } catch (cause) {
      autosave.resume()
      throw cause
    }
    deleted.current = true
    await navigate({ to: '/quiz/$quizId', params: { quizId } })
  }

  const titleError = titleProblem(title)

  return (
    <div className="flex flex-col gap-4">
      {blocker.status === 'blocked' ? (
        <LeavePrompt
          title="Your latest changes aren't saved"
          description={
            autosave.status.kind === 'error'
              ? autosave.status.message
              : 'Saving them failed.'
          }
          stayLabel="Stay"
          leaveLabel="Leave without saving"
          onStay={() => blocker.reset()}
          onLeave={() => {
            // Nothing more is saved, also not when the page closes.
            void autosave.stop()
            blocker.proceed()
          }}
        />
      ) : null}

      <Field data-invalid={titleError ? true : undefined}>
        <FieldLabel htmlFor={titleId}>Title</FieldLabel>
        <Input
          id={titleId}
          value={title}
          maxLength={MAX_NOTE_TITLE_LENGTH}
          aria-invalid={titleError ? true : undefined}
          className="text-base font-semibold md:text-base"
          onChange={(event) => {
            titleRef.current = event.target.value
            setTitle(event.target.value)
            autosave.changed()
          }}
        />
        {titleError ? <FieldError>{titleError}</FieldError> : null}
      </Field>

      <div className="overflow-hidden rounded-lg border bg-card">
        {editor ? (
          <>
            <NoteToolbar editor={editor} />
            <EditorContent editor={editor} />
          </>
        ) : (
          <div className="flex flex-col gap-3 p-4" aria-hidden="true">
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <SaveState
          status={autosave.status}
          onRetry={() => void autosave.flush()}
        />
        <ConfirmAction
          label="Delete note"
          title={`Delete ${normalizeNoteTitle(title) || 'this note'}?`}
          description="The note is gone for good. This can't be undone."
          confirmLabel="Delete"
          destructive
          onConfirm={remove}
        />
      </div>
    </div>
  )
}

function SaveState({
  status,
  onRetry,
}: {
  status: SaveStatus
  onRetry: () => void
}) {
  if (status.kind === 'error') {
    return (
      <div className="flex flex-wrap items-center gap-2" role="alert">
        <span className="text-sm text-destructive">
          Not saved: {status.message}
        </span>
        <Button variant="outline" size="sm" onClick={onRetry}>
          Try again
        </Button>
      </div>
    )
  }
  return (
    <p className="text-sm text-muted-foreground" aria-live="polite">
      {status.kind === 'saving'
        ? 'Saving…'
        : status.kind === 'unsaved'
          ? 'Unsaved changes'
          : 'Saved'}
    </p>
  )
}

import { useState } from 'react'
import {
  Link,
  useHydrated,
  useLocation,
  useNavigate,
} from '@tanstack/react-router'
import { PlusIcon } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { MAX_NOTES_PER_QUIZ, canAddNote } from '#/domain/notes'
import type { NoteSummary } from '#/lib/notes-api'
import { createQuizNote } from '#/lib/notes-api'

/** In the browser's time zone, so only rendered after hydration. */
const dateFormat = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

/**
 * The quiz page's notes: the signed-in user's own notes on the quiz, most
 * recently edited first, and a button for a new one. Visitors (`notes` null)
 * are asked to sign in.
 */
export function NotesSection({
  quizId,
  notes,
}: {
  quizId: string
  /** Null: a visitor. */
  notes: Array<NoteSummary> | null
}) {
  const navigate = useNavigate()
  const redirect = useLocation({ select: (location) => location.href })
  const hydrated = useHydrated()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const create = async () => {
    setPending(true)
    setError(null)
    try {
      const { id } = await createQuizNote({ data: { quizId } })
      await navigate({
        to: '/quiz/$quizId/notes/$noteId',
        params: { quizId, noteId: id },
      })
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Something went wrong.')
      setPending(false)
    }
  }

  const atLimit = notes !== null && !canAddNote(notes.length)

  return (
    <section className="mt-10" aria-labelledby="notes">
      <div className="flex items-end justify-between gap-3">
        <h2 id="notes" className="text-lg font-semibold">
          Notes
        </h2>
        {notes !== null ? (
          <Button
            variant="outline"
            disabled={pending || atLimit}
            onClick={() => void create()}
          >
            <PlusIcon data-icon="inline-start" />
            New note
          </Button>
        ) : null}
      </div>
      {notes === null ? (
        <p className="mt-1 text-sm text-muted-foreground">
          <Link
            to="/login"
            search={{ redirect }}
            className="font-medium text-foreground underline underline-offset-4"
          >
            Sign in
          </Link>{' '}
          to keep notes on this quiz.
        </p>
      ) : notes.length === 0 ? (
        <p className="mt-3 rounded-lg border border-dashed px-4 py-6 text-center text-sm text-muted-foreground">
          No notes yet. Keep what you want to remember about this quiz, with
          links and images. Only you can see them.
        </p>
      ) : (
        <ul className="mt-3 divide-y overflow-hidden rounded-lg border bg-card">
          {notes.map((note) => (
            <li key={note.id}>
              <Link
                to="/quiz/$quizId/notes/$noteId"
                params={{ quizId, noteId: note.id }}
                className="flex flex-col gap-0.5 px-4 py-3 transition-colors hover:bg-muted focus-visible:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-inset sm:flex-row sm:items-center sm:justify-between sm:gap-4"
              >
                <span className="min-w-0 truncate font-medium">
                  {note.title}
                </span>
                <span className="shrink-0 text-sm text-muted-foreground">
                  {hydrated ? (
                    <time dateTime={note.updatedAt}>
                      Edited {dateFormat.format(new Date(note.updatedAt))}
                    </time>
                  ) : null}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
      {atLimit ? (
        <p className="mt-2 text-sm text-muted-foreground">
          You can keep at most {MAX_NOTES_PER_QUIZ} notes on a quiz. Delete one
          to add another.
        </p>
      ) : null}
      {error ? (
        <p role="alert" className="mt-2 text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </section>
  )
}

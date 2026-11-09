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

  return (
    <section className="mt-10">
      <h2 className="text-lg font-semibold">Notes</h2>
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
      ) : (
        <>
          <p className="mt-1 text-sm text-muted-foreground">
            Your own notes on this quiz, with links and images. Only you can see
            them.
          </p>
          {notes.length > 0 ? (
            <ul className="mt-3 flex flex-col gap-2">
              {notes.map((note) => (
                <li key={note.id}>
                  <Link
                    to="/quiz/$quizId/notes/$noteId"
                    params={{ quizId, noteId: note.id }}
                    className="flex flex-col gap-0.5 rounded-lg border bg-card px-4 py-3 transition-colors hover:border-ring sm:flex-row sm:items-center sm:justify-between sm:gap-4"
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
          ) : null}
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              disabled={pending || !canAddNote(notes.length)}
              onClick={() => void create()}
            >
              <PlusIcon data-icon="inline-start" />
              New note
            </Button>
            {!canAddNote(notes.length) ? (
              <span className="text-sm text-muted-foreground">
                You can keep at most {MAX_NOTES_PER_QUIZ} notes on a quiz.
              </span>
            ) : null}
          </div>
          {error ? (
            <p role="alert" className="mt-2 text-sm text-destructive">
              {error}
            </p>
          ) : null}
        </>
      )}
    </section>
  )
}

import { useState } from 'react'
import {
  Link,
  useLocation,
  useNavigate,
  useRouter,
} from '@tanstack/react-router'
import { Button } from '#/components/ui/button'
import type { Listing } from '#/lib/marketplace-api'
import { importQuiz, publishQuiz } from '#/lib/marketplace-api'
import { useSignedIn } from '#/lib/user-data'

/**
 * What the user can do with a listing: import it (or open their copy), sign
 * in to import it, or unpublish it when it is their own.
 */
export function ListingActions({ listing }: { listing: Listing }) {
  const signedIn = useSignedIn()
  const router = useRouter()
  const navigate = useNavigate()
  const redirect = useLocation({ select: (location) => location.href })
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function run(action: () => Promise<void>) {
    setPending(true)
    setError(null)
    try {
      await action()
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Something went wrong.')
    } finally {
      setPending(false)
    }
  }

  let action
  if (listing.yours) {
    action = (
      <Button
        variant="outline"
        disabled={pending}
        onClick={() =>
          void run(async () => {
            await publishQuiz({
              data: { quizId: listing.id, published: false },
            })
            await router.invalidate()
          })
        }
      >
        Unpublish
      </Button>
    )
  } else if (listing.yourCopyId) {
    action = (
      <Button
        variant="outline"
        nativeButton={false}
        render={
          <Link to="/quiz/$quizId" params={{ quizId: listing.yourCopyId }} />
        }
      >
        Open your copy
      </Button>
    )
  } else if (!signedIn) {
    action = (
      <Button
        variant="outline"
        nativeButton={false}
        render={<Link to="/login" search={{ redirect }} />}
      >
        Sign in to import
      </Button>
    )
  } else {
    action = (
      <Button
        disabled={pending}
        onClick={() =>
          void run(async () => {
            const copy = await importQuiz({ data: { quizId: listing.id } })
            await navigate({
              to: '/quiz/$quizId',
              params: { quizId: copy.id },
            })
          })
        }
      >
        Import
      </Button>
    )
  }

  return (
    <div className="flex flex-col items-start gap-2">
      {action}
      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  )
}

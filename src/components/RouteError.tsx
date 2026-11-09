import { useEffect, useState } from 'react'
import { Link, useRouter } from '@tanstack/react-router'
import type { ErrorComponentProps } from '@tanstack/react-router'
import { Button } from '#/components/ui/button'

/**
 * Any page that failed to load or render (e.g. the server could not be
 * reached). Try again re-runs the page's loaders, which also clears the
 * error; `reset` alone would show the same failed data again. The error
 * itself is logged, not shown: it may be a server detail.
 */
export function RouteError({ error }: ErrorComponentProps) {
  const router = useRouter()
  const [retrying, setRetrying] = useState(false)

  useEffect(() => {
    console.error(error)
  }, [error])

  const retry = async () => {
    setRetrying(true)
    try {
      await router.invalidate()
    } finally {
      setRetrying(false)
    }
  }

  return (
    <div className="py-16 text-center">
      <h1 className="text-2xl font-bold">Something went wrong</h1>
      <p className="mt-2 text-muted-foreground">
        This page could not be loaded. Check your connection and try again.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Button disabled={retrying} onClick={() => void retry()}>
          Try again
        </Button>
        <Button variant="outline" nativeButton={false} render={<Link to="/" />}>
          Back to quizzes
        </Button>
      </div>
    </div>
  )
}

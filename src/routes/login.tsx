import { useState } from 'react'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { Button } from '#/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import { FieldError } from '#/components/ui/field'
import { authClient } from '#/lib/auth-client'
import { pageTitle } from '#/lib/page-title'

const SAME_SITE = 'http://same-site.invalid'

/**
 * Only a path on this site, so the link can't send anyone elsewhere. Parsed
 * the way a browser would (which also strips tabs and newlines, turning e.g.
 * "/\t/evil.example" into "//evil.example"), then rebuilt from its path.
 */
function safeRedirect(value: unknown): string | undefined {
  if (typeof value !== 'string' || !value.startsWith('/')) return undefined
  let url: URL
  try {
    url = new URL(value, SAME_SITE)
  } catch {
    return undefined
  }
  if (url.origin !== SAME_SITE) return undefined
  const path = `${url.pathname}${url.search}${url.hash}`
  // Dot segments can rebuild into a protocol-relative URL ("/.//evil" ->
  // "//evil"), which a browser would treat as another site.
  return /^[/\\]{2}/.test(path) ? undefined : path
}

export const Route = createFileRoute('/login')({
  // Where to go after signing in, e.g. the quiz page that sent the visitor here.
  validateSearch: (search: Record<string, unknown>): { redirect?: string } => ({
    redirect: safeRedirect(search.redirect),
  }),
  beforeLoad: ({ context, search }) => {
    if (context.user) throw redirect({ href: search.redirect ?? '/profile' })
  },
  head: () => ({ meta: [{ title: pageTitle('Sign in') }] }),
  component: LoginPage,
})

function LoginPage() {
  const { redirect: returnTo } = Route.useSearch()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function signInWithGoogle() {
    setPending(true)
    setError(null)
    // On success the browser leaves for Google, so pending stays true.
    const { error: signInError } = await authClient.signIn.social({
      provider: 'google',
      callbackURL: returnTo ?? '/profile',
      errorCallbackURL: '/login',
    })
    if (signInError) {
      setError(signInError.message ?? 'Could not start Google sign-in.')
      setPending(false)
    }
  }

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-6">
      <h1 className="text-3xl font-bold tracking-tight">Sign in</h1>
      <Card>
        <CardHeader>
          <CardTitle>Continue with Google</CardTitle>
          <CardDescription>
            Sign in to keep your results, flags and unfinished exams, and to
            save your API keys in your profile.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Button onClick={signInWithGoogle} disabled={pending}>
            {pending ? 'Redirecting to Google…' : 'Sign in with Google'}
          </Button>
          {error && <FieldError>{error}</FieldError>}
        </CardContent>
      </Card>
    </div>
  )
}

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

export const Route = createFileRoute('/login')({
  beforeLoad: ({ context }) => {
    if (context.user) throw redirect({ to: '/profile' })
  },
  head: () => ({ meta: [{ title: pageTitle('Sign in') }] }),
  component: LoginPage,
})

function LoginPage() {
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function signInWithGoogle() {
    setPending(true)
    setError(null)
    // On success the browser leaves for Google, so pending stays true.
    const { error: signInError } = await authClient.signIn.social({
      provider: 'google',
      callbackURL: '/profile',
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
            Sign in to save your API keys in your profile.
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

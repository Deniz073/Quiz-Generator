import { Link, useLocation } from '@tanstack/react-router'
import { InfoIcon } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '#/components/ui/alert'
import { useSignedIn } from '#/lib/user-data'

/** Tells visitors that nothing they do is kept until they sign in. */
export function SignInBanner({ className }: { className?: string }) {
  const signedIn = useSignedIn()
  const redirect = useLocation({ select: (location) => location.href })
  if (signedIn) return null
  return (
    <Alert className={className}>
      <InfoIcon />
      <AlertTitle>Sign in to keep track of your progress</AlertTitle>
      <AlertDescription>
        <p>
          Without an account, results, flags and unfinished exams are not saved.{' '}
          <Link
            to="/login"
            search={{ redirect }}
            className="font-medium text-foreground underline underline-offset-4"
          >
            Sign in
          </Link>
        </p>
      </AlertDescription>
    </Alert>
  )
}

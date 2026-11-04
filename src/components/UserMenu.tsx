import { useState } from 'react'
import { Link, useNavigate, useRouter } from '@tanstack/react-router'
import { Avatar, AvatarFallback, AvatarImage } from '#/components/ui/avatar'
import { ChevronDownIcon, LogOutIcon, UserIcon } from 'lucide-react'
import { Button } from '#/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '#/components/ui/dropdown-menu'
import { authClient } from '#/lib/auth-client'
import { clearQuizCache } from '#/lib/quiz-route'
import type { CurrentUser } from '#/lib/session'

/** Top-bar sign-in link, or an account menu with the profile link and sign-out. */
export function UserMenu({ user }: { user: CurrentUser | null }) {
  const router = useRouter()
  const navigate = useNavigate()
  const [pending, setPending] = useState(false)

  if (!user) {
    return (
      <Button
        variant="outline"
        nativeButton={false}
        render={<Link to="/login" />}
      >
        Sign in
      </Button>
    )
  }

  async function signOut() {
    setPending(true)
    const { error } = await authClient.signOut()
    setPending(false)
    if (error) {
      console.error('Sign-out failed', error)
      return
    }
    // Leave first (the profile page would redirect to /login), then re-run the
    // root beforeLoad so every route sees the signed-out state.
    clearQuizCache()
    await navigate({ to: '/' })
    await router.invalidate()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="ghost" aria-label={`Account: ${user.name}`} />}
      >
        <Avatar size="sm">
          {user.image && <AvatarImage src={user.image} alt="" />}
          <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <span className="hidden max-w-40 truncate sm:inline">{user.name}</span>
        <ChevronDownIcon data-icon="inline-end" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-48">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex flex-col">
            <span className="truncate font-medium text-foreground">
              {user.name}
            </span>
            <span className="truncate">{user.email}</span>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem render={<Link to="/profile" />}>
            <UserIcon />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onClick={signOut}
            disabled={pending}
          >
            <LogOutIcon />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

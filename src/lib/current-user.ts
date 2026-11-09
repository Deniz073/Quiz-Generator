import type { CurrentUser } from '#/lib/session-api'
import { getCurrentUser } from '#/lib/session-api'

/*
 * The signed-in user, for the root route's beforeLoad (which runs before
 * every navigation and every hover preload). The browser keeps a signed-in
 * user for a while instead of asking the server each time; the server
 * always asks.
 *
 * Safe to keep because the user only changes through a full page load
 * (signing in goes through the OAuth redirect) or through sign-out, which
 * forgets it. Signed out (null) is kept only briefly: it is also what a
 * failed session check returns, and a signed-in user must not look signed
 * out for long after a hiccup. A session that ends elsewhere (another tab,
 * or expiry) shows within SIGNED_IN_MS; until then the server functions
 * still refuse what needs it, as they check the session themselves.
 */

const SIGNED_IN_MS = 5 * 60_000
const SIGNED_OUT_MS = 30_000

let cached: { until: number; user: Promise<CurrentUser | null> } | undefined

export function loadCurrentUser(): Promise<CurrentUser | null> {
  if (typeof window === 'undefined') return getCurrentUser()
  if (cached && Date.now() < cached.until) return cached.user
  const user = getCurrentUser()
  // Until it answers, concurrent navigations share the request.
  const entry = { until: Date.now() + SIGNED_IN_MS, user }
  cached = entry
  user.then(
    (found) => {
      if (!found) entry.until = Date.now() + SIGNED_OUT_MS
    },
    () => {
      if (cached === entry) cached = undefined
    },
  )
  return user
}

/** On sign-out: the next navigation asks the server again. */
export function forgetCurrentUser(): void {
  cached = undefined
}

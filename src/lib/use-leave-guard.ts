import { useEffect } from 'react'
import { useBlocker } from '@tanstack/react-router'

// Always block while active; the blocker is disabled otherwise.
const alwaysBlock = () => true

/**
 * Warns before leaving a screen with unsaved work: in-app navigation is held
 * back (`blocked`, then `stay` or `leave`, for the caller to show a prompt),
 * reload and tab close get the browser's own dialog. Does nothing while
 * `active` is false.
 */
export function useLeaveGuard(active: boolean) {
  const blocker = useBlocker({
    shouldBlockFn: alwaysBlock,
    enableBeforeUnload: true,
    disabled: !active,
    withResolver: true,
  })

  useEffect(() => {
    // The work ended (or restarted) while the prompt was open: drop the
    // pending navigation.
    if (!active && blocker.status === 'blocked') blocker.reset()
  }, [active, blocker])

  return {
    blocked: blocker.status === 'blocked',
    stay: () => blocker.reset?.(),
    leave: () => blocker.proceed?.(),
  }
}

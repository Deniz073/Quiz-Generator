import { useEffect, useState } from 'react'
import {
  questionToolClasses,
  questionToolIdleClasses,
} from '#/lib/button-classes'

type Status =
  | { kind: 'copied' }
  /** Neither sharing nor the clipboard worked: show the link to copy by hand. */
  | { kind: 'failed'; url: string }

/** How long "Link copied" stays on the button. */
const COPIED_MS = 2000

interface Props {
  /** Site-relative path of the page to share, e.g. from `questionPath`. */
  path: string
  /** Shown by the share sheet's target app, e.g. the question text. */
  text: string
}

/**
 * Shares a link: the system share sheet on touch devices, where it is the
 * natural way to send something; otherwise (or if the share sheet isn't
 * available) the link is copied to the clipboard.
 */
export function ShareButton({ path, text }: Props) {
  const [status, setStatus] = useState<Status>()

  useEffect(() => {
    if (status?.kind !== 'copied') return
    const timer = setTimeout(() => setStatus(undefined), COPIED_MS)
    return () => clearTimeout(timer)
  }, [status])

  const share = async () => {
    const url = new URL(path, window.location.origin).href
    const touch = window.matchMedia('(pointer: coarse)').matches
    // navigator.share is undefined outside secure contexts and in some browsers.
    if (touch && typeof navigator.share === 'function') {
      try {
        await navigator.share({ text, url })
        return
      } catch (error) {
        // Closing the share sheet rejects with AbortError: nothing to report.
        if (error instanceof DOMException && error.name === 'AbortError') {
          return
        }
        // Any other failure (e.g. not allowed): fall back to copying.
      }
    }
    try {
      // Throws outside secure contexts (e.g. a phone on http://<LAN IP>), where
      // navigator.clipboard is undefined despite its type.
      await navigator.clipboard.writeText(url)
      setStatus({ kind: 'copied' })
    } catch {
      setStatus({ kind: 'failed', url })
    }
  }

  return (
    <div className="flex flex-col items-start">
      <button
        type="button"
        onClick={() => void share()}
        // Enter is a global hotkey in practice rounds ("check / next"); keep it
        // from hijacking this button, like the flag button next to it.
        onKeyDown={(event) => {
          if (event.key === 'Enter') event.stopPropagation()
        }}
        className={`${questionToolClasses} ${questionToolIdleClasses}`}
      >
        {status?.kind === 'copied' ? 'Link copied' : 'Share'}
      </button>
      {/* Always mounted: screen readers announce changes to an existing live region. */}
      <p
        role="status"
        className={`max-w-64 text-xs ${status?.kind === 'failed' ? 'mt-1' : ''}`}
      >
        {status?.kind === 'copied' ? (
          <span className="sr-only">Link copied to the clipboard.</span>
        ) : status?.kind === 'failed' ? (
          <span className="text-slate-600 dark:text-slate-400">
            Couldn&rsquo;t copy. Link:{' '}
            <span className="break-all select-all">{status.url}</span>
          </span>
        ) : null}
      </p>
    </div>
  )
}

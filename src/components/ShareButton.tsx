import { useEffect, useState } from 'react'
import { CheckIcon, Share2Icon } from 'lucide-react'
import { Button } from '#/components/ui/button'
import {
  questionToolClasses,
  questionToolIdleClasses,
} from '#/lib/button-classes'
import { keepNativeEnter } from '#/lib/focus'

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
  /** A small icon button, e.g. in a card's corner. */
  compact?: boolean
}

/**
 * Shares a link: the system share sheet on touch devices, where it is the
 * natural way to send something; otherwise (or if the share sheet isn't
 * available) the link is copied to the clipboard.
 */
export function ShareButton({ path, text, compact = false }: Props) {
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

  const copied = status?.kind === 'copied'
  return (
    <div className={compact ? 'relative' : 'flex flex-col items-start'}>
      {compact ? (
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => void share()}
          onKeyDown={keepNativeEnter}
          aria-label={copied ? 'Link copied' : 'Share this question'}
          title={copied ? 'Link copied' : 'Share this question'}
        >
          {copied ? <CheckIcon /> : <Share2Icon />}
        </Button>
      ) : (
        <button
          type="button"
          onClick={() => void share()}
          onKeyDown={keepNativeEnter}
          className={`${questionToolClasses} ${questionToolIdleClasses}`}
        >
          {copied ? 'Link copied' : 'Share'}
        </button>
      )}
      {/* Always mounted: screen readers announce changes to an existing live region. */}
      <p
        role="status"
        className={`max-w-64 text-xs ${status?.kind === 'failed' ? 'mt-1' : ''} ${compact && status?.kind === 'failed' ? 'absolute top-full right-0 z-10 w-64 rounded-md border bg-popover p-2 shadow-sm' : ''}`}
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

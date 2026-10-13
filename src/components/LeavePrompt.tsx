import { useEffect, useId, useRef } from 'react'
import { buttonClasses } from '#/lib/button-classes'

interface Props {
  title: string
  description: string
  stayLabel: string
  leaveLabel: string
  onStay: () => void
  onLeave: () => void
}

/**
 * Inline confirmation shown when in-app navigation is blocked mid-quiz (a
 * reload or tab close gets the browser's own prompt instead). Sticky, so it is
 * visible wherever the page is scrolled to.
 */
export function LeavePrompt({
  title,
  description,
  stayLabel,
  leaveLabel,
  onStay,
  onLeave,
}: Props) {
  const titleId = useId()
  return (
    <div
      role="alertdialog"
      aria-labelledby={titleId}
      className="sticky top-2 z-10 mb-6 rounded-lg border border-amber-500 bg-amber-50 p-4 text-amber-950 shadow-md dark:bg-amber-950 dark:text-amber-50"
    >
      <p id={titleId} className="font-semibold">
        {title}
      </p>
      <p className="mt-1 text-sm">{description}</p>
      <div className="mt-3 flex flex-col gap-3 sm:flex-row">
        <StayButton onClick={onStay}>{stayLabel}</StayButton>
        <button
          type="button"
          onClick={onLeave}
          className={buttonClasses('secondary')}
        >
          {leaveLabel}
        </button>
      </div>
    </div>
  )
}

/** Focused on mount: the safe choice, and keeps Enter from leaving by accident. */
function StayButton({
  onClick,
  children,
}: {
  onClick: () => void
  children: string
}) {
  const ref = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    ref.current?.focus()
  }, [])
  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      className={buttonClasses('primary')}
    >
      {children}
    </button>
  )
}

/**
 * Moves focus to a heading, e.g. after the control that was pressed has been
 * unmounted (focus would otherwise fall back to <body> and screen readers
 * would not notice the new content). Headings aren't focusable by default, so
 * it gets tabIndex -1 first. No scrolling: callers handle the scroll position.
 */
export function focusHeading(heading: Element | null | undefined) {
  if (!(heading instanceof HTMLElement)) return
  heading.tabIndex = -1
  heading.focus({ preventScroll: true })
}

/** True when nothing has focus, e.g. the focused button was just unmounted. */
export function isFocusLost() {
  return (
    document.activeElement === null || document.activeElement === document.body
  )
}

/**
 * Scrolls the element in only if part of it is outside the viewport, smoothly
 * unless the user prefers reduced motion. The element's `scroll-margin` keeps
 * it off the edge.
 */
export function scrollIntoViewIfNeeded(element: HTMLElement) {
  const reduceMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches
  element.scrollIntoView({
    block: 'nearest',
    behavior: reduceMotion ? 'auto' : 'smooth',
  })
}

/**
 * onKeyDown for a button inside a page with a global Enter hotkey (practice:
 * "check / next"): Enter stays this button's own, so keyboard users can
 * press it.
 */
export function keepNativeEnter(event: {
  key: string
  stopPropagation: () => void
}) {
  if (event.key === 'Enter') event.stopPropagation()
}

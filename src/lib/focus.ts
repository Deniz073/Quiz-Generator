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

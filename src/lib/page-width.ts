/*
 * Most pages use a narrow column; the quiz assistant needs the width for its
 * preview and chat side by side. Shared by the root layout (which width) and
 * the router (a view transition when the width changes, so the header glides
 * instead of jumping).
 */

export function isWidePage(pathname: string): boolean {
  return pathname.startsWith('/assistant/')
}

/** The view transition type for a navigation that changes the page width. */
export const WIDTH_CHANGE_TRANSITION = 'page-width'

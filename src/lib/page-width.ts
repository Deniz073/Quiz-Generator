/*
 * Most pages use a narrow column; the quiz assistant needs the width for its
 * preview and chat side by side. Shared by the root layout (which width) and
 * the router (a view transition when the width changes, so the header glides
 * instead of jumping).
 */

/*
 * The quiz assistant fills the viewport below the site header and the main
 * padding (see __root): the whole page on large screens, the chat panel on
 * small ones. Shared with its loading skeleton, so nothing moves.
 */
export const ASSISTANT_PAGE_HEIGHT = 'lg:h-[calc(100dvh-8.5rem)]'
export const ASSISTANT_PANEL_HEIGHT = 'h-[calc(100dvh-15rem)]'

export function isWidePage(pathname: string): boolean {
  return pathname.startsWith('/assistant/')
}

/** The view transition type for a navigation that changes the page width. */
export const WIDTH_CHANGE_TRANSITION = 'page-width'

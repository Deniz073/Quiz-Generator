import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import { RouteError } from './components/RouteError'
import { WIDTH_CHANGE_TRANSITION, isWidePage } from './lib/page-width'

export function getRouter() {
  const router = createTanStackRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
    // Revisiting a page (or opening a hover-preloaded one) waits for fresh
    // data instead of showing the cached copy first: after a change (a quiz
    // deleted, imported or saved, a note renamed) the old version never
    // flashes up. Cheap for quiz pages, whose quiz the browser caches
    // (#/lib/quiz-route).
    defaultStaleReloadMode: 'blocking',
    defaultErrorComponent: RouteError,
    // Only into and out of the quiz assistant: the page width changes there.
    defaultViewTransition: {
      types: ({ fromLocation, toLocation }) =>
        fromLocation &&
        isWidePage(fromLocation.pathname) !== isWidePage(toLocation.pathname)
          ? [WIDTH_CHANGE_TRANSITION]
          : false,
    },
  })

  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}

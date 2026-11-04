import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import { WIDTH_CHANGE_TRANSITION, isWidePage } from './lib/page-width'

export function getRouter() {
  const router = createTanStackRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
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

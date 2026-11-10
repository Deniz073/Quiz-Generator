/*
 * When a skeleton takes the place of data that is still loading. Not at
 * once: React keeps a skeleton that has been shown up for about 300 ms, so
 * data that arrives quickly would show later with a skeleton than without
 * one. Below this delay a navigation still feels immediate.
 *
 * Two places use it: the router, for the skeleton of a whole page (its
 * `defaultPendingMs`), and the loaders that return a promise for the page to
 * stream in (`settledSoon`).
 */
export const SKELETON_DELAY_MS = 150

/**
 * How long a loader holds its page back for data it could also stream in.
 * Shorter than the skeleton delay: the page has to be there before the
 * router would put a whole-page skeleton in front of it.
 */
const STREAM_WAIT_MS = 80

/** A promise as React's `use` (so the router's `<Await>`) reads it. */
type Tracked = Promise<unknown> & {
  status?: 'pending' | 'fulfilled' | 'rejected'
  value?: unknown
  reason?: unknown
}

/**
 * Records the outcome on the promise itself, where React looks first: an
 * `<Await>` of a promise that has settled then renders its content straight
 * away. Unmarked, React has to wait for it once, which shows the skeleton
 * (and keeps it up) for data that is already there.
 */
function track(promise: Tracked): Promise<void> {
  if (promise.status === undefined) promise.status = 'pending'
  return promise.then(
    (value) => {
      promise.status = 'fulfilled'
      promise.value = value
    },
    (reason: unknown) => {
      promise.status = 'rejected'
      promise.reason = reason
    },
  )
}

/**
 * For a loader that returns promises unawaited: waits until they have all
 * settled, but only briefly. Data that is quick is then on the page from
 * the start; slower data is streamed in behind its skeleton. Never rejects:
 * a failed promise is the page's to show (`<Await>` throws it).
 */
export function settledSoon(
  ...promises: Array<Promise<unknown> | null>
): Promise<void> {
  const settled = Promise.all(
    promises.map((promise) => (promise ? track(promise) : undefined)),
  )
  return new Promise((resolve) => {
    const timer = setTimeout(resolve, STREAM_WAIT_MS)
    void settled.then(() => {
      clearTimeout(timer)
      resolve()
    })
  })
}

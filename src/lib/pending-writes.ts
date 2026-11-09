/*
 * Saves to the server that are still under way, from any page (a note, an
 * exam, progress). Signing out first makes the open page save what it has
 * and waits for every save: one that arrives after the session is gone
 * would fail, and its change would be lost.
 */

const pending = new Set<Promise<unknown>>()
const flushers = new Set<() => unknown>()

/** Tracks a save until it settles; returns it unchanged. */
export function trackWrite<T>(write: Promise<T>): Promise<T> {
  pending.add(write)
  const done = () => {
    pending.delete(write)
  }
  write.then(done, done)
  return write
}

/**
 * Registers a page's "save now" (e.g. a debounced save that is waiting);
 * returns the unregister function, for an effect's cleanup.
 */
export function registerFlush(flush: () => unknown): () => void {
  flushers.add(flush)
  return () => {
    flushers.delete(flush)
  }
}

/** Saves what is waiting, then resolves once every save has settled. */
export async function settleWrites(): Promise<void> {
  for (const flush of flushers) flush()
  await Promise.allSettled([...pending])
}

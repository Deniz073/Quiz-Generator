/*
 * A read/subscribe/write wrapper around localStorage for useSyncExternalStore,
 * shared by the stores that keep JSON in a key (./progress, ./flags). Nothing
 * here throws: a missing or unreadable key reads as null, a failed write is
 * reported by its return value. The theme (./theme) is not built on this: its
 * value is derived from the system and applied to the document.
 */

function readRaw(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    // Unavailable (e.g. blocked storage) or on the server.
    return null
  }
}

interface Options<T, TServer> {
  /**
   * The keys `parse` reads, e.g. the current key and a legacy one. Another tab
   * changing any of them notifies subscribers.
   */
  keys: ReadonlyArray<string>
  /** Raw values in the order of `keys` (null where a key is missing). */
  parse: (raws: ReadonlyArray<string | null>) => T
  /** What the server (and the first client render) sees. */
  serverSnapshot: TServer
}

export function createBrowserStore<T, TServer = T>({
  keys,
  parse,
  serverSnapshot,
}: Options<T, TServer>) {
  const listeners = new Set<() => void>()
  let cached: { raws: ReadonlyArray<string | null>; value: T } | undefined

  function notify() {
    listeners.forEach((listener) => listener())
  }

  /** Another tab changed (or cleared) the data. */
  function onStorage(event: StorageEvent) {
    if (event.key === null || keys.includes(event.key)) notify()
  }

  return {
    /** Same object until a stored string changes, so React sees no new value. */
    getSnapshot(): T {
      const raws = keys.map(readRaw)
      if (!cached || raws.some((raw, i) => raw !== cached?.raws[i])) {
        cached = { raws, value: parse(raws) }
      }
      return cached.value
    },

    getServerSnapshot(): TServer {
      return serverSnapshot
    },

    subscribe(listener: () => void): () => void {
      if (listeners.size === 0) window.addEventListener('storage', onStorage)
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
        if (listeners.size === 0) {
          window.removeEventListener('storage', onStorage)
        }
      }
    },

    /** Saves `value` and notifies subscribers. False if it could not be saved. */
    write(key: string, value: string): boolean {
      try {
        localStorage.setItem(key, value)
      } catch (error) {
        console.warn(`Could not save ${key}`, error)
        return false
      }
      notify()
      return true
    },
  }
}

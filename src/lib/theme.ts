/*
 * Light/dark theme. Without a saved choice the page follows the system
 * (prefers-color-scheme, see the `dark` variant in styles.css). Choosing a
 * theme saves it in one versioned localStorage key and puts `light` or `dark`
 * on <html>, which wins over the system. Like progress.ts, nothing here
 * throws: reads fall back to "no choice", writes are best effort (the choice
 * then only lasts until the page is closed).
 */

import { STORAGE_KEYS } from '#/lib/storage-keys'

export type Theme = 'light' | 'dark'

const STORAGE_KEY = STORAGE_KEYS.theme
const DARK_QUERY = '(prefers-color-scheme: dark)'

/** Background colours of the two themes, for the theme-color meta tags. */
export const THEME_COLORS: Record<Theme, string> = {
  light: '#f8fafc',
  dark: '#020617',
}

/**
 * Runs in <head> before the first paint, so a saved choice doesn't flash the
 * system theme first. Mirrors readStored() and applyTheme() without the meta
 * tags: those are synced after hydration.
 */
export const THEME_INIT_SCRIPT = `try{var t=localStorage.getItem(${JSON.stringify(STORAGE_KEY)});if(t==='light'||t==='dark')document.documentElement.classList.add(t)}catch(e){}`

function readStored(): Theme | undefined {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    return value === 'light' || value === 'dark' ? value : undefined
  } catch {
    // Unavailable (e.g. blocked storage) or on the server.
    return undefined
  }
}

// Remembers a choice that couldn't be saved, so the toggle still works.
let unsavedChoice: Theme | undefined

/** The theme in effect: the choice if there is one, else the system's. */
export function getThemeSnapshot(): Theme {
  const chosen = unsavedChoice ?? readStored()
  if (chosen) return chosen
  return window.matchMedia(DARK_QUERY).matches ? 'dark' : 'light'
}

/** What the server (and the first client render) sees: not known yet. */
export function getServerThemeSnapshot(): Theme | undefined {
  return undefined
}

function applyTheme(theme: Theme | undefined) {
  const { classList } = document.documentElement
  classList.remove('light', 'dark')
  if (theme) classList.add(theme)
  // A choice colours both tags alike; without one each goes back to the
  // colour of the system theme it is qualified with.
  document.querySelectorAll('meta[name="theme-color"]').forEach((meta) => {
    const color =
      theme ?? (meta.getAttribute('media') === DARK_QUERY ? 'dark' : 'light')
    meta.setAttribute('content', THEME_COLORS[color])
  })
}

/** Brings <html> and the theme-color tags in line with the saved choice. */
export function applySavedTheme(): void {
  applyTheme(unsavedChoice ?? readStored())
}

export function setTheme(theme: Theme): void {
  applyTheme(theme)
  try {
    localStorage.setItem(STORAGE_KEY, theme)
    unsavedChoice = undefined
  } catch (error) {
    console.warn('Could not save the theme', error)
    unsavedChoice = theme
  }
  notify()
}

// --- Subscriptions -----------------------------------------------------------

const listeners = new Set<() => void>()

function notify() {
  listeners.forEach((listener) => listener())
}

/** Another tab changed (or cleared) the choice. */
function onStorage(event: StorageEvent) {
  if (event.key !== null && event.key !== STORAGE_KEY) return
  unsavedChoice = undefined
  applyTheme(readStored())
  notify()
}

/** The system theme changed; matters only while there is no choice. */
function onSystemChange() {
  notify()
}

export function subscribeTheme(listener: () => void): () => void {
  if (listeners.size === 0) {
    window.addEventListener('storage', onStorage)
    window.matchMedia(DARK_QUERY).addEventListener('change', onSystemChange)
  }
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
    if (listeners.size === 0) {
      window.removeEventListener('storage', onStorage)
      window
        .matchMedia(DARK_QUERY)
        .removeEventListener('change', onSystemChange)
    }
  }
}

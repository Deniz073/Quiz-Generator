/*
 * Light/dark theme, a preference of the device (not of the account). Without
 * a choice the page follows the system (prefers-color-scheme, see the `dark`
 * variant in styles.css). Choosing a theme saves it in a cookie and puts
 * `light` or `dark` on <html>, which wins over the system. The server reads
 * the cookie too, so the first paint already has the chosen theme.
 */

import { createIsomorphicFn } from '@tanstack/react-start'
import { getCookie } from '@tanstack/react-start/server'

export type Theme = 'light' | 'dark'

const COOKIE = 'quiz-generator-theme'
const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365
const DARK_QUERY = '(prefers-color-scheme: dark)'

/** Background colours of the two themes, for the theme-color meta tags. */
export const THEME_COLORS: Record<Theme, string> = {
  light: '#f8fafc',
  dark: '#020617',
}

function parseTheme(value: string | undefined): Theme | undefined {
  return value === 'light' || value === 'dark' ? value : undefined
}

function readCookie(): string | undefined {
  const prefix = `${COOKIE}=`
  return document.cookie
    .split('; ')
    .find((part) => part.startsWith(prefix))
    ?.slice(prefix.length)
}

/** The chosen theme, or undefined to follow the system. Server and client. */
export const getChosenTheme = createIsomorphicFn()
  .server((): Theme | undefined => parseTheme(getCookie(COOKIE)))
  .client((): Theme | undefined => parseTheme(readCookie()))

/** The theme in effect: the choice if there is one, else the system's. */
export function getThemeSnapshot(): Theme {
  const chosen = parseTheme(readCookie())
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

/** Brings the theme-color tags (and <html>) in line with the saved choice. */
export function applySavedTheme(): void {
  applyTheme(parseTheme(readCookie()))
}

export function setTheme(theme: Theme): void {
  document.cookie = `${COOKIE}=${theme}; Path=/; Max-Age=${ONE_YEAR_SECONDS}; SameSite=Lax`
  applyTheme(theme)
  notify()
}

// --- Subscriptions -----------------------------------------------------------

const listeners = new Set<() => void>()

function notify() {
  listeners.forEach((listener) => listener())
}

/** The system theme changed; matters only while there is no choice. */
function onSystemChange() {
  notify()
}

export function subscribeTheme(listener: () => void): () => void {
  if (listeners.size === 0) {
    window.matchMedia(DARK_QUERY).addEventListener('change', onSystemChange)
  }
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
    if (listeners.size === 0) {
      window
        .matchMedia(DARK_QUERY)
        .removeEventListener('change', onSystemChange)
    }
  }
}

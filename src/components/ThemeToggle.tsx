import { useEffect, useSyncExternalStore } from 'react'
import {
  applySavedTheme,
  getServerThemeSnapshot,
  getThemeSnapshot,
  setTheme,
  subscribeTheme,
} from '#/lib/theme'

const iconProps = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
} as const

/** Light/dark switch for the top bar. Shows the theme it switches to. */
export function ThemeToggle() {
  // Undefined on the server and during hydration, then the real theme.
  const theme = useSyncExternalStore(
    subscribeTheme,
    getThemeSnapshot,
    getServerThemeSnapshot,
  )

  // The inline script in <head> set the class before paint; this also syncs
  // the theme-color tags, which only exist in the document after hydration.
  useEffect(applySavedTheme, [])

  const next = theme === 'dark' ? 'light' : 'dark'

  return (
    <button
      type="button"
      onClick={() => {
        if (theme) setTheme(next)
      }}
      aria-label={theme ? `Switch to ${next} theme` : 'Switch theme'}
      className="-my-2 inline-flex h-10 w-10 items-center justify-center rounded-md text-slate-600 transition-colors hover:bg-slate-200/70 hover:text-slate-900 active:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100 dark:active:bg-slate-700"
    >
      {theme === 'dark' ? (
        <svg {...iconProps}>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
      ) : theme === 'light' ? (
        <svg {...iconProps}>
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      ) : null}
    </button>
  )
}

import {
  HeadContent,
  Link,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import { NotFound } from '#/components/NotFound'
import { ThemeToggle } from '#/components/ThemeToggle'
import { THEME_COLORS, THEME_INIT_SCRIPT } from '#/lib/theme'
import appCss from '../styles.css?url'

const TITLE = 'Quiz Generator'
const DESCRIPTION =
  'Practice quizzes chapter by chapter, study with explanations, or take a timed mock exam.'

// Link previews need an absolute image URL. Set VITE_SITE_URL (e.g.
// https://quiz.example.com) at build time; without it the path stays relative.
const SITE_URL = (import.meta.env.VITE_SITE_URL ?? '').replace(/\/+$/, '')
const OG_IMAGE = `${SITE_URL}/og.png`

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: TITLE,
      },
      { name: 'description', content: DESCRIPTION },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: TITLE },
      { property: 'og:title', content: TITLE },
      { property: 'og:description', content: DESCRIPTION },
      { property: 'og:image', content: OG_IMAGE },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:image:alt', content: TITLE },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
    links: [
      { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
      { rel: 'icon', href: '/favicon.ico', sizes: '32x32' },
      { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
    scripts: [{ children: THEME_INIT_SCRIPT }],
  }),
  shellComponent: RootDocument,
  notFoundComponent: () => <NotFound />,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    // The theme script adds a class to <html> before React hydrates.
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Not in head() meta: the router keeps only one tag per name. */}
        <meta
          name="theme-color"
          content={THEME_COLORS.light}
          media="(prefers-color-scheme: light)"
        />
        <meta
          name="theme-color"
          content={THEME_COLORS.dark}
          media="(prefers-color-scheme: dark)"
        />
        <HeadContent />
      </head>
      <body className="bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <a
          href="#main"
          className="sr-only rounded-md bg-sky-600 px-4 py-2 font-medium text-white focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-20"
        >
          Skip to main content
        </a>
        <header className="border-b border-slate-200 dark:border-slate-800">
          <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
            <Link
              to="/"
              className="-my-1 inline-block rounded-md py-1 text-lg font-bold tracking-tight transition-colors hover:text-sky-700 dark:hover:text-sky-400"
            >
              Quiz Generator
            </Link>
            <ThemeToggle />
          </div>
        </header>
        {/* tabIndex -1: the skip link moves focus here, not just the scroll position. */}
        <main
          id="main"
          tabIndex={-1}
          className="mx-auto max-w-3xl px-4 py-6 sm:py-10"
        >
          {children}
        </main>
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}

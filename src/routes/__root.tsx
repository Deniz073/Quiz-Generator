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
        title: 'Quiz Generator',
      },
    ],
    links: [
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
        <main className="mx-auto max-w-3xl px-4 py-6 sm:py-10">{children}</main>
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

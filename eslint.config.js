//  @ts-check

import { tanstackConfig } from '@tanstack/eslint-config'

export default [
  ...tanstackConfig,
  {
    rules: {
      'import/no-cycle': 'off',
      'import/order': 'off',
      'sort-imports': 'off',
      '@typescript-eslint/array-type': 'off',
      '@typescript-eslint/require-await': 'off',
      'pnpm/json-enforce-catalog': 'off',
    },
  },
  // The client/server seam: database, auth and #/server code must not reach
  // the browser. Only server-only modules and the server-function modules
  // (whose handler bodies TanStack Start strips from the client) may import
  // them. Types are fine anywhere (erased at build time).
  {
    files: ['src/**/*.{ts,tsx}'],
    ignores: [
      'src/server/**',
      'src/db/**',
      'src/lib/*-api.ts',
      'src/lib/session.ts',
      'src/lib/auth.ts',
      'src/routes/api/**',
    ],
    rules: {
      '@typescript-eslint/no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              // regex, not group: in gitignore syntax a leading # is a comment.
              regex: '^#/(db|server|lib/auth)(/|$)',
              allowTypeImports: true,
              message:
                'Server only: call it from a server function (src/lib/*-api.ts) instead.',
            },
          ],
        },
      ],
    },
  },
  // Domain rules are shared by client, server and the drizzle-kit schema
  // loader (which has no #/ alias): relative imports only.
  {
    files: ['src/domain/**/*.ts'],
    rules: {
      '@typescript-eslint/no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              regex: '^#/',
              message: 'Domain modules use relative imports only.',
            },
          ],
        },
      ],
    },
  },
  {
    ignores: [
      'eslint.config.js',
      'prettier.config.js',
      '.output/**',
      // Installed agent skills; their example files aren't part of the app.
      '.agents/**',
      '.claude/**',
    ],
  },
]

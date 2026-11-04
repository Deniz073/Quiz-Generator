# Quiz Generator

[![CI](https://github.com/Deniz073/Quiz-Generator/actions/workflows/ci.yml/badge.svg)](https://github.com/Deniz073/Quiz-Generator/actions/workflows/ci.yml)
[![Dependabot](https://img.shields.io/badge/dependabot-enabled-025E8C?logo=dependabot&logoColor=white)](.github/dependabot.yml)

A small multiple-choice quiz app (TanStack Start, React 19, Vite, TypeScript, Postgres with
Drizzle). Quizzes are split into chapters, with single- and multi-answer questions,
explanations, a results screen and a timed mock exam. PSM I and PSPO I are built in and
available to everyone; signing in (Google) keeps your results, flags and unfinished exams.
Users can publish their personal quizzes on the Marketplace, where anyone can preview them and
signed-in users can import a copy.
The built-in quizzes' content lives in `src/db/seed/quizzes/` and is written to the database by
`npm run db:seed`; personal quizzes live only in the database.

## Run

```bash
npm install
docker compose up -d   # local Postgres; set DATABASE_URL in .env (see compose.yaml)
npm run db:migrate
npm run db:seed        # writes the built-in quizzes
npm run dev      # http://localhost:3000
npm run build    # production build
npm run preview  # serve the production build
```

## Adding a quiz

A built-in quiz (available to everyone) is one new folder, `src/db/seed/quizzes/<quiz-id>/`,
plus one line in `src/db/seed/quizzes/index.ts`. `npm run db:seed` writes it to the database.

1. **Fork or clone** this repo and run `npm install`.
2. **Easy path: ask your AI coding agent** (Claude Code, Codex, Cursor, ...). Enabling its
   research mode is recommended for topic-based quizzes. You can also hand the agent source
   material: a `.pdf` or `.md` file (just hand it over, no need to add it to the repo) or a link
   to a page. Example prompt:

   > Add a quiz about `<topic>` based on `<path/to/material.pdf, path/to/notes.md or URL>`.
   > Use research mode, cover every chapter, include some multi-answer questions, and follow
   > AGENTS.md. Run the verify steps at the end.

   `AGENTS.md` (also loaded via `CLAUDE.md`) gives the agent the full rules: file layout, the
   skeleton, validation rules and content guidelines.

3. **Manual path:** create `src/db/seed/quizzes/<quiz-id>/index.ts` that default-exports a
   `Quiz` (types: [`src/quizzes/types.ts`](src/quizzes/types.ts), full example:
   [`src/db/seed/quizzes/pspo-1/`](src/db/seed/quizzes/pspo-1)), and add it to `seedQuizzes` in
   [`src/db/seed/quizzes/index.ts`](src/db/seed/quizzes/index.ts):

   ```ts
   import type { Quiz } from '#/quizzes/types'

   const quiz: Quiz = {
     id: 'my-quiz', // URL slug, use the folder name
     title: 'My Quiz',
     description: 'Shown on the home page.',
     chapters: [
       {
         id: '1-basics',
         number: 1,
         title: 'Basics',
         questions: [
           {
             id: '1-01', // slug, unique within the quiz; never change it later
             question: 'Which option is correct?',
             options: ['Right', 'Wrong 1', 'Wrong 2', 'Wrong 3'],
             correctIndex: 0,
             explanation: 'Why it is correct.',
           },
         ],
       },
     ],
   }

   export default quiz
   ```

   Multi-answer questions use `correctIndexes: [0, 1]` instead of `correctIndex`.

4. **Verify:**

   ```bash
   npx prettier --write src/db/seed/quizzes
   npx tsc --noEmit
   npm run lint
   npm run validate:quizzes   # checks ids, option counts, answer indexes, ...
   npm run db:seed            # writes it to the local database
   npm run dev                # see it on http://localhost:3000
   ```

5. **That's it.** A broken quiz fails fast, with the quiz/chapter/question location, in
   `npm run validate:quizzes` (which `npm run build` runs first, so it cannot be deployed) and in
   `npm run db:seed`, which then writes nothing.

## Scripts

| Command                    | What it does                               |
| -------------------------- | ------------------------------------------ |
| `npm run dev`              | Dev server on port 3000                    |
| `npm run build`            | Validate quizzes, then production build    |
| `npm run lint`             | ESLint                                     |
| `npm run check`            | Prettier check                             |
| `npm run format`           | Prettier write + ESLint fix                |
| `npm run validate:quizzes` | Validate the seed quizzes, print a summary |
| `npm run db:generate`      | New migration from schema changes          |
| `npm run db:migrate`       | Apply pending migrations                   |
| `npm run db:seed`          | Write the seed quizzes to the database     |

## Deploy

Includes a `vercel.json`; import the repo in Vercel and deploy (Nitro output). Migrations and
the seed run in the build command, before the new version is built:

```bash
if [ "$VERCEL_ENV" = "production" ]; then npm run db:migrate && npm run db:seed; fi && npm run build
```

Set `VITE_SITE_URL` (e.g. `https://quiz.example.com`) as a build-time env var so
the `og:image` link preview URL is absolute; without it the tag stays relative.

### Docker

```bash
docker build --build-arg VITE_SITE_URL=https://quiz.example.com -t quiz-generator .
docker run -d -p 3000:3000 quiz-generator
```

Multi-stage build; the final image only holds the Nitro output and runs as the
unprivileged `node` user. `PORT` (default `3000`) and `HOST` are read at runtime.

Optional extra hardening: add `--read-only --tmpfs /tmp --cap-drop ALL --security-opt no-new-privileges`
to `docker run`.

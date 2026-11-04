# AGENTS.md

Instructions for AI agents working on this repo. Most common task: **add a seed quiz**
(a built-in quiz).
Domain terms (built-in quiz, personal quiz, attempt, flag, ...) are defined in
[GLOSSARY.md](GLOSSARY.md); use them as written there.

## Adding a seed quiz

Quizzes live in Postgres. Seed quizzes are maintained as TypeScript in the repo
and written to the database by `npm run db:seed` (which runs after
`db:migrate` on every production deploy). Seed quizzes are always built-in
quizzes (no owner, available to everyone, also signed out). Personal quizzes
live only in the database and never in the repo.

Contract, two changes and nothing else:

1. Create a folder `src/db/seed/quizzes/<quiz-id>/` whose `index.ts` has an
   `export default` of a `Quiz` (types in `src/quizzes/types.ts`).
2. Import it and add it to `seedQuizzes` in `src/db/seed/quizzes/index.ts`.

**Do not modify anything else.** No routes, components or migrations change for
a new quiz.

Reference example: `src/db/seed/quizzes/pspo-1/` (one file per chapter, assembled in `index.ts`).

### Layout

```
src/db/seed/quizzes/<quiz-id>/
  index.ts          # default-exports the Quiz (required, must be index.ts)
  chapter-01.ts     # optional; recommended for larger quizzes
```

Small quiz: put chapters inline in `index.ts`. Larger quiz: one file per
chapter exporting a named `Chapter` (e.g. `export const chapter01: Chapter`),
imported and listed in `index.ts`, like pspo-1. Import the types with the
`#/quizzes/types` alias.

### Skeleton

```ts
import type { Quiz } from '#/quizzes/types'

const quiz: Quiz = {
  id: 'my-quiz', // slug; use the folder name
  title: 'My Quiz',
  description: 'One-sentence description shown on the home page.',
  // exam: { questionCount: 40, minutes: 60, passPercent: 70 }, // optional, see rules
  chapters: [
    {
      id: '1-basics', // slug, unique within the quiz
      number: 1,
      title: 'Basics',
      questions: [
        {
          id: '1-01', // slug, unique within the quiz; never change it later
          question: 'Which option is correct?',
          options: [
            'Right answer',
            'Plausible wrong 1',
            'Plausible wrong 2',
            'Plausible wrong 3',
          ],
          correctIndex: 0,
          explanation:
            'Why it is correct, and why the most tempting distractor is not.',
        },
        {
          id: '1-02',
          question: 'Which two options are correct? Select two.',
          options: ['Right A', 'Right B', 'Wrong 1', 'Wrong 2'],
          correctIndexes: [0, 1],
          explanation: 'Why A and B are correct and the others are not.',
        },
      ],
    },
  ],
}

export default quiz
```

### Rules enforced by the validator (`src/quizzes/validate.ts`)

Violations fail `npm run validate:quizzes` (which `npm run build` runs first) and `npm run db:seed` (which then writes nothing), listing quiz > chapter > question.

- Quiz `id` and chapter `id`s are URL-safe slugs (`a-z`, `0-9`, single hyphens). The quiz `id` is unique across all quizzes (use the folder name; the seed fails if a personal quiz already has it); chapter ids are unique within a quiz.
- Chapter ids `practice`, `exam`, `study` and `flagged` are reserved (they are routes: `/quiz/<id>/practice`, `/quiz/<id>/exam`, `/quiz/<id>/study`, `/quiz/<id>/flagged`).
- Chapter `number`s are unique whole numbers of 1 or more within a quiz.
- Every question has an `id`: a slug unique within the quiz. Convention: `<chapter number>-<two-digit index>`, e.g. `3-07`. The seed matches existing rows by it, and users' flags, attempts and unfinished exams hang off those rows, so when editing an existing quiz never change or reuse a question or chapter id (a changed id is a delete plus a new question: its flags are lost); give new questions a new one. Removing a question or chapter from a seed quiz deletes it, with its flags and attempts.
- `title`, `description`, `question`, `explanation` and every option are non-empty.
- Each quiz has at least one chapter; each chapter at least one question.
- 2-6 options per question (UI hotkeys cover 6); no duplicate option texts.
- `correctIndex` is an integer within `0..options.length-1`.
- `correctIndexes`: at least 2 unique, in-range entries, fewer than `options.length`. Never set both `correctIndex` and `correctIndexes`.
- Optional `exam: { questionCount, minutes, passPercent }` enables a timed "Mock exam" for the quiz: `questionCount` is an integer from 1 to the quiz's total questions, `minutes` an integer >= 1, `passPercent` an integer 1-100.
- `index.ts` must have a default export.

### Content guidelines

- 4 options is typical. Single-answer: exactly one correct option (`correctIndex`).
  Vary which position is correct across questions (it's shuffled at runtime, but
  all-`0` data is hard to review).
- Multi-answer (`correctIndexes`): state the count in the question text, e.g. "Select two." The UI also shows "Select N answers".
  Typical shapes: 2 of 4 or 2-3 of 5. Each correct option must be a distinct fact,
  not a paraphrase of another correct option, and every option must be
  unambiguously right or wrong (scoring is all-or-nothing).
- Distractors must be plausible, not jokes; avoid "all/none of the above".
- Explanation: 1-3 sentences on why the answer is correct and why the most tempting distractor is wrong.
- Option order does not matter (shuffled at runtime); don't refer to options by position or letter in the text.
- Base content on the material the user provides; don't invent facts. If the user
  only gives a topic, use well-established knowledge and avoid version-specific or
  time-sensitive claims (prices, limits, product names that change).

### Verify

```bash
npx prettier --write src/db/seed/quizzes
npx tsc --noEmit
npm run lint
npm run validate:quizzes   # prints a summary, or the errors (non-zero exit)
npm run db:seed            # optional, needs the local database: writes it
npm run dev                # optional: open http://localhost:3000 and try it
```

## Project notes

- TanStack Start (React 19, file routes), Vite, strict TypeScript, npm.
- Style: prettier, single quotes, no semicolons. Path alias `#/*` maps to `src/*`.
- Don't add new dependencies or tests unless asked.
- Data: Postgres with Drizzle (`src/db/`, relations v2). Schema changes go
  through `npm run db:generate` (new migration in `drizzle/`) and
  `npm run db:migrate`; never edit an applied migration, and keep every
  migration compatible with the app version still running (drop or rename
  columns in a later release). Local database: `docker compose up -d`.
- Tables: quiz content (`quiz`, `chapter`, `question`, `question_option`,
  see `src/db/quiz-schema.ts`) and user state (`quiz_attempt`,
  `question_flag`, `user_quiz_exam_settings`, `exam_session*`, see
  `src/db/progress-schema.ts`). The app keeps using the `Quiz` type of
  `src/quizzes/types.ts`; `src/server/quiz-access.ts` maps rows to it and back.
- Where code lives, by where it may run (enforced by ESLint
  `no-restricted-imports`):
  - `src/domain/`: pure rules shared by client and server: progress (attempts,
    best and last result), exam settings, and the mock exam rulebook (legal
    picks, scoring, deadline and grace). Relative imports only: the drizzle-kit
    schema loader imports from here without the `#/` alias.
  - `src/server/`: database and session access: `quiz-access` (the only
    module that knows the visibility rule), `user-state` (attempts, flags,
    exam settings), `exam-store` (unfinished exams; converts ids to slugs and
    option indexes). Never imported by client code, only by the modules below.
  - `src/lib/*-api.ts`: server functions, kept thin: validate the input, take
    the user from the session, ask `src/domain`, call `src/server`. Their
    handler bodies are stripped from the client, so they may import
    `src/server`; keep helpers inside the handlers, not at module level.
- Visibility: a built-in quiz (`owner_id` null) is visible to everyone, a
  personal quiz only to its owner; anything else is a 404. Server functions
  take the user from the session, never from the client.
- No localStorage. Signed-in users' progress, flags, exam settings and
  unfinished exams are in the database; on the client `src/lib/user-data.ts`
  caches them per quiz and `src/lib/exam-sync.ts` keeps an unfinished exam in
  step with the server (`useExam` only wires it to React). Visitors keep
  nothing. The theme is a cookie.
- Env: `DATABASE_URL`, Better Auth (`BETTER_AUTH_URL`, `BETTER_AUTH_SECRET`,
  Google client id/secret).
- UI: use shadcn/ui components where possible (`src/components/ui`, Base UI
  primitives, `lucide-react` icons; see `components.json`). Check what is
  installed first, add missing ones with `npx shadcn@latest add <component>`,
  and use the semantic theme tokens (`bg-primary`, `text-muted-foreground`, ...)
  instead of raw colours. Forms use shadcn `Field` components with
  react-hook-form and zod. Load the `shadcn` skill for component work.

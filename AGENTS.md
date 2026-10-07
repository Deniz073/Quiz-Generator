# AGENTS.md

Instructions for AI agents working on this repo. Most common task: **add a quiz**.

## Adding a quiz

Contract: create a new folder `src/quizzes/<quiz-id>/` whose `index.ts` has a
`export default` of a `Quiz` (types in `src/quizzes/types.ts`). That is the
**only** change. Quizzes are auto-discovered via `import.meta.glob`; there is no
registry, route or component to edit, and the quiz shows up on the home page.

**Do not modify anything outside your new folder.**

Reference example: `src/quizzes/az-900/` (one file per chapter, assembled in `index.ts`).

### Layout

```
src/quizzes/<quiz-id>/
  index.ts          # default-exports the Quiz (required, must be index.ts)
  chapter-01.ts     # optional; recommended for larger quizzes
```

Small quiz: put chapters inline in `index.ts`. Larger quiz: one file per
chapter exporting a named `Chapter` (e.g. `export const chapter01: Chapter`),
imported and listed in `index.ts`, like az-900. Use relative imports
(`../types`) or the `#/quizzes/types` alias.

### Skeleton

```ts
import type { Quiz } from '../types'

const quiz: Quiz = {
  id: 'my-quiz', // slug; match the folder name
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

Violations throw at app load and fail `npm run validate:quizzes`, listing quiz > chapter > question.

- Quiz `id` and chapter `id`s are URL-safe slugs (`a-z`, `0-9`, single hyphens). Quiz ids are unique across all quizzes; chapter ids unique within a quiz.
- Chapter ids `practice`, `exam`, `study` and `flagged` are reserved (they are routes: `/quiz/<id>/practice`, `/quiz/<id>/exam`, `/quiz/<id>/study`, `/quiz/<id>/flagged`).
- Chapter `number`s are unique integers within a quiz.
- Every question has an `id`: a slug unique within the quiz. Convention: `<chapter number>-<two-digit index>`, e.g. `3-07`. Saved flags refer to it, so when editing an existing quiz never change or reuse an id; give new questions a new one.
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
npx prettier --write src/quizzes/<quiz-id>
npx tsc --noEmit
npm run lint
npm run validate:quizzes   # prints a summary, or the errors (non-zero exit)
npm run dev                # optional: open http://localhost:3000 and try it
```

No route, registry or generated-file changes are needed: the folder is picked up
automatically (`import.meta.glob` in `src/quizzes/index.ts`).

## Project notes

- TanStack Start (React 19, file routes), Vite, strict TypeScript, npm.
- Style: prettier, single quotes, no semicolons. Path alias `#/*` maps to `src/*`.
- Don't add new dependencies or tests unless asked.

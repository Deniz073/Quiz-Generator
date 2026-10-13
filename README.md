# Quiz Generator

A small multiple-choice quiz app (TanStack Start, React 19, Vite, TypeScript). Quizzes are plain
TypeScript data, split into chapters, with single- and multi-answer questions, explanations and
a results screen. Ships with one example quiz: AZ-900 (`src/quizzes/az-900/`).

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run preview  # serve the production build
```

## Adding a quiz

Everything lives in one new folder, `src/quizzes/<quiz-id>/`. No registry, route or component
needs to change: quizzes are auto-discovered and appear on the home page.

1. **Fork or clone** this repo and run `npm install`.
2. **Easy path: ask your AI coding agent** (Claude Code, Codex, Cursor, ...):

   > Add a quiz based on `<file or topic>`. Follow AGENTS.md.

   `AGENTS.md` (also loaded via `CLAUDE.md`) gives the agent the full rules: file layout, the
   skeleton, validation rules and content guidelines.

3. **Manual path:** create `src/quizzes/<quiz-id>/index.ts` that default-exports a `Quiz`
   (types: [`src/quizzes/types.ts`](src/quizzes/types.ts), full example:
   [`src/quizzes/az-900/`](src/quizzes/az-900)):

   ```ts
   import type { Quiz } from '../types'

   const quiz: Quiz = {
     id: 'my-quiz', // URL slug, match the folder name
     title: 'My Quiz',
     description: 'Shown on the home page.',
     chapters: [
       {
         id: '1-basics',
         number: 1,
         title: 'Basics',
         questions: [
           {
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
   npx prettier --write src/quizzes/<quiz-id>
   npx tsc --noEmit
   npm run lint
   npm run validate:quizzes   # checks ids, option counts, answer indexes, ...
   npm run dev                # see it on http://localhost:3000
   ```

5. **That's it.** Nothing outside the new folder changes. A broken quiz fails fast, with the
   quiz/chapter/question location, both in `npm run validate:quizzes` and when the app loads.

## Architecture

There is no backend or database: quizzes are TypeScript data bundled into the app, and everything
the user produces (progress, flags, an unfinished mock exam, the theme) lives in the browser's
`localStorage`. Routes stay thin, game rules live in pure reducers, and a small set of stores keeps
the UI in step with storage.

```mermaid
flowchart LR
  subgraph author["Authoring (build time)"]
    folder["src/quizzes/&lt;quiz-id&gt;/index.ts<br/>export default Quiz"]
    glob["src/quizzes/index.ts<br/>import.meta.glob"]
    validate["validate.ts<br/>validateQuizzes()"]
    script["scripts/validate-quizzes.mjs<br/>npm run validate:quizzes"]
    folder --> glob --> validate
    script -. "loads via Vite" .-> glob
  end

  subgraph host["Host (Vercel, Nitro output)"]
    ssr["TanStack Start server<br/>SSR shell + route loaders<br/>(real 404 status)"]
  end

  subgraph browser["Browser"]
    app["React 19 app<br/>TanStack Router"]
    store[("localStorage<br/>progress, flags,<br/>exam session, theme")]
    app <--> store
  end

  validate -- "quiz registry<br/>in server + client bundle" --> ssr
  validate -- "quiz registry" --> app
  ssr -- "HTML + JS" --> app

  classDef authoring fill:#e8f1fc,stroke:#2a78d6,color:#1f2937
  classDef hosting fill:#fdeee7,stroke:#eb6834,color:#1f2937
  classDef client fill:#e7f6f0,stroke:#1baf7a,color:#1f2937
  class folder,glob,validate,script authoring
  class ssr hosting
  class app,store client
```

Layers, from routes down to storage (dependencies point downwards):

```mermaid
flowchart TB
  subgraph routes["Routes: src/routes"]
    r_all["index · quiz.$quizId.index · $chapterId · practice ·<br/>flagged · flagged_.review · study · exam<br/><i>validate params, pick a plan or mode</i>"]
  end

  subgraph components["Components: src/components"]
    c_runner["QuizRunner<br/><i>feedback after each answer</i>"]
    c_exam["ExamRunner<br/><i>timed, free navigation</i>"]
    c_deck["StudyDeck"]
    c_ui["QuestionCard · ResultsScreen · ExamReview ·<br/>LeavePrompt · DataBackup · ThemeToggle"]
  end

  subgraph hooks["Hooks: src/lib/use-*"]
    h_all["useExam · useFlags · useQuizProgress ·<br/>useLeaveGuard · useOptionHotkeys · useCountdown"]
  end

  subgraph domain["Domain logic: no React, no storage"]
    d_quiz["quiz-state<br/>quizReducer"]
    d_exam["exam-state<br/>examReducer"]
    d_plan["quiz-plan<br/>shuffle, option order"]
    d_q["quizzes/question<br/>isAnswerCorrect · togglePick"]
  end

  subgraph persist["Persistence: src/lib"]
    p_life["exam-lifecycle<br/>resume · persist"]
    p_stores["progress · flags<br/><i>via browser-store</i>"]
    p_direct["exam-session · theme · backup"]
    p_keys["storage-keys"]
  end

  subgraph data["Quiz data: src/quizzes"]
    q_reg["index.ts registry<br/>quizzes · getQuiz · getChapter"]
    q_val["validate.ts"]
    q_types["types.ts"]
    q_route["lib/quiz-route<br/>requireQuiz · requireChapter · requireExam"]
  end

  ls[("localStorage")]

  routes --> components
  routes --> q_route
  components --> hooks
  components --> domain
  components --> persist
  hooks --> domain
  hooks --> persist
  persist --> domain
  persist -- "migration, session lookup" --> q_reg
  persist --> ls
  q_route --> q_reg
  q_reg --> q_val --> q_types

  classDef routeC fill:#e8f1fc,stroke:#2a78d6,color:#1f2937
  classDef compC fill:#eeebfb,stroke:#6250d6,color:#1f2937
  classDef hookC fill:#e7f6f0,stroke:#1baf7a,color:#1f2937
  classDef domC fill:#fdeee7,stroke:#eb6834,color:#1f2937
  classDef persC fill:#e5f2e5,stroke:#008300,color:#1f2937
  classDef dataC fill:#f1f1ef,stroke:#52514e,color:#1f2937
  class r_all routeC
  class c_runner,c_exam,c_deck,c_ui compC
  class h_all hookC
  class d_quiz,d_exam,d_plan,d_q domC
  class p_life,p_stores,p_direct,p_keys persC
  class q_reg,q_val,q_types,q_route dataC
```

A chapter round, from answer to saved result:

```mermaid
sequenceDiagram
  actor U as User
  participant QR as QuizRunner
  participant RD as quizReducer
  participant FL as flags
  participant PR as progress
  participant ST as browser-store
  participant LS as localStorage

  QR->>RD: createInitialState(buildPlan(), round)
  loop each question
    U->>QR: pick option (click or hotkey 1-6)
    QR->>RD: toggle(originalIndex)
    alt single answer
      RD-->>QR: answer locked, feedback shown
    else multiple answers
      RD-->>QR: draft updated
      U->>QR: Enter (needs exactly N picks)
      QR->>RD: check
      RD-->>QR: answer locked, feedback shown
    end
    opt user flags the question
      QR->>FL: toggleFlag(quizId, question)
      FL->>ST: write(flags key, JSON)
      ST->>LS: setItem
      ST-->>QR: notify subscribers
    end
    U->>QR: Next
    QR->>RD: next
  end
  Note over QR: current >= plan.length, round finished
  alt full round
    QR->>PR: recordResult(quizId, chapterId, score, total)
    PR->>PR: withAttempt: keep best, set last
    PR->>ST: write(progress key, JSON)
    ST->>LS: setItem
    ST-->>QR: notify, chapter list shows the new result
  else subset round (retry incorrect)
    Note over QR,PR: nothing is saved
  end
  QR-->>U: ResultsScreen (retry, retry incorrect, next chapter)
```

More in [`docs/`](docs):

- [`docs/architecture.md`](docs/architecture.md): system overview, layers, routes and rendering
  modes, data model, persisted keys.
- [`docs/sequence-diagrams.md`](docs/sequence-diagrams.md): opening a page, chapter round, mock
  exam, flags, backup import and cross-tab sync.

## Scripts

| Command                    | What it does                             |
| -------------------------- | ---------------------------------------- |
| `npm run dev`              | Dev server on port 3000                  |
| `npm run build`            | Production build                         |
| `npm run lint`             | ESLint                                   |
| `npm run check`            | Prettier check                           |
| `npm run format`           | Prettier write + ESLint fix              |
| `npm run validate:quizzes` | Validate all quizzes and print a summary |

## Deploy

Includes a `vercel.json`; import the repo in Vercel and deploy (Nitro output).

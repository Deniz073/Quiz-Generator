# Architecture

Quiz Generator is a TanStack Start app (React 19, Vite, Nitro) with **no backend and no database**.
Quizzes are plain TypeScript data compiled into the bundle; everything the user produces (progress,
flags, an unfinished mock exam, the theme) lives in the browser's `localStorage`.

Diagrams are [Mermaid](https://mermaid.js.org/) and render on GitHub. For runtime flows see
[sequence-diagrams.md](./sequence-diagrams.md).

Contents: [System overview](#system-overview) · [Layers](#layers-and-dependencies) ·
[Routes](#routes-and-rendering) · [Data model](#data-model) · [Persisted data](#persisted-data)

## System overview

Quiz data is validated when the module graph loads, so a broken quiz fails the build, the dev
server, and `npm run validate:quizzes` with the same message. At runtime the server only renders
the shell and answers 404s; all quiz behaviour runs in the browser.

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

## Layers and dependencies

Dependencies point downwards. Routes stay thin: they validate params, pick a plan or a mode and
hand over to a runner component. Game rules live in pure reducers that know nothing about React or
storage; hooks and the persistence modules are the only places that touch the outside world.

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

Notes:

- **Finer-grained edges.** `quiz-state` and `exam-state` both use `quizzes/question` and
  `quiz-plan`; `exam-state` reuses `buildAnswers` from `quiz-state`. `exam-lifecycle` ties
  `exam-state`, `exam-session` and `progress` together. Every persistence module reads its key from
  `storage-keys`.
- **Two stores, one pattern.** `progress` and `flags` are built on `createBrowserStore`, which
  adapts `localStorage` to `useSyncExternalStore` (cached snapshot, cross-tab `storage` events).
  `exam-session`, `theme` and `backup` talk to `localStorage` directly because their needs differ
  (restoring against quiz data, applying a class to `<html>`, bulk replace).
- **Reducers are pure.** Randomness (`shuffle`, `Date.now()`) is resolved _before_ dispatch and
  passed into actions such as `retry` and `restart`, so state can be saved and restored. Building a
  plan (`quiz-plan`) is the one random step and runs on the client only.
- **`exam-lifecycle` is the glue** between the exam reducer, the saved session and recorded
  progress; `useExam` only adds React state and the clock.

## Routes and rendering

File-based routes (`src/routes`, generated tree in `src/routeTree.gen.ts`). Anything that shuffles
or reads `localStorage` uses `ssr: 'data-only'`: the loader still runs on the server (so unknown
ids return a real 404), but the component renders only in the browser, which avoids hydration
mismatches from `Math.random()`.

```mermaid
flowchart LR
  root["__root<br/>shell, header, theme init script"]

  root --> home["/<br/><b>full SSR</b><br/>quiz list, backup"]
  root --> quiz["/quiz/:quizId<br/><b>full SSR</b><br/>chapters + modes"]

  quiz --> chapter["/quiz/:quizId/:chapterId<br/><b>data-only</b><br/>chapter round"]
  quiz --> practice["/quiz/:quizId/practice?count=20|50|all<br/><b>data-only</b>"]
  quiz --> study["/quiz/:quizId/study?chapter&shuffle<br/><b>data-only</b>"]
  quiz --> flagged["/quiz/:quizId/flagged?chapter<br/><b>data-only</b>"]
  quiz --> exam["/quiz/:quizId/exam<br/><b>data-only</b><br/>404 unless quiz.exam is set"]
  quiz --> review["/quiz/:quizId/flagged/review<br/><b>full SSR</b><br/>read-only list"]

  classDef ssr fill:#e8f1fc,stroke:#2a78d6,color:#1f2937
  classDef client fill:#fdeee7,stroke:#eb6834,color:#1f2937
  class home,quiz,review ssr
  class chapter,practice,study,flagged,exam client
```

Legend: blue = server-rendered with client hydration; orange = loader on the server, component on
the client only. `practice`, `exam`, `study` and `flagged` are static segments that win over
`:chapterId`, which is why those four chapter ids are reserved (see `AGENTS.md`).

## Data model

```mermaid
classDiagram
  direction LR
  class Quiz {
    +string id
    +string title
    +string description
    +ExamConfig exam?
  }
  class Chapter {
    +string id
    +number number
    +string title
  }
  class Question {
    <<union>>
    +string id
    +string question
    +string[] options
    +string explanation
  }
  class SingleAnswerQuestion {
    +number correctIndex
  }
  class MultipleAnswerQuestion {
    +number[] correctIndexes
  }
  class ExamConfig {
    +number questionCount
    +number minutes
    +number passPercent
  }
  class PlannedQuestion {
    <<runtime>>
    +number[] optionOrder
    +ChapterRef chapter?
  }

  Quiz "1" *-- "1..*" Chapter
  Quiz "1" o-- "0..1" ExamConfig
  Chapter "1" *-- "1..*" Question
  Question <|-- SingleAnswerQuestion
  Question <|-- MultipleAnswerQuestion
  PlannedQuestion --> Question : wraps
```

`PlannedQuestion` exists only at runtime: `optionOrder[position]` is the _original_ option index
shown at that position, so correctness is always compared against original indexes and quiz data
is never mutated.

## Persisted data

Everything is in the user's browser; nothing leaves it. Key strings are a persisted contract: never
change one, bump the version suffix and migrate (see `src/lib/storage-keys.ts`).

| Key                                     | Owner             | Content                                        | In backup |
| --------------------------------------- | ----------------- | ---------------------------------------------- | --------- |
| `quiz-generator:progress:v1`            | `progress.ts`     | Best and last result per chapter and mock exam | yes       |
| `quiz-generator:flags:v2`               | `flags.ts`        | Flagged question ids per quiz                  | yes       |
| `quiz-generator:flags:v1`               | `flags.ts`        | Legacy question texts, read until a v2 exists  | yes       |
| `quiz-generator:exam-session:v1:<quiz>` | `exam-session.ts` | Unfinished mock exam (references, not content) | no        |
| `quiz-generator:theme:v1`               | `theme.ts`        | `light` or `dark` (bare string)                | no        |

An exam session stores `(chapterId, questionIndex, questionText, optionOrder)` per question. On
load it is resolved against the _current_ quiz data and discarded wholesale if anything no longer
lines up, so a deploy that edits a quiz can't resurrect stale questions.

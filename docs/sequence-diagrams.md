# Sequence diagrams

Runtime flows of the main features. Structure and module boundaries are in
[architecture.md](./architecture.md). Diagrams are [Mermaid](https://mermaid.js.org/) and render on
GitHub.

Contents: [Opening a quiz page](#1-opening-a-quiz-page) · [Chapter round](#2-chapter-round-with-immediate-feedback) ·
[Mock exam](#3-mock-exam) · [Flags, backup and cross-tab sync](#4-flags-backup-import-and-cross-tab-sync)

## 1. Opening a quiz page

What the server does versus the browser, for a route with `ssr: 'data-only'` (chapter, practice,
study, flagged, exam). Saved data is invisible to the server, so the first render shows none and
the stores fill in right after hydration.

```mermaid
sequenceDiagram
  actor U as User
  participant B as Browser
  participant S as Nitro server
  participant R as quiz-route
  participant Q as Quiz registry
  participant LS as localStorage

  U->>B: open /quiz/az-900/1-cloud-concepts
  B->>S: GET page
  S->>R: loader: requireChapter(quizId, chapterId)
  R->>Q: getQuiz / getChapter
  alt unknown quiz or chapter
    Q-->>R: undefined
    R-->>S: throw notFound()
    S-->>B: 404 + NotFound page
  else found
    Q-->>R: quiz, chapter
    S-->>B: HTML shell only (data-only: no component SSR)
    B->>B: hydrate, then render component on the client
    B->>B: QuizRunner init: buildShuffledPlan(questions)
    B->>LS: useFlags / useQuizProgress read via useSyncExternalStore
    LS-->>B: saved flags and progress (or empty if missing or corrupt)
  end
```

## 2. Chapter round with immediate feedback

The flow behind `QuizRunner`. All round state is a reducer; the only side effects are the flag
toggle and recording the result once when the round finishes. Retrying only the incorrect questions
starts a _subset_ round that is never recorded.

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

Leaving mid-round: `useLeaveGuard` holds in-app navigation behind a `LeavePrompt` and enables the
browser's `beforeunload` dialog, but only once at least one answer exists. Nothing is saved before
the end, so leaving discards the round.

## 3. Mock exam

Timed, no feedback, free navigation. Unlike a chapter round the exam is persisted on every change,
so a reload or accidental navigation can be resumed, and the deadline is a timestamp so a throttled
background tab stays accurate.

```mermaid
sequenceDiagram
  actor U as User
  participant ER as ExamRunner
  participant UE as useExam
  participant LC as exam-lifecycle
  participant SE as exam-session
  participant EX as examReducer
  participant PR as progress
  participant LS as localStorage

  U->>ER: open /quiz/:quizId/exam
  ER->>UE: useExam(quiz, exam)
  UE->>LC: resumeOrStart(quiz, exam, now)
  LC->>SE: loadExamSession(quiz)
  SE->>LS: getItem(exam-session key)
  LS-->>SE: raw session or null
  SE->>SE: resolve against current quiz data, discard if stale
  alt no valid session
    LC-->>UE: run: startExam (random plan, endsAt = now + minutes)
  else session with time left
    LC-->>UE: prompt: ExamResumePrompt, clock paused
    alt Resume
      U->>UE: resume()
    else Discard
      U->>UE: discard()
      UE->>LC: discardAndStart()
      LC->>SE: clearExamSession
    end
  else session past its deadline
    LC->>EX: submit saved picks
    LC-->>UE: run: already submitted
  end

  loop until submitted
    U->>ER: pick, navigate, flag, review
    ER->>EX: toggle / goto / next / flag / review
    UE->>LC: persistExam(quiz, state) on every change
    LC->>SE: saveExamSession
    SE->>LS: setItem
  end

  alt user submits
    U->>ER: Review and submit (confirms if questions are open)
    ER->>EX: submit
  else time runs out
    UE->>UE: useCountdown reaches 0
    UE->>EX: submit
  end

  UE->>LC: persistExam(state with submitted)
  LC->>SE: clearExamSession
  SE->>LS: removeItem
  LC->>PR: recordResult(quizId, exam, score, total) once per plan
  ER-->>U: ResultsScreen with pass or fail from passPercent
  opt Retry incorrect
    U->>ER: practice incorrect
    ER->>ER: render QuizRunner (mode subset, not recorded)
  end
```

## 4. Flags, backup import and cross-tab sync

`createBrowserStore` is the single mechanism that keeps components in step with `localStorage`:
local writes call `notify()`, other tabs are reached through the native `storage` event, and an
import dispatches a synthetic `storage` event with `key: null` ("everything changed").

```mermaid
sequenceDiagram
  actor U as User
  participant A as Tab A
  participant ST as browser-store (Tab A)
  participant LS as localStorage
  participant BK as backup
  participant T as Tab B

  Note over U,T: Flag a question
  U->>A: Flag for review
  A->>ST: write(flags key, JSON)
  ST->>LS: setItem
  ST-->>A: notify, useFlags re-renders
  LS-->>T: storage event (key = flags)
  T->>T: store notifies, useFlags re-renders

  Note over U,T: Import a backup
  U->>A: choose backup file
  A->>BK: parseBackup(text)
  alt not our format, wrong version or invalid JSON values
    BK-->>A: error message
  else valid
    BK-->>A: data
    A->>BK: importBackup(data)
    BK->>LS: snapshot previous backed-up keys
    BK->>LS: remove backed-up keys, set imported keys
    alt storage write fails midway
      BK->>LS: restore previous keys
      BK-->>A: rethrow, UI shows failure
    else success
      BK->>A: dispatch StorageEvent(key = null)
      A->>ST: stores re-read, subscribers notified
      LS-->>T: storage event
    end
  end
```

Device-local keys (theme, exam session) are neither exported nor touched by an import, so importing
a backup never interrupts a running exam or flips the theme.

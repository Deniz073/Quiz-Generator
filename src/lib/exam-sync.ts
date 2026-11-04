import type { ExamState } from '#/lib/exam-state'
import { toNewSession, toStoredState } from '#/lib/exam-lifecycle'
import {
  saveExamSession,
  startExamSession,
  submitExamSession,
} from '#/lib/exam-api'

/*
 * Keeping the server in step with a signed-in user's mock exam, without React:
 * a new exam is stored when it is first seen (the server sets the deadline),
 * every change is saved shortly after, one request at a time and in order, a
 * pending save can be sent at once (leaving the page), and a submitted exam is
 * sent once. ./use-exam feeds it every state and reacts to its events.
 */

/** How long a change waits before it is saved. */
const SAVE_DELAY_MS = 400

/** The server calls it needs (the real ones by default). */
export interface ExamTransport {
  start: (input: ReturnType<typeof toNewSession>) => Promise<{
    id: string
    startedAt: number
    endsAt: number
    serverNow: number
  }>
  save: (input: ReturnType<typeof toStoredState>) => Promise<boolean>
  submit: (
    input: ReturnType<typeof toStoredState>,
  ) => Promise<{ score: number; total: number } | null>
}

const serverTransport: ExamTransport = {
  start: (data) => startExamSession({ data }),
  save: (data) => saveExamSession({ data }),
  submit: (data) => submitExamSession({ data }),
}

export interface ExamSyncEvents {
  /** The server's start and deadline, on this device's clock. */
  onClock: (times: {
    plan: ExamState['plan']
    startedAt: number
    endsAt: number
  }) => void
  /** The server recorded the submitted exam with this score. */
  onRecorded: (result: { score: number; total: number }) => void
  /** Storing, saving or submitting failed: the exam may not be recorded. */
  onFailed: () => void
}

export interface ExamSync {
  /** Call with every state of the exam (also the first). */
  update: (state: ExamState) => void
  /** Sends a pending save now (e.g. when the page is left). */
  flush: () => void
}

/**
 * `resumed`: the stored exam the first state belongs to; without it the
 * first state is a new exam, stored on the first update.
 */
export function createExamSync(
  quizId: string,
  events: ExamSyncEvents,
  resumed?: { plan: ExamState['plan']; sessionId: string },
  transport: ExamTransport = serverTransport,
): ExamSync {
  let stored: { plan: ExamState['plan']; id: Promise<string | null> } | null =
    resumed
      ? { plan: resumed.plan, id: Promise.resolve(resumed.sessionId) }
      : null
  let queue: Promise<void> = Promise.resolve()
  let timer: ReturnType<typeof setTimeout> | undefined
  let pending: (() => void) | undefined
  const sent = new WeakSet<ExamState['plan']>()

  function enqueue(task: () => Promise<void>) {
    queue = queue.then(task).catch((error: unknown) => {
      console.error('Could not save the exam', error)
      events.onFailed()
    })
  }

  function flush() {
    clearTimeout(timer)
    const save = pending
    pending = undefined
    save?.()
  }

  function store(state: ExamState) {
    const id = transport
      .start(toNewSession(quizId, state))
      .then(({ id: sessionId, startedAt, endsAt, serverNow }) => {
        // How far the server's clock is ahead of this device's.
        const offset = serverNow - Date.now()
        events.onClock({
          plan: state.plan,
          startedAt: startedAt - offset,
          endsAt: endsAt - offset,
        })
        return sessionId
      })
      .catch((error: unknown) => {
        console.error('Could not save the exam', error)
        events.onFailed()
        return null
      })
    stored = { plan: state.plan, id }
  }

  function update(state: ExamState) {
    // A new exam (first state, or a restart) is stored once.
    if (stored?.plan !== state.plan) store(state)
    const current = stored
    if (!current) return
    clearTimeout(timer)
    pending = undefined

    if (state.submitted) {
      if (sent.has(state.plan)) return
      sent.add(state.plan)
      enqueue(async () => {
        const id = await current.id
        if (!id) return
        const result = await transport.submit(toStoredState(id, state))
        if (result) events.onRecorded(result)
        else events.onFailed()
      })
      return
    }

    pending = () =>
      enqueue(async () => {
        const id = await current.id
        if (!id) return
        // Gone (submitted or replaced in another tab, content changed) or
        // past the deadline: it is no longer kept, so stop claiming it is.
        if (!(await transport.save(toStoredState(id, state)))) {
          console.warn('The exam could no longer be saved.')
          events.onFailed()
        }
      })
    timer = setTimeout(flush, SAVE_DELAY_MS)
  }

  return { update, flush }
}

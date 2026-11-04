import { clientTools } from '@tanstack/ai-react'
import {
  addChapterDef,
  addQuestionsDef,
  getOutlineDef,
  readQuestionsDef,
  removeChapterDef,
  removeQuestionsDef,
  renameChapterDef,
  setMockExamDef,
  setQuizDetailsDef,
  updateQuestionDef,
} from '#/lib/assistant-tools'
import {
  addChapter,
  addQuestions,
  outline,
  readQuestions,
  removeChapter,
  removeQuestions,
  renameChapter,
  saveProblems,
  setDetails,
  setExam,
  updateQuestion,
} from '#/lib/working-copy'
import type { EditResult, WorkingCopy } from '#/lib/working-copy'

/*
 * The browser side of the quiz assistant's quiz tools: each one edits the
 * working copy in a small store, which the preview renders and the chat
 * connection reads (for the outline it sends with every request). Results go
 * back to the model: what changed, or why nothing did.
 */

export interface WorkingCopyStore {
  get: () => WorkingCopy
  set: (copy: WorkingCopy) => void
  subscribe: (listener: () => void) => () => void
}

export function createWorkingCopyStore(initial: WorkingCopy): WorkingCopyStore {
  let current = initial
  const listeners = new Set<() => void>()
  return {
    get: () => current,
    set: (copy) => {
      current = copy
      for (const listener of listeners) listener()
    },
    subscribe: (listener) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
  }
}

/** Shown to the model after each change: what still blocks a Save. */
function status(copy: WorkingCopy) {
  const problems = saveProblems(copy.quiz)
  return problems.length === 0
    ? { readyToSave: true }
    : {
        readyToSave: false,
        notReadyBecause: problems.slice(0, 5),
        ...(problems.length > 5 && { moreProblems: problems.length - 5 }),
      }
}

function apply<T extends object>(
  store: WorkingCopyStore,
  result: EditResult<T>,
): Record<string, unknown> {
  if (!result.ok) return { ok: false, error: result.error }
  const { ok, copy, ...rest } = result
  store.set(copy)
  return { ok, ...rest, ...status(copy) }
}

export function createQuizClientTools(store: WorkingCopyStore) {
  return clientTools(
    getOutlineDef.client(() => ({ outline: outline(store.get().quiz) })),
    readQuestionsDef.client((input) => ({
      questions: readQuestions(store.get().quiz, input),
    })),
    setQuizDetailsDef.client((input) =>
      apply(store, setDetails(store.get(), input)),
    ),
    setMockExamDef.client(({ exam }) =>
      apply(store, setExam(store.get(), exam)),
    ),
    addChapterDef.client(({ title }) =>
      apply(store, addChapter(store.get(), title)),
    ),
    renameChapterDef.client(({ chapterId, title }) =>
      apply(store, renameChapter(store.get(), chapterId, title)),
    ),
    removeChapterDef.client(({ chapterId }) =>
      apply(store, removeChapter(store.get(), chapterId)),
    ),
    addQuestionsDef.client(({ chapterId, questions }) =>
      apply(store, addQuestions(store.get(), chapterId, questions)),
    ),
    updateQuestionDef.client(({ questionId, ...patch }) =>
      apply(store, updateQuestion(store.get(), questionId, patch)),
    ),
    removeQuestionsDef.client(({ questionIds }) =>
      apply(store, removeQuestions(store.get(), questionIds)),
    ),
  )
}

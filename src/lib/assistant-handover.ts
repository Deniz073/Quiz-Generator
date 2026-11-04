import type { AssistantStart } from '#/lib/assistant-api'

/*
 * The first Save of a new quiz moves the quiz assistant from /assistant/new to
 * /assistant/<quiz id> without leaving the page: the conversation and the
 * working copy must survive. The page hands what it already knows to the
 * route here, so the route's loader returns at once (no loading skeleton) and
 * the route keeps the same component (no remount). Browser only; the server
 * never sees a handover and loads as usual.
 */

const handedOver = new Map<string, AssistantStart>()
const createdFromNew = new Set<string>()

/** Called by the page right before it navigates to the new quiz's id. */
export function handOverNewQuiz(quizId: string, start: AssistantStart): void {
  handedOver.set(quizId, start)
  createdFromNew.add(quizId)
}

/** The handed-over start for this quiz id, once. */
export function takeHandover(quizId: string): AssistantStart | undefined {
  const start = handedOver.get(quizId)
  handedOver.delete(quizId)
  return start
}

/**
 * What the page is for: the same for /assistant/new and the quiz it created,
 * so that move keeps the component; any other change of quiz remounts it.
 */
export function assistantPageKey(quizId: string): string {
  return createdFromNew.has(quizId) ? 'new' : quizId
}

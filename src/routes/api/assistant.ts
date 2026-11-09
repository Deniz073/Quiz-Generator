import {
  chatParamsFromRequestBody,
  toServerSentEventsResponse,
} from '@tanstack/ai'
import { createFileRoute } from '@tanstack/react-router'
import { createCsrfMiddleware } from '@tanstack/react-start'
import { z } from 'zod'
import { apiKeyProviderSchema } from '#/lib/api-keys-schema'
import { getDecryptedApiKey } from '#/server/api-key-store'
import { runQuizAssistant } from '#/server/quiz-assistant'
import { getRequestUserId } from '#/server/request-user'

/*
 * The quiz assistant's chat stream (AG-UI over server-sent events). Signed-in
 * users only, on their own API key for the chosen provider. Every user
 * message carries the working copy's outline at that moment; the model never
 * gets more of the quiz than that and what it asks the quiz tools for.
 */

const forwardedPropsSchema = z.object({
  provider: apiKeyProviderSchema,
})

function problem(status: number, message: string): Response {
  return Response.json({ error: message }, { status })
}

/**
 * The whole conversation comes with every request, so it may be large, but
 * not unbounded: read at most this much before giving up.
 */
const MAX_BODY_BYTES = 10 * 1024 * 1024

/** The JSON body; 'too-large', or null when it is not JSON. */
async function readJsonBody(request: Request): Promise<unknown> {
  if (Number(request.headers.get('content-length')) > MAX_BODY_BYTES) {
    return 'too-large'
  }
  if (!request.body) return null
  const reader = request.body.getReader()
  const decoder = new TextDecoder()
  let text = ''
  let size = 0
  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    size += value.byteLength
    if (size > MAX_BODY_BYTES) {
      await reader.cancel()
      return 'too-large'
    }
    text += decoder.decode(value, { stream: true })
  }
  try {
    return JSON.parse(text + decoder.decode())
  } catch {
    return null
  }
}

export const Route = createFileRoute('/api/assistant')({
  server: {
    // Same-origin requests only (by Sec-Fetch-Site, else Origin or Referer),
    // as Start does for server functions: the chat runs on the user's own
    // API key, so another site must not be able to start one.
    middleware: [createCsrfMiddleware()],
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        const userId = await getRequestUserId()
        if (!userId) return problem(401, 'Sign in to use the quiz assistant.')

        const body = await readJsonBody(request)
        if (body === 'too-large') {
          return problem(
            413,
            'This conversation is too long. Start a new chat to go on.',
          )
        }
        if (body === null) return problem(400, 'Invalid assistant request.')
        let params: Awaited<ReturnType<typeof chatParamsFromRequestBody>>
        try {
          params = await chatParamsFromRequestBody(body)
        } catch {
          return problem(400, 'Invalid assistant request.')
        }
        const props = forwardedPropsSchema.safeParse(params.forwardedProps)
        if (!props.success) return problem(400, 'Invalid assistant request.')

        const apiKey = await getDecryptedApiKey(userId, props.data.provider)
        if (!apiKey) {
          return problem(
            400,
            'No usable API key for this provider. Add one on your profile.',
          )
        }

        const abortController = new AbortController()
        request.signal.addEventListener('abort', () => abortController.abort())
        const stream = runQuizAssistant({
          provider: props.data.provider,
          apiKey,
          messages: params.messages,
          threadId: params.threadId,
          runId: params.runId,
          parentRunId: params.parentRunId,
          resume: params.resume,
          abortController,
        })
        return toServerSentEventsResponse(stream, { abortController })
      },
    },
  },
})

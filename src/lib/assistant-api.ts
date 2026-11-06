import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import type { ApiKeyProvider } from '#/lib/api-keys-schema'
import { API_KEY_PROVIDERS } from '#/lib/api-keys-schema'
import { idInput } from '#/lib/api-inputs'
import { QUIZ_LIMITS } from '#/quizzes/limits'
import type { Question, Quiz } from '#/quizzes/types'
import { MAX_OPTIONS } from '#/quizzes/validate'
import type { EditableQuiz, SaveOutcome } from '#/server/quiz-writer'
import { getApiKeysStatus } from '#/server/api-key-store'
import { findEditableQuiz, saveOwnQuiz } from '#/server/quiz-writer'
import { requireRequestUserId } from '#/server/request-user'

/*
 * The quiz assistant's server functions: what the assistant starts from, and
 * Save. The chat itself streams from /api/assistant. Every write takes the
 * user from the session; the working copy comes from the browser, so it is
 * untrusted input that Save checks against the quiz rules and size caps.
 */

export type { EditableQuiz, SaveOutcome }

export interface AssistantStart {
  /** Providers with a key that can be used now. */
  providers: Array<ApiKeyProvider>
  /** The quiz to edit; null for a new quiz. */
  editable: EditableQuiz | null
}

/** Null when the quiz isn't one of the user's own personal quizzes. */
export const fetchAssistantStart = createServerFn({ method: 'GET' })
  .validator(z.object({ quizId: idInput.nullable() }))
  .handler(async ({ data }): Promise<AssistantStart | null> => {
    const userId = await requireRequestUserId()
    const [keys, editable] = await Promise.all([
      getApiKeysStatus(userId),
      data.quizId ? findEditableQuiz(data.quizId, userId) : null,
    ])
    if (data.quizId && !editable) return null
    const providers = API_KEY_PROVIDERS.filter(
      (provider) => keys[provider].state === 'set',
    )
    return { providers, editable }
  })

const text = (max: number) => z.string().max(max)

const questionSchema = z.object({
  id: z.string().max(100),
  question: text(QUIZ_LIMITS.textLength),
  options: z.array(text(QUIZ_LIMITS.textLength)).max(MAX_OPTIONS),
  explanation: text(QUIZ_LIMITS.explanationLength),
  correctIndex: z.number().int().optional(),
  correctIndexes: z.array(z.number().int()).max(MAX_OPTIONS).optional(),
})

const quizSchema = z.object({
  id: z.string().max(200),
  title: text(QUIZ_LIMITS.textLength),
  description: text(QUIZ_LIMITS.textLength),
  chapters: z
    .array(
      z.object({
        id: z.string().max(100),
        number: z.number().int(),
        title: text(QUIZ_LIMITS.textLength),
        questions: z.array(questionSchema).max(QUIZ_LIMITS.questions),
      }),
    )
    .max(QUIZ_LIMITS.chapters),
  exam: z
    .object({
      questionCount: z.number().int(),
      minutes: z.number().int(),
      passPercent: z.number().int(),
    })
    .optional(),
})

/**
 * Exactly the fields of a `Quiz`, so the validator sees what will be stored.
 * The answer fields are passed on as given (none, one or both): the
 * validator, not this shape, decides whether they make a question.
 */
function toQuiz(input: z.infer<typeof quizSchema>): Quiz {
  return {
    id: input.id,
    title: input.title,
    description: input.description,
    chapters: input.chapters.map((c) => ({
      id: c.id,
      number: c.number,
      title: c.title,
      questions: c.questions.map(
        (q) =>
          ({
            id: q.id,
            question: q.question,
            options: q.options,
            explanation: q.explanation,
            ...(q.correctIndex !== undefined && {
              correctIndex: q.correctIndex,
            }),
            ...(q.correctIndexes !== undefined && {
              correctIndexes: q.correctIndexes,
            }),
          }) as Question,
      ),
    })),
    ...(input.exam && { exam: input.exam }),
  }
}

export const saveAssistantQuiz = createServerFn({ method: 'POST' })
  .validator(
    z.object({
      quiz: quizSchema,
      /** Null: a new quiz. */
      baseUpdatedAt: z.string().max(40).nullable(),
      confirmed: z.boolean(),
    }),
  )
  .handler(async ({ data }): Promise<SaveOutcome> => {
    const userId = await requireRequestUserId()
    return saveOwnQuiz(userId, toQuiz(data.quiz), {
      baseUpdatedAt: data.baseUpdatedAt,
      confirmed: data.confirmed,
    })
  })

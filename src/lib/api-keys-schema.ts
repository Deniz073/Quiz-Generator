import { z } from 'zod'

/** Shared by the profile form and the server function. No key format checks yet. */
export const apiKeysSchema = z.object({
  claudeApiKey: z.string().trim(),
  codexApiKey: z.string().trim(),
})

export type ApiKeys = z.infer<typeof apiKeysSchema>

import { z } from 'zod'
import { MAX_OPTIONS } from '#/quizzes/rules'

/** A quiz, chapter or question id (slug) as server functions accept it. */
export const idInput = z.string().min(1).max(200)

/** Mock exam settings; checked against the quiz by the rules, not here. */
export const examConfigInput = z.object({
  questionCount: z.number().int(),
  minutes: z.number().int(),
  passPercent: z.number().int(),
})

/** Original option indexes of one question: picks or a display order. */
export const optionIndexesInput = z
  .array(z.number().int().min(0))
  .max(MAX_OPTIONS)

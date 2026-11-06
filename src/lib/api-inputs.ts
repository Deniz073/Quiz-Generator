import { z } from 'zod'
import { MAX_OPTIONS } from '#/quizzes/validate'

/** A quiz, chapter or question id (slug) as server functions accept it. */
export const idInput = z.string().min(1).max(200)

/** Original option indexes of one question: picks or a display order. */
export const optionIndexesInput = z
  .array(z.number().int().min(0))
  .max(MAX_OPTIONS)

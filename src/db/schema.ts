import { authRelations } from './auth-schema'
import { progressRelations } from './progress-schema'
import { quizRelations } from './quiz-schema'

export * from './auth-schema'
export * from './user-settings-schema'
export * from './quiz-schema'
export * from './progress-schema'

// Combine relation parts here as more tables are added.
export const relations = {
  ...authRelations,
  ...quizRelations,
  ...progressRelations,
}

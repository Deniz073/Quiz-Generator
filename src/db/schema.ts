import { authRelations } from './auth-schema'
import { progressRelations } from './progress-schema'
import { quizRelations } from './quiz-schema'

export * from './auth-schema'
export * from './user-settings-schema'
export * from './quiz-schema'
export * from './progress-schema'

export const relations = {
  ...authRelations,
  ...quizRelations,
  ...progressRelations,
}

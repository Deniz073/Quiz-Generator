import { authRelations } from './auth-schema'

export * from './auth-schema'
export * from './user-settings-schema'

// Combine relation parts here as more tables are added.
export const relations = { ...authRelations }

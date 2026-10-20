/*
 * Every localStorage key the app uses, and which of them travel in a backup.
 * The strings are a persisted contract with data already saved in browsers:
 * never change one, bump the version suffix and migrate instead (see how
 * ./flags migrates v1 to v2 per quiz).
 */

const PREFIX = 'quiz-generator:'

export const STORAGE_KEYS = {
  /** ./progress */
  progress: `${PREFIX}progress:v1`,
  /** ./flags */
  flags: `${PREFIX}flags:v2`,
  /** ./flags, read once per quiz to fill in a missing v2 entry. */
  flagsLegacy: `${PREFIX}flags:v1`,
  /** ./exam-settings */
  examSettings: `${PREFIX}exam-settings:v1`,
  /** ./theme (a bare 'light' or 'dark', not JSON) */
  theme: `${PREFIX}theme:v1`,
} as const

const EXAM_SESSION_PREFIX = `${PREFIX}exam-session:v1:`

/** The unfinished mock exam of a quiz (./exam-session). */
export function examSessionKey(quizId: string): string {
  return `${EXAM_SESSION_PREFIX}${quizId}`
}

/**
 * Keys that belong to this browser: not exported, and left alone by an
 * import. The theme is a preference of the device, and an unfinished exam is
 * short-lived and runs against a deadline.
 */
const DEVICE_LOCAL_PREFIXES = [STORAGE_KEYS.theme, EXAM_SESSION_PREFIX]

function isAppKey(key: string): boolean {
  return key.startsWith(PREFIX)
}

export function isDeviceLocalKey(key: string): boolean {
  return DEVICE_LOCAL_PREFIXES.some((prefix) => key.startsWith(prefix))
}

/**
 * Keys that a backup carries: all the app's keys except the device-local
 * ones, so keys added later are included automatically.
 */
export function isBackedUpKey(key: string): boolean {
  return isAppKey(key) && !isDeviceLocalKey(key)
}

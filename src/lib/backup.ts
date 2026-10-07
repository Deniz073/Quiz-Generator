/*
 * Export and import of the saved data (progress, flags) as a JSON file, e.g. to
 * move it to another browser. Every localStorage key of the app is copied as
 * its raw string, so the stores (./progress, ./flags) keep doing their own
 * parsing and migration, and keys added later are included automatically.
 * Unfinished mock exams (./exam-session) are left out: they are short-lived
 * and run against a deadline.
 */

const KEY_PREFIX = 'quiz-generator:'
const EXCLUDED_PREFIX = 'quiz-generator:exam-session:'
const FORMAT = 'quiz-generator-backup'
const VERSION = 1

interface Backup {
  format: typeof FORMAT
  version: typeof VERSION
  exportedAt: string
  /** localStorage key to its raw stored string. */
  data: Record<string, string>
}

function isBackedUpKey(key: string): boolean {
  return key.startsWith(KEY_PREFIX) && !key.startsWith(EXCLUDED_PREFIX)
}

function readBackedUpData(): Record<string, string> {
  const data: Record<string, string> = {}
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key === null || !isBackedUpKey(key)) continue
    const value = localStorage.getItem(key)
    if (value !== null) data[key] = value
  }
  return data
}

/** Downloads the saved data as a JSON file. Throws if storage is unavailable. */
export function exportBackup(): void {
  const backup: Backup = {
    format: FORMAT,
    version: VERSION,
    exportedAt: new Date().toISOString(),
    data: readBackedUpData(),
  }
  const blob = new Blob([JSON.stringify(backup, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `quiz-generator-backup-${backup.exportedAt.slice(0, 10)}.json`
  link.click()
  URL.revokeObjectURL(url)
}

/** The backup's data, or an error message describing why the file is not usable. */
export function parseBackup(
  text: string,
): { data: Record<string, string> } | { error: string } {
  let backup: unknown
  try {
    backup = JSON.parse(text)
  } catch {
    return { error: 'The file is not valid JSON.' }
  }
  if (
    typeof backup !== 'object' ||
    backup === null ||
    !('format' in backup) ||
    backup.format !== FORMAT ||
    !('data' in backup) ||
    typeof backup.data !== 'object' ||
    backup.data === null ||
    Array.isArray(backup.data)
  ) {
    return { error: 'The file is not a Quiz Generator backup.' }
  }
  if (!('version' in backup) || backup.version !== VERSION) {
    return { error: 'The backup was made by an unsupported app version.' }
  }
  const entries = Object.entries(backup.data)
  const valid = entries.every(([key, value]) => {
    if (!isBackedUpKey(key) || typeof value !== 'string') return false
    try {
      JSON.parse(value)
      return true
    } catch {
      return false
    }
  })
  if (!valid) return { error: 'The backup contains invalid data.' }
  return { data: Object.fromEntries(entries) }
}

/**
 * Replaces the saved data with the backup's. All or nothing: if storage fails
 * midway the previous data is restored and the error is rethrown.
 */
export function importBackup(data: Record<string, string>): void {
  const previous = readBackedUpData()
  const write = (values: Record<string, string>) => {
    Object.keys(readBackedUpData()).forEach((key) =>
      localStorage.removeItem(key),
    )
    Object.entries(values).forEach(([key, value]) =>
      localStorage.setItem(key, value),
    )
  }
  try {
    write(data)
  } catch (error) {
    try {
      write(previous)
    } catch (restoreError) {
      console.error(
        'Could not restore data after a failed import',
        restoreError,
      )
    }
    throw error
  }
  // The stores only listen for changes from other tabs; key null = "everything".
  window.dispatchEvent(new StorageEvent('storage', { key: null }))
}

/*
 * Note rules: a signed-in user's own markdown pages about a quiz. Pure rules,
 * shared by the client (the editor and its toolbar), the server functions
 * (what to accept) and the schema (its checks): relative imports only.
 */

/** Notes one user may keep on one quiz. */
export const MAX_NOTES_PER_QUIZ = 100

/** Characters of markdown in one note. */
export const MAX_NOTE_LENGTH = 100_000

/** Characters in a note's title. */
export const MAX_NOTE_TITLE_LENGTH = 120

export const DEFAULT_NOTE_TITLE = 'Untitled note'

const LINK_PROTOCOLS: ReadonlyArray<string> = ['http:', 'https:', 'mailto:']

/** Protocols an image in a note may load from (https: no mixed content). */
const IMAGE_PROTOCOLS: ReadonlyArray<string> = ['https:']

function hasProtocol(url: string, protocols: ReadonlyArray<string>): boolean {
  if (url !== url.trim()) return false
  try {
    return protocols.includes(new URL(url).protocol)
  } catch {
    // Relative or malformed: only absolute URLs are allowed.
    return false
  }
}

/** An absolute http(s) or mailto URL. */
export function isAllowedLinkUrl(url: string): boolean {
  return hasProtocol(url, LINK_PROTOCOLS)
}

/** An absolute https URL. */
export function isAllowedImageUrl(url: string): boolean {
  return hasProtocol(url, IMAGE_PROTOCOLS)
}

/** The title as stored: trimmed. */
export function normalizeNoteTitle(title: string): string {
  return title.trim()
}

/** A title (already normalised) that may be stored. */
export function isValidNoteTitle(title: string): boolean {
  return title.length >= 1 && title.length <= MAX_NOTE_TITLE_LENGTH
}

export function isValidNoteLength(markdown: string): boolean {
  return markdown.length <= MAX_NOTE_LENGTH
}

export function canAddNote(existingCount: number): boolean {
  return existingCount < MAX_NOTES_PER_QUIZ
}

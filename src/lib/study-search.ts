/*
 * Search params of quiz pages: the study deck (a quiz's Study page and a
 * Marketplace preview) and the chapter scope of the flagged questions.
 */

/** A chapter id from the URL; a numeric-looking id like `1` arrives as a number. */
export function parseChapterParam(value: unknown): string | undefined {
  return typeof value === 'string' || typeof value === 'number'
    ? String(value)
    : undefined
}

export interface StudySearch {
  chapter?: string
  shuffle?: boolean
  showAnswers?: boolean
}

/**
 * Invalid or missing values fall back to all chapters, in order, answers
 * hidden. Booleans arrive typed (the router parses search values as JSON), so
 * `?shuffle=true` stays a clean URL. Defaults are left out of the returned
 * search entirely.
 */
export function validateStudySearch(
  search: Record<string, unknown>,
): StudySearch {
  const { chapter, shuffle, showAnswers } = search
  return {
    chapter: parseChapterParam(chapter),
    shuffle: shuffle === true || shuffle === 'true' ? true : undefined,
    showAnswers:
      showAnswers === true || showAnswers === 'true' ? true : undefined,
  }
}

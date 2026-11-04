/*
 * The search params of a study deck: a quiz's Study page and a Marketplace
 * preview.
 */

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
    // A numeric-looking chapter id like `1` is parsed as a number.
    chapter:
      typeof chapter === 'string' || typeof chapter === 'number'
        ? String(chapter)
        : undefined,
    shuffle: shuffle === true || shuffle === 'true' ? true : undefined,
    showAnswers:
      showAnswers === true || showAnswers === 'true' ? true : undefined,
  }
}

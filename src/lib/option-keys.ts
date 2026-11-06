import type { MAX_OPTIONS } from '#/quizzes/rules'

/**
 * Keys per display position: 1/A picks the first option shown, 2/B the
 * second. One per option a question may have.
 */
export const OPTION_KEYS = [
  { digit: '1', letter: 'A' },
  { digit: '2', letter: 'B' },
  { digit: '3', letter: 'C' },
  { digit: '4', letter: 'D' },
  { digit: '5', letter: 'E' },
  { digit: '6', letter: 'F' },
] as const satisfies { length: typeof MAX_OPTIONS }

/** Letter badge for the option at `position` (empty past the supported six). */
export function getOptionLetter(position: number): string {
  return OPTION_KEYS.at(position)?.letter ?? ''
}

/** Key range for the tip text, e.g. "1-4 or A-D". */
export function describeOptionKeys(optionCount: number): string {
  const last = Math.min(optionCount, OPTION_KEYS.length)
  return `1-${last} or A-${getOptionLetter(last - 1)}`
}

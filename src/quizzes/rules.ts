import type { ExamConfig } from './types'

/*
 * The hard rules of a quiz as values: what ids look like, how many options a
 * question has, and what a mock exam's settings may be. The validator
 * (./validate) reports against them; the database schema, the server
 * functions' input checks, the quiz assistant and the UI use them directly.
 */

/** Lowercase letters/digits separated by single hyphens, e.g. "1-cloud-basics". */
export const SLUG_PATTERN = '^[a-z0-9]+(-[a-z0-9]+)*$'

const SLUG = new RegExp(SLUG_PATTERN)

export function isSlug(value: unknown): boolean {
  return typeof value === 'string' && SLUG.test(value)
}

/** `text` as a slug of at most `maxLength` characters; empty if nothing is left. */
export function slugify(text: string, maxLength: number): string {
  return text
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, maxLength)
    .replace(/-+$/, '')
}

/** Static route segments that would shadow a chapter page of the same name. */
export const RESERVED_CHAPTER_IDS: ReadonlyArray<string> = [
  'practice',
  'exam',
  'study',
  'flagged',
]

/** The quiz UI has hotkeys for options 1-6 / A-F. */
export const MIN_OPTIONS = 2
export const MAX_OPTIONS = 6

/** The settings of a mock exam, in a fixed order. */
export const EXAM_SETTINGS = [
  'questionCount',
  'minutes',
  'passPercent',
] as const satisfies ReadonlyArray<keyof ExamConfig>

export const MAX_EXAM_MINUTES = 600

export interface Range {
  min: number
  max: number
}

/**
 * What each mock exam setting may be for a quiz with this many questions:
 * the quiz's own defaults and a user's adjustments alike.
 */
export function getExamLimits(
  totalQuestions: number,
): Record<keyof ExamConfig, Range> {
  return {
    questionCount: { min: 1, max: totalQuestions },
    minutes: { min: 1, max: MAX_EXAM_MINUTES },
    passPercent: { min: 1, max: 100 },
  }
}

export function isInRange(
  value: unknown,
  { min, max }: Range,
): value is number {
  return (
    typeof value === 'number' &&
    Number.isInteger(value) &&
    value >= min &&
    value <= max
  )
}

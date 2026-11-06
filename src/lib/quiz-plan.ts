import type { Chapter, Question, Quiz } from '#/quizzes/types'
import { isAnswerCorrect } from '#/quizzes/question'
import { shuffle } from './shuffle'

/** Where a question comes from; set for plans that mix several chapters. */
export type ChapterRef = Pick<Chapter, 'id' | 'number' | 'title'>

export function chapterRef(chapter: Chapter): ChapterRef {
  return { id: chapter.id, number: chapter.number, title: chapter.title }
}

/**
 * A question plus the display order of its options.
 * `optionOrder[position]` is the ORIGINAL index of the option shown at that
 * position, so correctness is always compared against original indexes.
 */
export interface PlannedQuestion {
  question: Question
  optionOrder: Array<number>
  /** Only set when the plan spans chapters (mixed practice, mock exam). */
  chapter?: ChapterRef
}

function plan(
  question: Question,
  chapter: ChapterRef | undefined,
): PlannedQuestion {
  return {
    question,
    optionOrder: shuffle(question.options.map((_, i) => i)),
    chapter,
  }
}

/** Sizes of a mixed practice round besides all questions. */
export const PRACTICE_SIZES = [20, 50] as const

/** Random question and option order. Call on the client only. */
export function buildShuffledPlan(
  questions: ReadonlyArray<Question>,
): Array<PlannedQuestion> {
  return shuffle(questions).map((question) => plan(question, undefined))
}

/**
 * Random draw of up to `limit` questions across all chapters of a quiz (all of
 * them when omitted), each tagged with its chapter. Call on the client only.
 */
export function buildQuizPlan(
  quiz: Quiz,
  limit = Infinity,
): Array<PlannedQuestion> {
  const all = quiz.chapters.flatMap((chapter) => {
    const ref = chapterRef(chapter)
    return chapter.questions.map((question) => ({ question, ref }))
  })
  return shuffle(all)
    .slice(0, limit)
    .map(({ question, ref }) => plan(question, ref))
}

/** Same questions in a new random order with freshly shuffled options. */
export function reshufflePlan(
  items: ReadonlyArray<PlannedQuestion>,
): Array<PlannedQuestion> {
  return shuffle(items).map(({ question, chapter }) => plan(question, chapter))
}

export interface Answer {
  /** Position in the plan. */
  index: number
  item: PlannedQuestion
  /** Original indexes of the options the user picked (empty if unanswered). */
  chosen: ReadonlyArray<number>
  correct: boolean
  flagged: boolean
}

/**
 * Scores `items[i]` against `picks[i]` (a missing pick is an empty, wrong
 * answer).
 */
export function buildAnswers(
  items: ReadonlyArray<PlannedQuestion>,
  picks: ReadonlyArray<ReadonlyArray<number>>,
  flagged: ReadonlyArray<number>,
): Array<Answer> {
  return items.map((item, index) => {
    const chosen = picks.at(index) ?? []
    return {
      index,
      item,
      chosen,
      correct: isAnswerCorrect(item.question, chosen),
      flagged: flagged.includes(index),
    }
  })
}

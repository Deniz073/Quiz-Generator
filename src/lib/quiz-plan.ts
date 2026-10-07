import type { Chapter, Question, Quiz } from '#/quizzes/types'
import { shuffle } from './shuffle'

/** Where a question comes from; set for plans that mix several chapters. */
export type ChapterRef = Pick<Chapter, 'id' | 'number' | 'title'>

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
    const ref: ChapterRef = {
      id: chapter.id,
      number: chapter.number,
      title: chapter.title,
    }
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

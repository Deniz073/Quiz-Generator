/*
 * Progress: the best and last attempt per chapter and per mock exam. Attempts
 * are stored in the database (quiz_attempt); best and last are derived from
 * them here, and only here: the server folds the stored attempts with
 * toQuizProgress, the client adds a new attempt with withProgress. Only
 * signed-in users have progress.
 *
 * Pure rules, shared by client and server: relative imports only.
 */

export interface Attempt {
  score: number
  total: number
  /** ISO timestamp of when the run finished. */
  at: string
}

export interface Result {
  /** Highest percentage; on a tie the most recent attempt. */
  best: Attempt
  last: Attempt
}

export interface QuizProgress {
  /** Keyed by chapter id (its slug). */
  chapters: Partial<Record<string, Result>>
  exam?: Result
}

export type ProgressTarget = { chapterId: string } | { exam: true }

export function toPercent(attempt: Pick<Attempt, 'score' | 'total'>): number {
  return attempt.total === 0
    ? 0
    : Math.round((attempt.score / attempt.total) * 100)
}

/** Whether `score` of `total` reaches the pass mark (a percentage). */
export function isPassed(
  score: number,
  total: number,
  passPercent: number,
): boolean {
  return score * 100 >= passPercent * total
}

/** e.g. "Best 12/14 (86%) · Last 10/14". */
export function formatResult({ best, last }: Result): string {
  return `Best ${best.score}/${best.total} (${toPercent(best)}%) · Last ${last.score}/${last.total}`
}

function isBetter(candidate: Attempt, current: Attempt): boolean {
  return candidate.score * current.total >= current.score * candidate.total
}

/** The result after `attempt`, the newest attempt. */
export function withAttempt(
  previous: Result | undefined,
  attempt: Attempt,
): Result {
  return {
    best:
      previous && !isBetter(attempt, previous.best) ? previous.best : attempt,
    last: attempt,
  }
}

/** The progress after `attempt` on `target`. */
export function withProgress(
  progress: QuizProgress,
  target: ProgressTarget,
  attempt: Attempt,
): QuizProgress {
  return 'exam' in target
    ? { ...progress, exam: withAttempt(progress.exam, attempt) }
    : {
        ...progress,
        chapters: {
          ...progress.chapters,
          [target.chapterId]: withAttempt(
            progress.chapters[target.chapterId],
            attempt,
          ),
        },
      }
}

/** A stored attempt: a chapter run (chapter id = its slug) or a mock exam. */
export interface RecordedAttempt extends Attempt {
  /** Null for a mock exam. */
  chapterId: string | null
}

/** Best and last per chapter and mock exam, from attempts in any order. */
export function toQuizProgress(
  attempts: ReadonlyArray<RecordedAttempt>,
): QuizProgress {
  return [...attempts]
    .sort((a, b) => Date.parse(a.at) - Date.parse(b.at))
    .reduce<QuizProgress>(
      (progress, { chapterId, score, total, at }) =>
        withProgress(
          progress,
          chapterId === null ? { exam: true } : { chapterId },
          { score, total, at },
        ),
      { chapters: {} },
    )
}

/** Whether a chapter run's result fits a chapter of this many questions. */
export function isValidChapterResult(
  score: number,
  total: number,
  chapterQuestionCount: number,
): boolean {
  return (
    Number.isInteger(score) &&
    total === chapterQuestionCount &&
    total >= 1 &&
    score >= 0 &&
    score <= total
  )
}

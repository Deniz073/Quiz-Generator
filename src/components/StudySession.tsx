import { StudyControls } from '#/components/StudyControls'
import { StudyDeck } from '#/components/StudyDeck'
import type { StudySearch } from '#/lib/study-search'
import type { Quiz } from '#/quizzes/types'

/**
 * The study controls and deck of a quiz, driven by the page's search params
 * (a quiz's Study page, a Marketplace preview). Client only: the deck
 * shuffles with Math.random, so its route uses `ssr: 'data-only'`.
 */
export function StudySession({
  quiz,
  search,
  onSearchChange,
  shareable = true,
}: {
  quiz: Quiz
  search: StudySearch
  /** Offer a link to each question (not in a Marketplace preview). */
  shareable?: boolean
  /** Merges into the current search; undefined drops a param. */
  onSearchChange: (next: StudySearch) => void
}) {
  // An unknown chapter id (e.g. a stale link) falls back to all chapters.
  const chapterId = quiz.chapters.some((c) => c.id === search.chapter)
    ? search.chapter
    : undefined
  const shuffled = search.shuffle === true
  // In the URL, not in the deck, so it survives a chapter or shuffle change.
  const showAll = search.showAnswers === true

  return (
    <>
      <StudyControls
        chapters={quiz.chapters}
        chapterId={chapterId}
        shuffled={shuffled}
        showAll={showAll}
        onChapterChange={(next) => onSearchChange({ chapter: next })}
        onShuffledChange={(next) =>
          // undefined drops the param, so the default stays out of the URL.
          onSearchChange({ shuffle: next ? true : undefined })
        }
        onShowAllChange={(next) =>
          onSearchChange({ showAnswers: next ? true : undefined })
        }
      />
      <div className="mt-4">
        {/* key restarts at card 1 when the chapter or shuffle changes. Not recorded in progress. */}
        <StudyDeck
          key={`${chapterId ?? 'all'}:${shuffled}`}
          quiz={quiz}
          chapterId={chapterId}
          shuffled={shuffled}
          showAll={showAll}
          shareable={shareable}
        />
      </div>
    </>
  )
}

import type { Chapter } from '#/quizzes/types'
import { formatChapter } from '#/lib/chapter-label'

const checkboxLabelClasses =
  'flex cursor-pointer items-center gap-2 py-1.5 text-sm font-medium'
const checkboxClasses =
  'h-4 w-4 accent-sky-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500'

interface Props {
  chapters: ReadonlyArray<Chapter>
  /** Selected chapter id, undefined for all chapters. */
  chapterId: string | undefined
  shuffled: boolean
  showAll: boolean
  onChapterChange: (chapterId: string | undefined) => void
  onShuffledChange: (shuffled: boolean) => void
  onShowAllChange: (showAll: boolean) => void
}

export function StudyControls({
  chapters,
  chapterId,
  shuffled,
  showAll,
  onChapterChange,
  onShuffledChange,
  onShowAllChange,
}: Props) {
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
      {/* A <select> is as wide as its longest option; on phones it takes the
          row and shrinks to fit instead of widening the page. */}
      <label className="flex w-full items-center gap-2 text-sm font-medium sm:w-auto">
        Chapter
        <select
          name="chapter"
          autoComplete="off"
          value={chapterId ?? ''}
          onChange={(event) => onChapterChange(event.target.value || undefined)}
          className="min-w-0 flex-1 rounded-lg border sm:flex-none border-slate-300 bg-white px-3 py-1.5 font-normal text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        >
          <option value="">All chapters</option>
          {chapters.map((chapter) => (
            <option key={chapter.id} value={chapter.id}>
              {formatChapter(chapter)}
            </option>
          ))}
        </select>
      </label>
      <label className={checkboxLabelClasses}>
        <input
          type="checkbox"
          name="shuffle"
          autoComplete="off"
          checked={shuffled}
          onChange={(event) => onShuffledChange(event.target.checked)}
          className={checkboxClasses}
        />
        Shuffle
      </label>
      <label className={checkboxLabelClasses}>
        <input
          type="checkbox"
          name="showAll"
          autoComplete="off"
          checked={showAll}
          onChange={(event) => onShowAllChange(event.target.checked)}
          className={checkboxClasses}
        />
        Show all answers
      </label>
    </div>
  )
}

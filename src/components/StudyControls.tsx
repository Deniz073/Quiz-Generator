import type { Chapter } from '#/quizzes/types'

const checkboxLabelClasses = 'flex items-center gap-2 text-sm font-medium'
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
      <label className="flex items-center gap-2 text-sm font-medium">
        Chapter
        <select
          value={chapterId ?? ''}
          onChange={(event) => onChapterChange(event.target.value || undefined)}
          className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 font-normal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 dark:border-slate-700 dark:bg-slate-900"
        >
          <option value="">All chapters</option>
          {chapters.map((chapter) => (
            <option key={chapter.id} value={chapter.id}>
              Chapter {chapter.number}: {chapter.title}
            </option>
          ))}
        </select>
      </label>
      <label className={checkboxLabelClasses}>
        <input
          type="checkbox"
          checked={shuffled}
          onChange={(event) => onShuffledChange(event.target.checked)}
          className={checkboxClasses}
        />
        Shuffle
      </label>
      <label className={checkboxLabelClasses}>
        <input
          type="checkbox"
          checked={showAll}
          onChange={(event) => onShowAllChange(event.target.checked)}
          className={checkboxClasses}
        />
        Show all answers
      </label>
    </div>
  )
}

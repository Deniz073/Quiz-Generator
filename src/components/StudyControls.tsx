import { EyeIcon, ShuffleIcon } from 'lucide-react'
import { Toggle } from '#/components/ui/toggle'
import { formatChapter } from '#/lib/chapter-label'
import type { Chapter } from '#/quizzes/types'

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
    <div className="flex items-center gap-2">
      {/* Native: a long chapter list scrolls and searches best in the
          platform's own picker. It shrinks to fit instead of widening the
          page on phones. */}
      <select
        name="chapter"
        aria-label="Chapter"
        autoComplete="off"
        value={chapterId ?? ''}
        onChange={(event) => onChapterChange(event.target.value || undefined)}
        className="h-8 min-w-0 flex-1 truncate rounded-lg border border-input bg-card px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 sm:max-w-80 sm:flex-none"
      >
        <option value="">All chapters</option>
        {chapters.map((chapter) => (
          <option key={chapter.id} value={chapter.id}>
            {formatChapter(chapter)}
          </option>
        ))}
      </select>
      <div className="ml-auto flex shrink-0 items-center gap-1">
        <Toggle
          variant="outline"
          pressed={shuffled}
          onPressedChange={onShuffledChange}
          aria-label="Shuffle"
        >
          <ShuffleIcon data-icon="inline-start" />
          <span className="max-sm:hidden">Shuffle</span>
        </Toggle>
        <Toggle
          variant="outline"
          pressed={showAll}
          onPressedChange={onShowAllChange}
          aria-label="Show all answers"
        >
          <EyeIcon data-icon="inline-start" />
          <span className="max-sm:hidden">Answers</span>
        </Toggle>
      </div>
    </div>
  )
}

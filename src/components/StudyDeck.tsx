import { useState } from 'react'
import { useHotkey } from '@tanstack/react-hotkeys'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { ShareButton } from '#/components/ShareButton'
import { Button } from '#/components/ui/button'
import { Kbd } from '#/components/ui/kbd'
import { Progress } from '#/components/ui/progress'
import { questionPath } from '#/lib/share'
import { formatChapter } from '#/lib/chapter-label'
import { shuffle } from '#/lib/shuffle'
import { StudyCard } from '#/components/StudyCard'
import type { Chapter, Question, Quiz } from '#/quizzes/types'

interface Card {
  chapter: Chapter
  question: Question
}

interface Props {
  quiz: Quiz
  /** Only this chapter's questions; undefined for all chapters. */
  chapterId: string | undefined
  /** Random order (drawn once per mount) instead of chapter order. */
  shuffled: boolean
  /** Keep every card's answer revealed. */
  showAll: boolean
  /** Offer a link to each question; only where its quiz page is reachable. */
  shareable?: boolean
}

// Focused controls keep their native Enter/Space action, so the reveal hotkey
// must not also fire for them.
const NATIVE_ACTIVATORS = 'a, button, input, select, textarea, summary'

function buildCards(
  quiz: Quiz,
  chapterId: string | undefined,
  shuffled: boolean,
): Array<Card> {
  const cards = quiz.chapters
    .filter((chapter) => chapterId === undefined || chapter.id === chapterId)
    .flatMap((chapter) =>
      chapter.questions.map((question) => ({ chapter, question })),
    )
  return shuffled ? shuffle(cards) : cards
}

/** Not scored and not saved: just stepping through cards. */
export function StudyDeck({
  quiz,
  chapterId,
  shuffled,
  showAll,
  shareable = true,
}: Props) {
  // The route renders on the client only (ssr: 'data-only'), so shuffling
  // during init can't cause a hydration mismatch. The parent keys this
  // component on chapter and shuffle, so changing either starts over.
  const [cards] = useState(() => buildCards(quiz, chapterId, shuffled))
  const [index, setIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)

  const card = cards.at(index)
  const isRevealed = showAll || revealed
  const isFirst = index === 0
  const isLast = index === cards.length - 1

  const goTo = (next: number) => {
    if (next < 0 || next >= cards.length) return
    setIndex(next)
    setRevealed(false)
  }

  // Hotkeys also work while a button is focused. Not in the chapter <select>:
  // single keys are ignored in form fields by default, so its arrows still
  // change the selection.
  useHotkey('ArrowLeft', () => goTo(index - 1), { enabled: !isFirst })
  useHotkey('ArrowRight', () => goTo(index + 1), { enabled: !isLast })

  // preventDefault stays off so a focused button, link or checkbox can still
  // activate natively. Only when nothing like that has focus is the key ours
  // (and Space must not scroll the page).
  const toggleReveal = (event: KeyboardEvent) => {
    const { target } = event
    if (target instanceof Element && target.closest(NATIVE_ACTIVATORS)) return
    event.preventDefault()
    setRevealed((value) => !value)
  }
  const revealOptions = {
    enabled: !showAll,
    preventDefault: false,
    stopPropagation: false,
    // Holding the key fires once, so it can't flicker the answer on and off.
    requireReset: true,
  }
  useHotkey('Space', toggleReveal, revealOptions)
  useHotkey('Enter', toggleReveal, revealOptions)

  if (!card) return null

  return (
    <div>
      {/* Live region: the focus stays on Previous/Next, so a card change is
          announced here, with the question. */}
      <p aria-live="polite" className="sr-only">
        Card {index + 1} of {cards.length}: {card.question.question}
      </p>
      <Progress
        value={((index + 1) / cards.length) * 100}
        aria-label={`Card ${index + 1} of ${cards.length}`}
      />

      <article className="mt-3 rounded-xl border bg-card p-5 text-card-foreground sm:p-8">
        <div className="-mt-1 mb-4 flex min-h-8 items-center justify-between gap-3 text-sm text-muted-foreground">
          <span className="truncate">{formatChapter(card.chapter)}</span>
          <span className="flex shrink-0 items-center gap-2">
            <span className="tabular-nums">
              {index + 1} of {cards.length}
            </span>
            {shareable ? (
              // key: a "Link copied" or failure note belongs to one card.
              <ShareButton
                key={card.question.id}
                compact
                path={questionPath(quiz.id, card.question.id)}
                text={card.question.question}
              />
            ) : null}
          </span>
        </div>
        <StudyCard question={card.question} revealed={isRevealed} />
      </article>

      <div className="mt-4 flex items-center justify-between gap-2">
        <Button
          variant="ghost"
          size="lg"
          disabled={isFirst}
          aria-keyshortcuts="ArrowLeft"
          title="Previous (←)"
          onClick={(event) => {
            goTo(index - 1)
            // A mouse click would leave focus here, and Space/Enter would then
            // press this button again instead of revealing the answer.
            if (event.detail > 0) event.currentTarget.blur()
          }}
        >
          <ChevronLeftIcon data-icon="inline-start" />
          <span className="max-sm:sr-only">Previous</span>
        </Button>
        {showAll ? null : (
          <Button
            size="lg"
            aria-keyshortcuts="Space"
            onClick={() => setRevealed((value) => !value)}
          >
            {revealed ? 'Hide answer' : 'Show answer'}
            <Kbd
              aria-hidden="true"
              className="bg-primary-foreground/15 text-primary-foreground max-sm:hidden"
            >
              Space
            </Kbd>
          </Button>
        )}
        <Button
          variant="ghost"
          size="lg"
          disabled={isLast}
          aria-keyshortcuts="ArrowRight"
          title="Next (→)"
          onClick={(event) => {
            goTo(index + 1)
            if (event.detail > 0) event.currentTarget.blur()
          }}
        >
          <span className="max-sm:sr-only">Next</span>
          <ChevronRightIcon data-icon="inline-end" />
        </Button>
      </div>
    </div>
  )
}

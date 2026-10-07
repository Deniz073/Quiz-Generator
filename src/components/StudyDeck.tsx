import { useState } from 'react'
import { useHotkey } from '@tanstack/react-hotkeys'
import { buttonClasses } from '#/lib/button-classes'
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
}

const navButtonClasses = `${buttonClasses('secondary')} disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent`

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
export function StudyDeck({ quiz, chapterId, shuffled, showAll }: Props) {
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
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 text-sm font-medium text-slate-600 dark:text-slate-400">
        <span>
          Card {index + 1} of {cards.length}
        </span>
        <span>
          Chapter {card.chapter.number}: {card.chapter.title}
        </span>
      </div>

      <div className="mt-6">
        <StudyCard question={card.question} revealed={isRevealed} />
      </div>

      <div className="mt-6 flex items-center justify-between gap-3">
        <button
          type="button"
          disabled={isFirst}
          onClick={(event) => {
            goTo(index - 1)
            // A mouse click would leave focus here, and Space/Enter would then
            // press this button again instead of revealing the answer.
            if (event.detail > 0) event.currentTarget.blur()
          }}
          className={navButtonClasses}
        >
          Previous
        </button>
        <button
          type="button"
          disabled={showAll}
          onClick={() => setRevealed((value) => !value)}
          className={buttonClasses('primary')}
        >
          {showAll ? 'Answers shown' : revealed ? 'Hide answer' : 'Show answer'}
        </button>
        <button
          type="button"
          disabled={isLast}
          onClick={(event) => {
            goTo(index + 1)
            if (event.detail > 0) event.currentTarget.blur()
          }}
          className={navButtonClasses}
        >
          Next
        </button>
      </div>
      <p className="mt-3 hidden text-center text-xs text-slate-500 sm:block">
        Tip: press &larr; or &rarr; to move, Space or Enter to show or hide the
        answer.
      </p>
    </div>
  )
}

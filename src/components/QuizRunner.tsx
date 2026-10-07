import { useReducer } from 'react'
import { useHotkey, useHotkeys } from '@tanstack/react-hotkeys'
import type { Chapter } from '#/quizzes/types'
import { OPTION_KEYS } from '#/lib/option-keys'
import { buildShuffledPlan } from '#/lib/quiz-plan'
import {
  canCheck,
  createInitialState,
  getAnswers,
  getCurrentItem,
  getScore,
  getSelected,
  isSubmitted,
  quizReducer,
} from '#/lib/quiz-state'
import { QuestionCard } from '#/components/QuestionCard'
import { ResultsScreen } from '#/components/ResultsScreen'

interface Props {
  quizId: string
  chapter: Chapter
  nextChapterId: string | undefined
}

export function QuizRunner({ quizId, chapter, nextChapterId }: Props) {
  // The route renders on the client only (ssr: 'data-only'), so shuffling
  // during init can't cause a hydration mismatch.
  const [state, dispatch] = useReducer(quizReducer, chapter.questions, (qs) =>
    createInitialState(buildShuffledPlan(qs)),
  )

  const item = getCurrentItem(state)
  const submitted = isSubmitted(state)

  // Enter checks a complete multi-answer selection, or moves on once answered.
  // requireReset: holding Enter fires once, so it can't submit and skip ahead.
  // While enabled, preventDefault (the default) stops the focused button from
  // also firing a native click. When disabled, Enter keeps its native meaning
  // (e.g. activating a focused option), so the reducer guards alone aren't enough.
  useHotkey('Enter', () => dispatch({ type: submitted ? 'next' : 'check' }), {
    enabled: submitted || canCheck(state),
    requireReset: true,
  })

  // 1-6 / A-F pick (single answer) or toggle (multiple answer) the option
  // shown at that position.
  useHotkeys(
    OPTION_KEYS.flatMap(({ digit, letter }, position) =>
      [digit, letter].map((hotkey) => ({
        hotkey,
        callback: () => {
          if (item) {
            dispatch({
              type: 'toggle',
              originalIndex: item.optionOrder[position],
            })
          }
        },
        options: {
          enabled:
            item !== undefined &&
            !submitted &&
            position < item.optionOrder.length,
        },
      })),
    ),
  )

  if (!item) {
    return (
      <ResultsScreen
        quizId={quizId}
        answers={getAnswers(state)}
        score={getScore(state)}
        nextChapterId={nextChapterId}
        onRetry={() =>
          dispatch({
            type: 'retry',
            plan: buildShuffledPlan(chapter.questions),
          })
        }
      />
    )
  }

  return (
    <QuestionCard
      key={state.current}
      item={item}
      selected={getSelected(state)}
      submitted={submitted}
      index={state.current}
      total={state.plan.length}
      score={getScore(state)}
      isLast={state.current === state.plan.length - 1}
      onToggle={(originalIndex) => dispatch({ type: 'toggle', originalIndex })}
      onCheck={() => dispatch({ type: 'check' })}
      onNext={() => dispatch({ type: 'next' })}
    />
  )
}

import { useEffect, useEffectEvent, useReducer } from 'react'
import { useHotkey, useHotkeys } from '@tanstack/react-hotkeys'
import type { PlannedQuestion } from '#/lib/quiz-plan'
import type { Round } from '#/lib/quiz-state'
import { toggleFlag } from '#/lib/flags'
import { OPTION_KEYS } from '#/lib/option-keys'
import { reshufflePlan } from '#/lib/quiz-plan'
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
import { useFlags } from '#/lib/use-flags'

type Props = {
  quizId: string
  /** Builds the plan of a full round (also used for "retry" / "new round"). */
  buildPlan: () => Array<PlannedQuestion>
  /**
   * Called once when a full round finishes (not for "retry incorrect" rounds).
   * Used to save progress; omit for modes that are not recorded.
   */
  onFinish?: (score: number, total: number) => void
  /** False hides the "retry" button, e.g. when `buildPlan` would be empty. */
  canRetry?: boolean
} & (
  | { mode: 'chapter'; nextChapterId: string | undefined }
  // Mixed practice: immediate feedback across chapters.
  | { mode: 'practice' }
  // Practice again on a fixed subset of questions (e.g. the ones missed in a
  // mock exam). Never recorded.
  | { mode: 'subset' }
  // Practice the questions flagged in earlier rounds. Never recorded.
  | { mode: 'flagged' }
)

const RETRY_LABELS = {
  chapter: 'Retry chapter',
  practice: 'New practice round',
  subset: 'Practice again',
  flagged: 'Practice flagged again',
}

export function QuizRunner(props: Props) {
  const { quizId, mode, buildPlan, onFinish, canRetry = true } = props
  // Undefined until loaded from localStorage; nothing shows as flagged then.
  const flags = useFlags(quizId)

  // A full round of this mode. Only "subset" rounds are never recorded.
  const fullRound = (): Round => ({ subset: props.mode === 'subset' })

  // The route renders on the client only (ssr: 'data-only'), so shuffling
  // during init can't cause a hydration mismatch.
  const [state, dispatch] = useReducer(quizReducer, undefined, () =>
    createInitialState(buildPlan(), fullRound()),
  )

  const item = getCurrentItem(state)
  const submitted = isSubmitted(state)
  const finished = item === undefined
  const { round } = state
  const flaggedIndexes = state.plan.flatMap((planned, index) =>
    flags?.has(planned.question.question) ? [index] : [],
  )

  // Save once per finished full round. The effect event keeps the latest
  // onFinish without making it a dependency (a new closure each render would
  // otherwise save the same result again).
  const finishRound = useEffectEvent(() => {
    if (!round.subset) onFinish?.(getScore(state), state.plan.length)
  })
  useEffect(() => {
    if (finished) finishRound()
  }, [finished, state.plan])

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

  if (finished) {
    const answers = getAnswers(state, flaggedIndexes)
    return (
      <ResultsScreen
        quizId={quizId}
        answers={answers}
        score={getScore(state)}
        retryLabel={RETRY_LABELS[mode]}
        nextChapterId={
          props.mode === 'chapter' ? props.nextChapterId : undefined
        }
        onRetry={
          canRetry
            ? () =>
                dispatch({
                  type: 'retry',
                  plan: buildPlan(),
                  round: fullRound(),
                })
            : undefined
        }
        onRetryIncorrect={() =>
          dispatch({
            type: 'retry',
            plan: reshufflePlan(
              answers.filter((answer) => !answer.correct).map((a) => a.item),
            ),
            // Nothing saved: the score isn't comparable to a full run.
            round: { subset: true },
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
      flagged={flaggedIndexes.includes(state.current)}
      onToggle={(originalIndex) => dispatch({ type: 'toggle', originalIndex })}
      onCheck={() => dispatch({ type: 'check' })}
      onNext={() => dispatch({ type: 'next' })}
      onFlag={() => toggleFlag(quizId, item.question)}
    />
  )
}

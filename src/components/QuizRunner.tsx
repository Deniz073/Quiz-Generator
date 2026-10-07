import { useEffect, useEffectEvent, useReducer } from 'react'
import { useHotkey, useHotkeys } from '@tanstack/react-hotkeys'
import type { PlannedQuestion } from '#/lib/quiz-plan'
import type { Round } from '#/lib/quiz-state'
import { OPTION_KEYS } from '#/lib/option-keys'
import { reshufflePlan } from '#/lib/quiz-plan'
import {
  canCheck,
  createInitialState,
  getAnswers,
  getCurrentItem,
  getScore,
  getSelected,
  isFlagged,
  isSubmitted,
  quizReducer,
} from '#/lib/quiz-state'
import { useCountdown } from '#/lib/use-countdown'
import { QuestionCard } from '#/components/QuestionCard'
import { ResultsScreen } from '#/components/ResultsScreen'

type Props = {
  quizId: string
  /** Builds the plan of a full round (also used for "retry" / "new round"). */
  buildPlan: () => Array<PlannedQuestion>
  /**
   * Called once when a full round finishes (not for "retry incorrect" rounds).
   * Used to save progress; omit for modes that are not recorded.
   */
  onFinish?: (score: number, total: number) => void
} & (
  | { mode: 'chapter'; nextChapterId: string | undefined }
  // Mixed practice: immediate feedback across chapters.
  | { mode: 'practice' }
  // Timed, no feedback until the results.
  | { mode: 'exam'; minutes: number; passPercent: number }
)

const RETRY_LABELS = {
  chapter: 'Retry chapter',
  practice: 'New practice round',
  exam: 'New mock exam',
}

export function QuizRunner(props: Props) {
  const { quizId, mode, buildPlan, onFinish } = props

  // A full round of this mode. Only the exam is timed. Date.now() lives here,
  // outside the reducer, which stays pure. It only runs on the client (see
  // below), so the timestamp can't cause a hydration mismatch either.
  const fullRound = (): Round => ({
    exam: props.mode === 'exam',
    subset: false,
    endsAt:
      props.mode === 'exam' ? Date.now() + props.minutes * 60_000 : undefined,
  })

  // The route renders on the client only (ssr: 'data-only'), so shuffling
  // during init can't cause a hydration mismatch.
  const [state, dispatch] = useReducer(quizReducer, undefined, () =>
    createInitialState(buildPlan(), fullRound()),
  )

  const item = getCurrentItem(state)
  const submitted = isSubmitted(state)
  const finished = item === undefined
  const { round } = state

  // Stops ticking once the round is over (the timer is not shown on results).
  const secondsLeft = useCountdown(finished ? undefined : round.endsAt)
  useEffect(() => {
    if (secondsLeft === 0) dispatch({ type: 'finish' })
  }, [secondsLeft])

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
  // In exam mode it submits a complete pick and moves on.
  // requireReset: holding Enter fires once, so it can't submit and skip ahead.
  // While enabled, preventDefault (the default) stops the focused button from
  // also firing a native click. When disabled, Enter keeps its native meaning
  // (e.g. activating a focused option), so the reducer guards alone aren't enough.
  useHotkey(
    'Enter',
    () => dispatch({ type: submitted || round.exam ? 'next' : 'check' }),
    {
      enabled: submitted || canCheck(state),
      requireReset: true,
    },
  )

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
    const answers = getAnswers(state)
    return (
      <ResultsScreen
        quizId={quizId}
        answers={answers}
        score={getScore(state)}
        retryLabel={RETRY_LABELS[mode]}
        passPercent={props.mode === 'exam' ? props.passPercent : undefined}
        nextChapterId={
          props.mode === 'chapter' ? props.nextChapterId : undefined
        }
        onRetry={() =>
          dispatch({ type: 'retry', plan: buildPlan(), round: fullRound() })
        }
        onRetryIncorrect={() =>
          dispatch({
            type: 'retry',
            plan: reshufflePlan(
              answers.filter((answer) => !answer.correct).map((a) => a.item),
            ),
            // Always plain practice: feedback, no timer, nothing saved.
            round: { exam: false, subset: true },
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
      exam={round.exam}
      secondsLeft={secondsLeft}
      flagged={isFlagged(state)}
      onToggle={(originalIndex) => dispatch({ type: 'toggle', originalIndex })}
      onCheck={() => dispatch({ type: 'check' })}
      onNext={() => dispatch({ type: 'next' })}
      onFlag={() => dispatch({ type: 'flag' })}
    />
  )
}

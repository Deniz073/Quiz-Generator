import { useEffect, useEffectEvent, useReducer, useRef } from 'react'
import { useHotkey } from '@tanstack/react-hotkeys'
import type { PlannedQuestion } from '#/lib/quiz-plan'
import type { ProgressTarget } from '#/lib/progress'
import type { Round } from '#/lib/quiz-state'
import { toggleFlag } from '#/lib/flags'
import { focusHeading, isFocusLost } from '#/lib/focus'
import { recordResult } from '#/lib/progress'
import { reshufflePlan } from '#/lib/quiz-plan'
import {
  canCheck,
  canGoBack,
  createInitialState,
  getAnswers,
  getCurrentItem,
  getScore,
  getSelected,
  isSubmitted,
  quizReducer,
} from '#/lib/quiz-state'
import { LeavePrompt } from '#/components/LeavePrompt'
import { QuestionCard } from '#/components/QuestionCard'
import { ResultsScreen } from '#/components/ResultsScreen'
import { useFlags } from '#/lib/use-flags'
import { useLeaveGuard } from '#/lib/use-leave-guard'
import { useOptionHotkeys } from '#/lib/use-option-hotkeys'

type Props = {
  quizId: string
  /** Builds the plan of a full round (also used for "retry" / "new round"). */
  buildPlan: () => Array<PlannedQuestion>
  /**
   * Where to save the result when a full round finishes (never for "retry
   * incorrect" rounds). Omit for modes that are not recorded.
   */
  record?: ProgressTarget
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
  const { quizId, mode, buildPlan, record, canRetry = true } = props
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
    flags?.has(planned.question.id) ? [index] : [],
  )

  // Save once per finished full round. The effect event reads the latest
  // props and state without making them dependencies (which would save the
  // same result again).
  const finishRound = useEffectEvent(() => {
    if (record && !round.subset) {
      recordResult(quizId, record, getScore(state), state.plan.length)
    }
  })
  useEffect(() => {
    if (finished) finishRound()
  }, [finished, state.plan])

  // Warn before leaving a round with answers to lose: in-app navigation gets
  // the inline prompt below, reload/close the browser's own prompt. Nothing is
  // saved before the end, and nothing is lost before the first answer.
  const { blocked, stay, leave } = useLeaveGuard(
    !finished && state.answers.length > 0,
  )

  // Enter checks a complete multi-answer selection, or moves on once answered.
  // requireReset: holding Enter fires once, so it can't submit and skip ahead.
  // While enabled, preventDefault (the default) stops the focused button from
  // also firing a native click. When disabled, Enter keeps its native meaning
  // (e.g. activating a focused option), so the reducer guards alone aren't enough.
  useHotkey('Enter', () => dispatch({ type: submitted ? 'next' : 'check' }), {
    enabled: !blocked && (submitted || canCheck(state)),
    requireReset: true,
  })

  // Left arrow goes back to review the previous question.
  useHotkey('ArrowLeft', () => dispatch({ type: 'previous' }), {
    enabled: !blocked && canGoBack(state),
  })

  useOptionHotkeys({
    optionOrder: item?.optionOrder,
    enabled: !blocked && !submitted,
    onPick: (originalIndex) => dispatch({ type: 'toggle', originalIndex }),
  })

  // The card is keyed per question, so "Next question" unmounts with the old
  // card and focus would drop to <body>. Put it on the new question instead,
  // so screen readers read it. Not when the card already placed focus itself
  // (an answered question focuses its Next button).
  const cardRef = useRef<HTMLDivElement>(null)
  const shownIndex = useRef(state.current)
  useEffect(() => {
    if (shownIndex.current === state.current) return
    shownIndex.current = state.current
    if (isFocusLost()) focusHeading(cardRef.current?.querySelector('h2'))
  }, [state.current])

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
    <>
      {blocked ? (
        <LeavePrompt
          title="Leave this round?"
          description="Your answers so far will be lost."
          stayLabel="Stay on the round"
          leaveLabel="Leave round"
          onStay={stay}
          onLeave={leave}
        />
      ) : null}
      <div ref={cardRef}>
        <QuestionCard
          key={state.current}
          item={item}
          selected={getSelected(state)}
          submitted={submitted}
          index={state.current}
          total={state.plan.length}
          score={getScore(state)}
          answeredCount={state.answers.length}
          isLast={state.current === state.plan.length - 1}
          flagged={flaggedIndexes.includes(state.current)}
          onToggle={(originalIndex) =>
            dispatch({ type: 'toggle', originalIndex })
          }
          onCheck={() => dispatch({ type: 'check' })}
          onNext={() => dispatch({ type: 'next' })}
          onPrevious={
            canGoBack(state) ? () => dispatch({ type: 'previous' }) : undefined
          }
          onFlag={() => toggleFlag(quizId, item.question)}
          shareQuizId={quizId}
        />
      </div>
    </>
  )
}

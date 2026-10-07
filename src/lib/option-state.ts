export type OptionState =
  | 'idle'
  | 'selected'
  | 'blocked'
  // After answering. `correct` is the single-answer right option.
  | 'correct'
  | 'correctSelected'
  | 'missed'
  | 'wrong'
  | 'dim'

interface OptionStateInput {
  multiple: boolean
  /** True once the answer is locked and feedback is shown. */
  answered: boolean
  /** Exam mode: a single-answer pick stays changeable, so it shows as selected. */
  changeable: boolean
  chosen: boolean
  isAnswer: boolean
  /** Multiple answers only: the required number of options is already picked. */
  selectionFull: boolean
}

export function getOptionState({
  multiple,
  answered,
  changeable,
  chosen,
  isAnswer,
  selectionFull,
}: OptionStateInput): OptionState {
  if (answered) {
    if (isAnswer) {
      if (!multiple) return 'correct'
      return chosen ? 'correctSelected' : 'missed'
    }
    return chosen ? 'wrong' : 'dim'
  }
  if ((multiple || changeable) && chosen) return 'selected'
  if (multiple && selectionFull) return 'blocked'
  return 'idle'
}

import { useHotkeys } from '@tanstack/react-hotkeys'
import { OPTION_KEYS } from '#/lib/option-keys'

/**
 * 1-6 / A-F pick (single answer) or toggle (multiple answer) the option shown
 * at that position. `onPick` gets the option's original index. Without an
 * `optionOrder` (no question shown) no key is active.
 */
export function useOptionHotkeys({
  optionOrder,
  enabled,
  onPick,
}: {
  optionOrder: ReadonlyArray<number> | undefined
  enabled: boolean
  onPick: (originalIndex: number) => void
}) {
  useHotkeys(
    OPTION_KEYS.flatMap(({ digit, letter }, position) =>
      [digit, letter].map((hotkey) => ({
        hotkey,
        callback: () => {
          const originalIndex = optionOrder?.[position]
          if (originalIndex !== undefined) onPick(originalIndex)
        },
        options: {
          enabled:
            enabled &&
            optionOrder !== undefined &&
            position < optionOrder.length,
        },
      })),
    ),
  )
}

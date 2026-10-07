import { useEffect, useState } from 'react'

/**
 * Whole seconds left until `endsAt` (epoch ms), or undefined when there is no
 * deadline. Derived from the timestamp on every tick instead of counting down,
 * so a throttled background tab shows the right time as soon as it wakes up.
 * The interval is cleared when `endsAt` changes or the component unmounts.
 */
export function useCountdown(endsAt: number | undefined): number | undefined {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (endsAt === undefined) return
    setNow(Date.now())
    const id = setInterval(() => setNow(Date.now()), 500)
    return () => clearInterval(id)
  }, [endsAt])

  return endsAt === undefined
    ? undefined
    : Math.max(0, Math.ceil((endsAt - now) / 1000))
}

/** 3725 -> "62:05". */
export function formatSeconds(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

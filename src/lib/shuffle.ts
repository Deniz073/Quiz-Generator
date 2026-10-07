/** Fisher-Yates shuffle. Returns a new array, input is untouched. */
export function shuffle<T>(items: ReadonlyArray<T>): Array<T> {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const tmp = result[i]
    result[i] = result[j]
    result[j] = tmp
  }
  return result
}

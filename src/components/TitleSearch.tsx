import { Search } from 'lucide-react'
import { Input } from '#/components/ui/input'

/** The items whose title contains `query`, ignoring case; all for none. */
export function filterByTitle<T extends { title: string }>(
  items: ReadonlyArray<T>,
  query: string,
): ReadonlyArray<T> {
  const needle = query.trim().toLowerCase()
  return needle
    ? items.filter((item) => item.title.toLowerCase().includes(needle))
    : items
}

export function TitleSearch({
  value,
  onChange,
  label,
  className,
}: {
  value: string
  onChange: (value: string) => void
  /** Placeholder and accessible name, e.g. "Search quizzes by name". */
  label: string
  className?: string
}) {
  return (
    <div className={`relative ${className ?? ''}`}>
      <Search
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
      />
      <Input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={label}
        aria-label={label}
        className="h-9 pl-8"
      />
    </div>
  )
}

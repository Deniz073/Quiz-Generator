import { Skeleton } from '#/components/ui/skeleton'

/*
 * What pages show while their data loads. A whole-page skeleton is a route's
 * pending component (see the router's defaults); the list and section
 * skeletons stand in for the part of a page whose data is streamed in after
 * the page itself (the loader returns its promise, the page renders it with
 * <Await>). Each follows the layout of what it stands in for, so little
 * moves when the content appears.
 */

const cardClasses = 'rounded-xl border bg-card p-5'

/** Any page without a skeleton of its own: a back link, a title, some text. */
export function PageSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading the page">
      <Skeleton className="h-5 w-32" />
      <Skeleton className="mt-4 h-8 w-64 max-w-full" />
      <div className="mt-8 flex flex-col gap-3">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-11/12" />
        <Skeleton className="h-5 w-2/3" />
      </div>
      <Skeleton className="mt-8 h-40 w-full rounded-xl" />
    </div>
  )
}

/** The quiz cards of the home page and the listings of the Marketplace. */
export function CardListSkeleton({
  label,
  count = 3,
  className = 'mt-6',
}: {
  /** For screen readers, e.g. "Loading quizzes". */
  label: string
  count?: number
  className?: string
}) {
  return (
    <ul
      className={`flex flex-col gap-4 ${className}`}
      aria-busy="true"
      aria-label={label}
    >
      {Array.from({ length: count }, (_, card) => (
        <li key={card} className={cardClasses}>
          <Skeleton className="h-7 w-1/2" />
          <Skeleton className="mt-3 h-5 w-full" />
          <Skeleton className="mt-4 h-4 w-40" />
        </li>
      ))}
    </ul>
  )
}

export function QuizPageSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading the quiz">
      <Skeleton className="h-5 w-24" />
      <Skeleton className="mt-4 h-9 w-72 max-w-full" />
      <Skeleton className="mt-3 h-5 w-full" />
      <Skeleton className="mt-9 h-6 w-24" />
      <div className="mt-3 flex flex-col gap-3">
        {[0, 1, 2, 3, 4].map((chapter) => (
          <div key={chapter} className="flex items-stretch gap-2 sm:gap-3">
            <Skeleton className="h-12 flex-1 rounded-lg" />
            <Skeleton className="h-12 w-16 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function NotesSectionSkeleton() {
  return (
    <section className="mt-10" aria-busy="true" aria-label="Loading notes">
      <h2 className="text-lg font-semibold">Notes</h2>
      <div className="mt-3 flex flex-col gap-2 rounded-lg border bg-card px-4 py-3">
        <Skeleton className="h-5 w-1/2" />
        <Skeleton className="h-5 w-1/3" />
      </div>
    </section>
  )
}

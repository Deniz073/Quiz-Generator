import { Skeleton } from '#/components/ui/skeleton'

/*
 * What the quiz assistant's page shows while it loads: the same layout as
 * QuizAssistant (header, preview on the left, chat on the right; only the
 * chat on small screens), so nothing moves when the page itself appears.
 */
export function QuizAssistantSkeleton() {
  return (
    <div
      className="flex flex-col gap-3 lg:h-[calc(100dvh-8.5rem)]"
      aria-busy="true"
      aria-label="Loading the quiz assistant"
    >
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col gap-2 py-1">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-7 w-48" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-[4.25rem]" />
          <Skeleton className="h-8 w-[3.25rem]" />
        </div>
      </header>

      <Skeleton className="h-8 w-28 lg:hidden" />

      <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-2">
        <section className="hidden min-h-0 flex-col gap-6 overflow-hidden rounded-xl border bg-background p-6 lg:flex">
          <div className="flex flex-col gap-3">
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <Skeleton className="h-6 w-1/3" />
          {[0, 1].map((card) => (
            <div
              key={card}
              className="flex flex-col gap-3 rounded-lg border p-4"
            >
              <Skeleton className="h-5 w-4/5" />
              {[0, 1, 2, 3].map((option) => (
                <Skeleton key={option} className="ml-6 h-4 w-1/3" />
              ))}
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </section>

        <section className="flex h-[calc(100dvh-15rem)] min-h-0 flex-col overflow-hidden rounded-xl border bg-background lg:h-auto">
          <div className="flex flex-1 flex-col gap-3 p-4">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <div className="border-t p-3">
            <Skeleton className="h-28 w-full rounded-lg" />
          </div>
        </section>
      </div>
    </div>
  )
}

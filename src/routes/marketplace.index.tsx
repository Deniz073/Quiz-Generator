import { useState } from 'react'
import { Await, Link, createFileRoute } from '@tanstack/react-router'
import { ListingActions, ListingByline } from '#/components/ListingActions'
import { CardListSkeleton } from '#/components/PageSkeleton'
import { Badge } from '#/components/ui/badge'
import { TitleSearch, filterByTitle } from '#/components/TitleSearch'
import type { Listing } from '#/lib/marketplace-api'
import { fetchListings } from '#/lib/marketplace-api'
import { pageTitle } from '#/lib/page-title'
import { SKELETON_DELAY_MS, settledSoon } from '#/lib/skeleton-delay'
import { Button } from '#/components/ui/button'

export const Route = createFileRoute('/marketplace/')({
  // Not awaited for long: if the listings take a while, the page shows
  // without them and they are streamed in.
  loader: async () => {
    const listings = fetchListings()
    await settledSoon(listings)
    return { listings }
  },
  // The loader never takes long, so only a slow first download of the page's
  // code shows the whole-page skeleton; not just ahead of the list's own.
  pendingMs: 2 * SKELETON_DELAY_MS,
  head: () => ({ meta: [{ title: pageTitle('Marketplace') }] }),
  component: Marketplace,
})

function Marketplace() {
  const { listings } = Route.useLoaderData()
  const [query, setQuery] = useState('')
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Marketplace</h1>
      <p className="mt-2 text-muted-foreground">
        Quizzes published by other users. Preview one, or import a copy to
        practise it as your own.
      </p>
      <TitleSearch
        value={query}
        onChange={setQuery}
        label="Search the Marketplace by name"
        className="mt-6"
      />
      <Await
        promise={listings}
        fallback={<CardListSkeleton label="Loading the Marketplace" />}
      >
        {(loaded) => <Listings listings={loaded} query={query} />}
      </Await>
    </div>
  )
}

function Listings({
  listings,
  query,
}: {
  listings: ReadonlyArray<Listing>
  query: string
}) {
  const matches = filterByTitle(listings, query)
  if (matches.length === 0) {
    return (
      <p className="mt-6 text-muted-foreground">
        {query.trim()
          ? `No published quizzes match “${query.trim()}”.`
          : 'No quizzes have been published yet.'}
      </p>
    )
  }
  return (
    <ul className="mt-6 flex flex-col gap-4">
      {matches.map((listing) => (
        <li key={listing.id}>
          <ListingCard listing={listing} />
        </li>
      ))}
    </ul>
  )
}

function ListingCard({ listing }: { listing: Listing }) {
  return (
    <article className="flex flex-col gap-4 rounded-xl border bg-card p-5 text-card-foreground sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <h2 className="flex flex-wrap items-center gap-2 text-xl font-semibold">
          <Link
            to="/marketplace/$quizId"
            params={{ quizId: listing.id }}
            className="hover:underline"
          >
            {listing.title}
          </Link>
          {listing.yours ? <Badge variant="secondary">Yours</Badge> : null}
        </h2>
        <p className="mt-1 text-muted-foreground">{listing.description}</p>
        <ListingByline listing={listing} className="mt-3" />
      </div>
      <div className="flex shrink-0 flex-wrap items-start gap-2">
        <Button
          variant="ghost"
          nativeButton={false}
          render={
            <Link to="/marketplace/$quizId" params={{ quizId: listing.id }} />
          }
        >
          Preview
        </Button>
        <ListingActions listing={listing} />
      </div>
    </article>
  )
}

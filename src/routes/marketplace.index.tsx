import { useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { ListingActions, ListingByline } from '#/components/ListingActions'
import { Badge } from '#/components/ui/badge'
import { TitleSearch, filterByTitle } from '#/components/TitleSearch'
import type { Listing } from '#/lib/marketplace-api'
import { fetchListings } from '#/lib/marketplace-api'
import { pageTitle } from '#/lib/page-title'
import { Button } from '#/components/ui/button'

export const Route = createFileRoute('/marketplace/')({
  loader: () => fetchListings(),
  head: () => ({ meta: [{ title: pageTitle('Marketplace') }] }),
  component: Marketplace,
})

function Marketplace() {
  const listings = Route.useLoaderData()
  const [query, setQuery] = useState('')
  const matches = filterByTitle(listings, query)
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
      {matches.length === 0 ? (
        <p className="mt-6 text-muted-foreground">
          {query.trim()
            ? `No published quizzes match “${query.trim()}”.`
            : 'No quizzes have been published yet.'}
        </p>
      ) : (
        <ul className="mt-6 flex flex-col gap-4">
          {matches.map((listing) => (
            <li key={listing.id}>
              <ListingCard listing={listing} />
            </li>
          ))}
        </ul>
      )}
    </div>
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

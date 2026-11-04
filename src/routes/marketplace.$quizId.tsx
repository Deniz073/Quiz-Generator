import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { ListingActions } from '#/components/ListingActions'
import { NotFound } from '#/components/NotFound'
import { StudySession } from '#/components/StudySession'
import { Badge } from '#/components/ui/badge'
import { formatImports } from '#/domain/marketplace'
import { backLinkClasses } from '#/lib/button-classes'
import { fetchPreview } from '#/lib/marketplace-api'
import { pageTitle } from '#/lib/page-title'
import { validateStudySearch } from '#/lib/study-search'

/*
 * Preview of a published quiz: Study only (read-only, not scored, nothing
 * saved), for anyone. Practising it needs an imported copy.
 */
export const Route = createFileRoute('/marketplace/$quizId')({
  validateSearch: validateStudySearch,
  // The deck shuffles with Math.random, see the quiz's Study page.
  ssr: 'data-only',
  loader: async ({ params }) => {
    const preview = await fetchPreview({ data: { quizId: params.quizId } })
    if (!preview) throw notFound()
    return preview
  },
  head: ({ loaderData }) => ({
    meta: [{ title: pageTitle('Preview', loaderData?.quiz.title) }],
  }),
  component: PreviewPage,
  notFoundComponent: () => (
    <NotFound message="This quiz is not on the Marketplace." />
  ),
})

function PreviewPage() {
  const { listing, quiz } = Route.useLoaderData()
  const search = Route.useSearch()
  const navigate = Route.useNavigate()
  return (
    <div>
      <Link to="/marketplace" className={backLinkClasses}>
        <span aria-hidden="true">&larr;</span> Marketplace
      </Link>
      <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="flex flex-wrap items-center gap-2 text-2xl font-bold">
            {quiz.title}
            <Badge variant="outline">Preview</Badge>
          </h1>
          <p className="mt-1 text-muted-foreground">{quiz.description}</p>
          <p className="mt-2 text-sm text-muted-foreground tabular-nums">
            By {listing.publisherName} &middot; {listing.chapterCount}
            &nbsp;chapters &middot; {listing.questionCount}&nbsp;questions
            &middot; {formatImports(listing.importCount)}
          </p>
        </div>
        <div className="shrink-0">
          <ListingActions listing={listing} />
        </div>
      </div>
      <div className="mt-8">
        <StudySession
          quiz={quiz}
          search={search}
          onSearchChange={(next) =>
            void navigate({ search: (prev) => ({ ...prev, ...next }) })
          }
          shareable={false}
        />
      </div>
    </div>
  )
}

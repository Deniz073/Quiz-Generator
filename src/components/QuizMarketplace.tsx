import { Link, useNavigate, useRouter } from '@tanstack/react-router'
import { ConfirmAction } from '#/components/ConfirmAction'
import { Button } from '#/components/ui/button'
import { formatImports } from '#/domain/marketplace'
import type { QuizStanding } from '#/lib/marketplace-api'
import { deleteQuiz, publishQuiz } from '#/lib/marketplace-api'
import { clearQuizCache } from '#/lib/quiz-route'
import type { Quiz } from '#/quizzes/types'

/**
 * A personal quiz's place on the Marketplace, on its own page: where it was
 * imported from, publishing and unpublishing it, and deleting it. Nothing for
 * built-in quizzes.
 */
export function QuizMarketplace({
  quiz,
  standing,
  userName,
}: {
  quiz: Quiz
  standing: QuizStanding
  /** Shown publicly as the publisher. */
  userName: string
}) {
  const router = useRouter()
  const navigate = useNavigate()
  if (standing.builtIn) return null

  const setPublished = async (published: boolean) => {
    await publishQuiz({ data: { quizId: quiz.id, published } })
    await router.invalidate()
  }

  const remove = async () => {
    await deleteQuiz({ data: { quizId: quiz.id } })
    // The deleted quiz must not come back from the browser's quiz cache.
    clearQuizCache()
    await navigate({ to: '/' })
  }

  const copies = standing.importCount
  return (
    <section className="mt-10 border-t pt-6" aria-labelledby="manage-quiz">
      <h2 id="manage-quiz" className="text-lg font-semibold">
        Manage quiz
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        <Status standing={standing} />
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {standing.published ? (
          <>
            <Button
              variant="outline"
              nativeButton={false}
              render={
                <Link to="/marketplace/$quizId" params={{ quizId: quiz.id }} />
              }
            >
              View listing
            </Button>
            <ConfirmAction
              label="Unpublish"
              title={`Unpublish ${quiz.title}?`}
              description={`It comes off the Marketplace right away. ${copyNote(copies)}`}
              confirmLabel="Unpublish"
              onConfirm={() => setPublished(false)}
            />
          </>
        ) : standing.canPublish ? (
          <ConfirmAction
            label="Publish to Marketplace"
            title={`Publish ${quiz.title}?`}
            description={`Everyone, also people who aren't signed in, can preview it on the Marketplace, and signed-in users can import a copy of it. Your name, ${userName}, is shown as its publisher.`}
            confirmLabel="Publish"
            onConfirm={() => setPublished(true)}
          />
        ) : null}
        {standing.canDelete ? (
          // Apart from the sharing actions: it removes the quiz itself.
          <div className="sm:ml-auto">
            <ConfirmAction
              label="Delete quiz"
              title={`Delete ${quiz.title}?`}
              description={
                `Your progress, flags and unfinished mock exam on it are lost. This can't be undone.` +
                (standing.published
                  ? ` It also comes off the Marketplace. ${copyNote(copies)}`
                  : '')
              }
              confirmLabel="Delete"
              destructive
              onConfirm={remove}
            />
          </div>
        ) : null}
      </div>
    </section>
  )
}

function Status({ standing }: { standing: QuizStanding }) {
  if (standing.published) {
    return (
      <>Published on the Marketplace, {formatImports(standing.importCount)}.</>
    )
  }
  if (standing.imported) {
    const source = standing.importedFrom
    if (!source) {
      return (
        <>
          Imported from a quiz that is no longer on the Marketplace.{' '}
          {publishNote(standing.edited)}
        </>
      )
    }
    return (
      <>
        Imported from{' '}
        {source.published ? (
          <Link
            to="/marketplace/$quizId"
            params={{ quizId: source.id }}
            className="font-medium text-foreground underline underline-offset-4"
          >
            {source.title}
          </Link>
        ) : (
          <span className="font-medium text-foreground">{source.title}</span>
        )}{' '}
        by {source.publisherName}. Changes to it don’t reach your copy.{' '}
        {publishNote(standing.edited)}
      </>
    )
  }
  return <>Not published. Publish it to let others preview and import it.</>
}

/** An imported quiz: publishable once its owner has edited it. */
function publishNote(edited: boolean): string {
  return edited
    ? 'You have edited your copy, so you can publish it.'
    : 'Edit it with the quiz assistant to publish your own version.'
}

function copyNote(copies: number): string {
  if (copies === 0) return ''
  return copies === 1
    ? 'The 1 imported copy keeps working.'
    : `The ${copies} imported copies keep working.`
}

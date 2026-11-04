import { useEffect, useState, useSyncExternalStore } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { AssistantChat } from '#/components/AssistantChat'
import { LeavePrompt } from '#/components/LeavePrompt'
import { WorkingCopyPreview } from '#/components/WorkingCopyPreview'
import { Alert, AlertDescription, AlertTitle } from '#/components/ui/alert'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '#/components/ui/alert-dialog'
import { Button } from '#/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '#/components/ui/tabs'
import type { AssistantStart, SaveOutcome } from '#/lib/assistant-api'
import { saveAssistantQuiz } from '#/lib/assistant-api'
import { handOverNewQuiz } from '#/lib/assistant-handover'
import { createWorkingCopyStore } from '#/lib/assistant-client-tools'
import { backLinkClasses } from '#/lib/button-classes'
import { forgetQuiz } from '#/lib/quiz-route'
import { useLeaveGuard } from '#/lib/use-leave-guard'
import {
  createWorkingCopy,
  emptyQuiz,
  rebaseWorkingCopy,
  saveProblems,
} from '#/lib/working-copy'
import type { Quiz } from '#/quizzes/types'

type Impact = Extract<SaveOutcome, { status: 'confirm' }>['impact']

/*
 * The quiz assistant's page: the working copy's preview on the left, the
 * conversation on the right (tabs on small screens), Save and Discard on top.
 * Only Save writes; see docs/adr/0002.
 */
export function QuizAssistant({ start }: { start: AssistantStart }) {
  const navigate = useNavigate()
  const [saved, setSaved] = useState<{ quiz: Quiz; updatedAt: string } | null>(
    start.editable,
  )
  // One working copy per visit; Save and Discard replace its content.
  const [store] = useState(() =>
    createWorkingCopyStore(
      createWorkingCopy(start.editable?.quiz ?? emptyQuiz()),
    ),
  )
  const copy = useSyncExternalStore(store.subscribe, store.get, store.get)
  const [tab, setTab] = useState<'preview' | 'chat'>('chat')
  const [saving, setSaving] = useState(false)
  const [impact, setImpact] = useState<Impact | null>(null)
  const [message, setMessage] = useState<{
    title: string
    text: string
    reload?: boolean
  } | null>(null)
  const [justSaved, setJustSaved] = useState(false)
  // The user chose to reload and lose their changes: no leave prompt.
  const [reloading, setReloading] = useState(false)

  const base = saved?.quiz ?? emptyQuiz()
  const dirty = JSON.stringify(copy.quiz) !== JSON.stringify(base)
  const problems = saveProblems(copy.quiz)
  const canSave = dirty && problems.length === 0 && !saving
  const guard = useLeaveGuard(dirty && !reloading)
  useEffect(() => {
    if (reloading) window.location.reload()
  }, [reloading])

  async function save(confirmed: boolean) {
    setSaving(true)
    setMessage(null)
    setJustSaved(false)
    try {
      const outcome = await saveAssistantQuiz({
        data: {
          quiz: copy.quiz,
          baseUpdatedAt: saved?.updatedAt ?? null,
          confirmed,
        },
      })
      switch (outcome.status) {
        case 'saved': {
          // Keeps edits made while the Save was on its way.
          const current = store.get()
          const changedMeanwhile =
            JSON.stringify(current.quiz) !== JSON.stringify(copy.quiz)
          // A new quiz still takes its id, or the next Save would fail.
          store.set(
            rebaseWorkingCopy(
              current,
              changedMeanwhile
                ? { ...current.quiz, id: outcome.quiz.id }
                : outcome.quiz,
            ),
          )
          setSaved({ quiz: outcome.quiz, updatedAt: outcome.updatedAt })
          setImpact(null)
          setJustSaved(true)
          forgetQuiz(outcome.quiz.id)
          if (outcome.created) {
            const target = {
              to: '/assistant/$quizId',
              params: { quizId: outcome.quiz.id },
            } as const
            // The route takes this instead of loading (no skeleton, no
            // remount): the conversation and working copy stay.
            handOverNewQuiz(outcome.quiz.id, {
              providers: start.providers,
              editable: { quiz: outcome.quiz, updatedAt: outcome.updatedAt },
            })
            void navigate({
              ...target,
              replace: true,
              // Saved: the leave guard may not have caught up yet.
              ignoreBlocker: true,
            })
          }
          break
        }
        case 'confirm':
          setImpact(outcome.impact)
          break
        case 'conflict':
          setMessage({
            title: 'This quiz changed elsewhere',
            text: 'It was saved or deleted in another tab since you opened it. Reload to continue from the saved version; the unsaved changes here will be lost.',
            reload: true,
          })
          break
        case 'not-found':
          setMessage({
            title: 'Quiz not found',
            text: 'This quiz no longer exists, so it can’t be saved.',
          })
          break
        case 'quiz-limit':
          setMessage({
            title: 'Too many quizzes',
            text: 'You have reached the maximum number of personal quizzes. Delete one to create a new one.',
          })
          break
      }
    } catch (cause) {
      setMessage({
        title: 'Could not save',
        text: cause instanceof Error ? cause.message : 'Something went wrong.',
      })
    } finally {
      setSaving(false)
    }
  }

  function discard() {
    store.set(rebaseWorkingCopy(store.get(), base))
    setJustSaved(false)
  }

  const title = saved ? saved.quiz.title : 'New quiz'

  return (
    <div className="flex flex-col gap-3 lg:h-[calc(100dvh-8.5rem)]">
      {guard.blocked ? (
        <LeavePrompt
          title="Leave without saving?"
          description="Your unsaved changes to this quiz will be lost."
          stayLabel="Stay"
          leaveLabel="Leave"
          onStay={guard.stay}
          onLeave={guard.leave}
        />
      ) : null}

      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          {saved ? (
            <Link
              to="/quiz/$quizId"
              params={{ quizId: saved.quiz.id }}
              className={backLinkClasses}
            >
              <span aria-hidden="true">&larr;</span> {saved.quiz.title}
            </Link>
          ) : (
            <Link to="/" className={backLinkClasses}>
              <span aria-hidden="true">&larr;</span> All quizzes
            </Link>
          )}
          <h1 className="truncate text-2xl font-bold tracking-tight">
            Quiz assistant
            <span className="sr-only">: {title}</span>
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground" aria-live="polite">
            {saving
              ? 'Saving…'
              : dirty
                ? 'Unsaved changes'
                : justSaved
                  ? 'Saved'
                  : null}
          </span>
          <Button
            variant="outline"
            disabled={!dirty || saving}
            onClick={discard}
          >
            Discard
          </Button>
          <Button
            disabled={!canSave}
            onClick={() => void save(false)}
            title={
              dirty && problems.length > 0
                ? 'The quiz is not ready to save yet; see the preview.'
                : undefined
            }
          >
            Save
          </Button>
        </div>
      </header>

      {message ? (
        <Alert variant="destructive">
          <AlertTitle>{message.title}</AlertTitle>
          <AlertDescription>
            {message.text}
            {message.reload ? (
              <Button
                className="mt-2 w-fit"
                variant="outline"
                size="sm"
                onClick={() => setReloading(true)}
              >
                Reload
              </Button>
            ) : null}
          </AlertDescription>
        </Alert>
      ) : null}

      <Tabs
        value={tab}
        onValueChange={(value) => setTab(value as 'preview' | 'chat')}
        className="lg:hidden"
      >
        <TabsList>
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-2">
        <section
          aria-label="Quiz preview"
          data-active={tab === 'preview'}
          className="hidden min-h-0 overflow-y-auto rounded-xl border bg-background data-[active=true]:block lg:block"
        >
          <WorkingCopyPreview quiz={copy.quiz} saved={saved?.quiz ?? null} />
        </section>
        <section
          aria-label="Chat with the quiz assistant"
          data-active={tab === 'chat'}
          className="hidden h-[calc(100dvh-15rem)] min-h-0 overflow-hidden rounded-xl border bg-background data-[active=true]:block lg:block lg:h-auto"
        >
          {start.providers.length === 0 ? (
            <NoKey />
          ) : (
            <AssistantChat
              store={store}
              providers={start.providers}
              isNew={saved === null}
            />
          )}
        </section>
      </div>

      <AlertDialog
        open={impact !== null}
        onOpenChange={(open) => {
          if (!open && !saving) setImpact(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Save and lose progress?</AlertDialogTitle>
            <AlertDialogDescription render={<div />}>
              {impact ? <ImpactList impact={impact} /> : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={saving}>
              Keep editing
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={saving}
              onClick={() => void save(true)}
            >
              Save anyway
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function ImpactList({ impact }: { impact: Impact }) {
  const chapters = impact.removedChapters.filter((c) => c.attempts > 0)
  const questions = impact.removedQuestions.filter((q) => q.flags > 0)
  return (
    <div className="flex flex-col gap-2 text-left">
      <p>This save removes things your progress depends on:</p>
      <ul className="list-disc pl-5">
        {chapters.map((c) => (
          <li key={c.id}>
            Chapter “{c.title}”: {c.attempts}{' '}
            {c.attempts === 1 ? 'result' : 'results'} will be deleted.
          </li>
        ))}
        {questions.map((q) => (
          <li key={q.id}>
            “{q.text.length > 80 ? `${q.text.slice(0, 79)}…` : q.text}”: its
            flag will be removed.
          </li>
        ))}
        {impact.unfinishedExamAffected ? (
          <li>
            Your unfinished mock exam on this quiz is affected and may be
            discarded.
          </li>
        ) : null}
      </ul>
    </div>
  )
}

function NoKey() {
  return (
    <div className="flex h-full items-center justify-center p-6">
      <Alert>
        <AlertTitle>Add an API key first</AlertTitle>
        <AlertDescription>
          The quiz assistant runs on your own Claude or OpenAI API key.{' '}
          <Link to="/profile" className="underline underline-offset-4">
            Add one on your profile
          </Link>
          , then come back.
        </AlertDescription>
      </Alert>
    </div>
  )
}

import { CheckIcon, TriangleAlertIcon } from 'lucide-react'
import { Badge } from '#/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '#/components/ui/alert'
import { saveProblems } from '#/lib/working-copy'
import { getCorrectIndexes } from '#/quizzes/question'
import type { Chapter, Question, Quiz } from '#/quizzes/types'

/*
 * The working copy as the user reads it while the quiz assistant edits it:
 * everything of the quiz, with what is new or changed since the last Save
 * marked, and what still stands in the way of a Save.
 */

type Change = 'new' | 'changed' | null

function changeOf<T extends { id: string }>(
  item: T,
  saved: ReadonlyMap<string, T>,
): Change {
  const before = saved.get(item.id)
  if (!before) return 'new'
  return JSON.stringify(before) === JSON.stringify(item) ? null : 'changed'
}

function ChangeBadge({ change }: { change: Change }) {
  if (!change) return null
  return (
    <Badge variant={change === 'new' ? 'default' : 'secondary'}>
      {change === 'new' ? 'New' : 'Changed'}
    </Badge>
  )
}

function chapterHeader(chapter: Chapter) {
  // A chapter is "changed" by its own fields, not by its questions.
  const { questions: _questions, ...rest } = chapter
  return rest
}

export function WorkingCopyPreview({
  quiz,
  saved,
}: {
  quiz: Quiz
  /** The quiz as last saved; null for a quiz not saved yet. */
  saved: Quiz | null
}) {
  const savedChapters = new Map(
    (saved?.chapters ?? []).map((c) => [c.id, chapterHeader(c)]),
  )
  const savedQuestions = new Map(
    (saved?.chapters ?? []).flatMap((c) => c.questions.map((q) => [q.id, q])),
  )
  const currentQuestionIds = new Set(
    quiz.chapters.flatMap((c) => c.questions.map((q) => q.id)),
  )
  const removedQuestions = [...savedQuestions.keys()].filter(
    (id) => !currentQuestionIds.has(id),
  ).length
  const removedChapters = (saved?.chapters ?? []).filter(
    (c) => !quiz.chapters.some((current) => current.id === c.id),
  ).length
  const problems = saveProblems(quiz)
  const total = quiz.chapters.reduce((sum, c) => sum + c.questions.length, 0)
  const empty = quiz.title === '' && quiz.chapters.length === 0

  if (empty) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 p-8 text-center text-muted-foreground">
        <p className="text-base font-medium text-foreground">
          Your quiz appears here
        </p>
        <p className="max-w-sm text-sm">
          Tell the assistant what the quiz should be about. It builds the quiz
          here as you talk; nothing is kept until you save it.
        </p>
      </div>
    )
  }

  const headerChanged =
    saved !== null &&
    (saved.title !== quiz.title ||
      saved.description !== quiz.description ||
      JSON.stringify(saved.exam ?? null) !== JSON.stringify(quiz.exam ?? null))

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6">
      <header className="flex flex-col gap-2">
        <h2 className="flex flex-wrap items-center gap-2 text-2xl font-bold tracking-tight">
          {quiz.title || (
            <span className="text-muted-foreground">Untitled quiz</span>
          )}
          {headerChanged ? <ChangeBadge change="changed" /> : null}
        </h2>
        {quiz.description ? (
          <p className="text-muted-foreground">{quiz.description}</p>
        ) : null}
        <p className="text-sm text-muted-foreground tabular-nums">
          {quiz.chapters.length}&nbsp;
          {quiz.chapters.length === 1 ? 'chapter' : 'chapters'} &middot; {total}
          &nbsp;{total === 1 ? 'question' : 'questions'}
          {quiz.exam
            ? ` · Mock exam: ${quiz.exam.questionCount} questions, ${quiz.exam.minutes} minutes, pass mark ${quiz.exam.passPercent}%`
            : ' · No mock exam'}
        </p>
        {removedChapters > 0 || removedQuestions > 0 ? (
          <p className="text-sm text-muted-foreground">
            Removed since your last save:{' '}
            {[
              removedChapters > 0 &&
                `${removedChapters} ${removedChapters === 1 ? 'chapter' : 'chapters'}`,
              removedQuestions > 0 &&
                `${removedQuestions} ${removedQuestions === 1 ? 'question' : 'questions'}`,
            ]
              .filter(Boolean)
              .join(', ')}
            .
          </p>
        ) : null}
      </header>

      {problems.length > 0 ? (
        <Alert>
          <TriangleAlertIcon />
          <AlertTitle>Not ready to save yet</AlertTitle>
          <AlertDescription>
            <ul className="list-disc pl-4">
              {problems.slice(0, 5).map((problem) => (
                <li key={problem}>{problem}</li>
              ))}
              {problems.length > 5 ? (
                <li>and {problems.length - 5} more</li>
              ) : null}
            </ul>
          </AlertDescription>
        </Alert>
      ) : null}

      {[...quiz.chapters]
        .sort((a, b) => a.number - b.number)
        .map((chapter) => (
          <section key={chapter.id} className="flex flex-col gap-3">
            <h3 className="flex flex-wrap items-center gap-2 text-lg font-semibold">
              {chapter.number}. {chapter.title}
              <ChangeBadge
                change={changeOf(chapterHeader(chapter), savedChapters)}
              />
            </h3>
            {chapter.questions.length === 0 ? (
              <p className="text-sm text-muted-foreground">No questions yet.</p>
            ) : (
              <ol className="flex flex-col gap-3">
                {chapter.questions.map((question, index) => (
                  <QuestionPreview
                    key={question.id}
                    question={question}
                    label={`${chapter.number}.${index + 1}`}
                    change={changeOf(question, savedQuestions)}
                  />
                ))}
              </ol>
            )}
          </section>
        ))}
    </div>
  )
}

function QuestionPreview({
  question,
  label,
  change,
}: {
  question: Question
  label: string
  change: Change
}) {
  const correct = new Set(getCorrectIndexes(question))
  return (
    <li
      className="flex flex-col gap-2 rounded-lg border bg-card p-4 text-card-foreground data-[change]:border-primary/50"
      data-change={change ?? undefined}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="font-medium">
          <span className="mr-2 text-muted-foreground tabular-nums">
            {label}
          </span>
          {question.question}
        </p>
        <ChangeBadge change={change} />
      </div>
      <ul className="flex flex-col gap-1 text-sm">
        {question.options.map((option, index) => (
          <li key={index} className="flex items-start gap-2">
            {correct.has(index) ? (
              <CheckIcon
                aria-label="Correct"
                className="mt-0.5 size-4 shrink-0 text-primary"
              />
            ) : (
              <span aria-hidden className="size-4 shrink-0" />
            )}
            <span
              className={
                correct.has(index) ? 'font-medium' : 'text-muted-foreground'
              }
            >
              {option}
            </span>
          </li>
        ))}
      </ul>
      <p className="text-sm text-muted-foreground">{question.explanation}</p>
    </li>
  )
}

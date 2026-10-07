import { useState } from 'react'
import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import type { ExamState } from '#/lib/exam-state'
import type { ExamConfig, Quiz } from '#/quizzes/types'
import { ExamResumePrompt } from '#/components/ExamResumePrompt'
import { ExamRunner } from '#/components/ExamRunner'
import { NotFound } from '#/components/NotFound'
import { clearExamSession, loadExamSession } from '#/lib/exam-session'
import { examReducer, startExam } from '#/lib/exam-state'
import { recordResult } from '#/lib/progress'
import { getQuiz } from '#/quizzes'

export const Route = createFileRoute('/quiz/$quizId/exam')({
  // Random question draw and shuffling: client-only component, see the
  // chapter route. The loader still runs on the server, so unknown quizzes and
  // quizzes without exam settings get a real 404.
  ssr: 'data-only',
  loader: ({ params }) => {
    if (!getQuiz(params.quizId)?.exam) throw notFound()
  },
  component: ExamPage,
  notFoundComponent: () => <NotFound message="Mock exam not found." />,
})

function ExamPage() {
  const { quizId } = Route.useParams()
  const quiz = getQuiz(quizId)
  const exam = quiz?.exam
  if (!quiz || !exam) return null

  return (
    <div>
      <Link
        to="/quiz/$quizId"
        params={{ quizId }}
        className="text-sm text-sky-700 hover:underline dark:text-sky-400"
      >
        &larr; {quiz.title}
      </Link>
      <h1 className="mt-3 mb-6 text-2xl font-bold">Mock exam</h1>
      <ExamStart quiz={quiz} exam={exam} />
    </div>
  )
}

type Start =
  // An unfinished exam with time left: the user decides what to do with it.
  { kind: 'prompt'; saved: ExamState } | { kind: 'run'; state: ExamState }

/** Decides between a new exam, the resume prompt and an expired saved exam. */
function ExamStart({ quiz, exam }: { quiz: Quiz; exam: ExamConfig }) {
  // The route renders on the client only (ssr: 'data-only'), so reading
  // localStorage and shuffling during init can't cause a hydration mismatch.
  const [start, setStart] = useState<Start>(() => {
    const saved = loadExamSession(quiz)
    if (!saved) return { kind: 'run', state: startExam(quiz, exam) }
    if (saved.endsAt > Date.now()) return { kind: 'prompt', saved }
    // Time ran out while away: submit what was picked. ExamRunner records the
    // result and deletes the session.
    return { kind: 'run', state: examReducer(saved, { type: 'submit' }) }
  })

  if (start.kind === 'prompt') {
    return (
      <ExamResumePrompt
        state={start.saved}
        onResume={() => setStart({ kind: 'run', state: start.saved })}
        onDiscard={() => {
          clearExamSession(quiz.id)
          setStart({ kind: 'run', state: startExam(quiz, exam) })
        }}
      />
    )
  }

  return (
    <ExamRunner
      quiz={quiz}
      exam={exam}
      initialState={start.state}
      onFinish={(score, total) =>
        recordResult(quiz.id, { exam: true }, score, total)
      }
    />
  )
}

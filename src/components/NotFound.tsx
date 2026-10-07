import { Link } from '@tanstack/react-router'

export function NotFound({
  message = 'Page not found.',
}: {
  message?: string
}) {
  return (
    <div className="py-16 text-center">
      <h1 className="text-2xl font-bold">Not found</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">{message}</p>
      <Link
        to="/"
        className="mt-6 inline-block rounded-lg bg-sky-600 px-4 py-2 font-medium text-white hover:bg-sky-700"
      >
        Back to quizzes
      </Link>
    </div>
  )
}

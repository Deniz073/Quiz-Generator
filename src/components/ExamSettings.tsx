import { useState } from 'react'
import type { FormEvent } from 'react'
import type { ExamConfig, Quiz } from '#/quizzes/types'
import { buttonClasses } from '#/lib/button-classes'
import { getExamLimits } from '#/domain/exam-settings'
import { countQuestions } from '#/quizzes'
import { saveExamSettings, useUserId } from '#/lib/user-data'

type Status = { kind: 'success' | 'error'; message: string }

interface Props {
  quiz: Quiz
  /** The quiz's own exam settings. */
  defaults: ExamConfig
  /** The settings in effect: the defaults with the user's adjustments. */
  config: ExamConfig
}

const fields = [
  { name: 'questionCount', label: 'Questions' },
  { name: 'minutes', label: 'Minutes' },
  { name: 'passPercent', label: 'Pass mark (%)' },
] as const

const inputClasses =
  'mt-1 w-24 rounded-md border border-slate-300 bg-white px-3 py-2 tabular-nums focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 dark:border-slate-700 dark:bg-slate-950'

/**
 * Lets a signed-in user change the mock exam's size, time limit and pass mark
 * for this quiz. Renders nothing for visitors.
 */
export function ExamSettings({ quiz, defaults, config }: Props) {
  const [status, setStatus] = useState<Status>()
  const [saving, setSaving] = useState(false)
  const userId = useUserId()
  const limits = getExamLimits(countQuestions(quiz))
  if (!userId) return null

  async function save(next: ExamConfig, message: string) {
    if (!userId) return
    setSaving(true)
    try {
      await saveExamSettings(userId, quiz.id, defaults, next)
      setStatus({ kind: 'success', message })
    } catch {
      setStatus({
        kind: 'error',
        message: 'Could not save the settings. Try again in a moment.',
      })
    } finally {
      setSaving(false)
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    // The inputs' min/max/step already blocked out-of-range values.
    const data = new FormData(event.currentTarget)
    const read = (name: keyof ExamConfig) => Number(data.get(name))
    void save(
      {
        questionCount: read('questionCount'),
        minutes: read('minutes'),
        passPercent: read('passPercent'),
      },
      'Settings saved.',
    )
  }

  return (
    <details className="mt-3 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      {/* Vertical padding (cancelled by the negative margin) makes the toggle
          a usable tap target without changing the layout. */}
      <summary className="-my-2 cursor-pointer py-2 text-sm font-medium">
        Adjust exam settings
      </summary>
      <form onSubmit={handleSubmit} className="mt-4">
        {/* Keyed by the values in effect, so the inputs pick up settings that
            arrive after loading or a reset. Only the inputs:
            remounting the buttons would drop focus after Save or Reset. */}
        <div
          key={`${config.questionCount}-${config.minutes}-${config.passPercent}`}
          className="flex flex-wrap gap-4"
        >
          {fields.map(({ name, label }) => (
            <label key={name} className="text-sm font-medium">
              {label}
              <input
                type="number"
                name={name}
                required
                step={1}
                min={limits[name].min}
                max={limits[name].max}
                defaultValue={config[name]}
                inputMode="numeric"
                autoComplete="off"
                className={`block ${inputClasses}`}
              />
            </label>
          ))}
        </div>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
          Default: {defaults.questionCount} questions, {defaults.minutes}{' '}
          minutes, pass mark {defaults.passPercent}%. Changes apply to the next
          exam you start; an unfinished exam keeps its own settings.
        </p>
        <div className="mt-3 flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={saving}
            className={buttonClasses('primary')}
          >
            Save
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={() => void save(defaults, 'Default settings restored.')}
            className={buttonClasses('secondary')}
          >
            Reset to defaults
          </button>
        </div>
      </form>
      {/* Always mounted: screen readers announce changes to an existing live region. */}
      <p
        role="status"
        className={`text-sm ${
          !status
            ? ''
            : status.kind === 'error'
              ? 'mt-2 text-red-700 dark:text-red-400'
              : 'mt-2 text-slate-600 dark:text-slate-400'
        }`}
      >
        {status?.message}
      </p>
    </details>
  )
}

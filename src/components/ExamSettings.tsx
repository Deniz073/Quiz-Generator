import { useId, useState } from 'react'
import type { FormEvent } from 'react'
import type { ExamConfig, Quiz } from '#/quizzes/types'
import { Button } from '#/components/ui/button'
import { Field, FieldDescription, FieldLabel } from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import { describeExamConfig } from '#/domain/exam-settings'
import { getExamLimits } from '#/quizzes/rules'
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

/**
 * Lets a signed-in user change the mock exam's size, time limit and pass mark
 * for this quiz. Renders nothing for visitors.
 */
export function ExamSettings({ quiz, defaults, config }: Props) {
  const id = useId()
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      {/* Keyed by the values in effect, so the inputs pick up settings that
          arrive after loading or a reset. Only the inputs: remounting the
          buttons would drop focus after Save or Reset. */}
      <div
        key={`${config.questionCount}-${config.minutes}-${config.passPercent}`}
        className="flex flex-wrap gap-4"
      >
        {fields.map(({ name, label }) => (
          <Field key={name} className="w-28">
            <FieldLabel htmlFor={`${id}-${name}`}>{label}</FieldLabel>
            <Input
              id={`${id}-${name}`}
              type="number"
              name={name}
              required
              step={1}
              min={limits[name].min}
              max={limits[name].max}
              defaultValue={config[name]}
              inputMode="numeric"
              autoComplete="off"
              className="tabular-nums"
            />
          </Field>
        ))}
      </div>
      <FieldDescription>
        Default: {describeExamConfig(defaults)}. Changes apply to the next exam
        you start; an unfinished exam keeps its own settings.
      </FieldDescription>
      <div className="flex flex-wrap items-center gap-2">
        <Button type="submit" disabled={saving}>
          Save
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={saving}
          onClick={() => void save(defaults, 'Default settings restored.')}
        >
          Reset to defaults
        </Button>
        {/* Always mounted: screen readers announce changes to an existing
            live region. */}
        <p
          role="status"
          className={
            status?.kind === 'error'
              ? 'text-sm text-destructive'
              : 'text-sm text-muted-foreground'
          }
        >
          {status?.message}
        </p>
      </div>
    </form>
  )
}

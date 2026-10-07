import { useRef, useState } from 'react'
import { exportBackup, importBackup, parseBackup } from '#/lib/backup'
import { buttonClasses } from '#/lib/button-classes'

type Status = { kind: 'success' | 'error'; message: string }

/** Export/import of the progress and flags saved in this browser. */
export function DataBackup() {
  const fileInput = useRef<HTMLInputElement>(null)
  const [status, setStatus] = useState<Status>()

  function handleExport() {
    try {
      exportBackup()
      setStatus({ kind: 'success', message: 'Backup downloaded.' })
    } catch (error) {
      console.error('Could not export saved data', error)
      setStatus({ kind: 'error', message: 'Could not read the saved data.' })
    }
  }

  async function handleFile(file: File) {
    let text: string
    try {
      text = await file.text()
    } catch (error) {
      console.error('Could not read backup file', error)
      setStatus({ kind: 'error', message: 'Could not read the file.' })
      return
    }
    const parsed = parseBackup(text)
    if ('error' in parsed) {
      setStatus({ kind: 'error', message: parsed.error })
      return
    }
    if (
      !window.confirm(
        'Replace the progress and flags saved in this browser with the backup?',
      )
    ) {
      return
    }
    try {
      importBackup(parsed.data)
      setStatus({ kind: 'success', message: 'Backup imported.' })
    } catch (error) {
      console.error('Could not import backup', error)
      setStatus({
        kind: 'error',
        message: 'Could not save the backup; your previous data was kept.',
      })
    }
  }

  return (
    <section className="mt-10">
      <h2 className="text-lg font-semibold">Your data</h2>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
        Progress and flagged questions are saved in this browser only. Export
        them to a file to keep a backup or move them to another browser.
      </p>
      <div className="mt-3 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleExport}
          className={buttonClasses('secondary')}
        >
          Export data
        </button>
        <button
          type="button"
          onClick={() => fileInput.current?.click()}
          className={buttonClasses('secondary')}
        >
          Import data
        </button>
        <input
          ref={fileInput}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0]
            // Reset so choosing the same file again still fires onChange.
            event.target.value = ''
            if (file) void handleFile(file)
          }}
        />
      </div>
      {status ? (
        <p
          role="status"
          className={`mt-2 text-sm ${
            status.kind === 'error'
              ? 'text-red-600 dark:text-red-400'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          {status.message}
        </p>
      ) : null}
    </section>
  )
}

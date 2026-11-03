import { useState } from 'react'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { Button } from '#/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import { apiKeysSchema } from '#/lib/api-keys-schema'
import type { ApiKeys } from '#/lib/api-keys-schema'
import { pageTitle } from '#/lib/page-title'
import { getApiKeys, saveApiKeys } from '#/lib/session'

export const Route = createFileRoute('/profile')({
  beforeLoad: ({ context }) => {
    if (!context.user) throw redirect({ to: '/login' })
  },
  // Keys are secrets: always fetch fresh, never serve a cached copy.
  loader: () => getApiKeys(),
  staleTime: 0,
  gcTime: 0,
  head: () => ({ meta: [{ title: pageTitle('Profile') }] }),
  component: ProfilePage,
})

const fields = [
  {
    name: 'claudeApiKey',
    label: 'Claude API key',
    description: 'Your Anthropic API key. Leave empty to remove it.',
  },
  {
    name: 'codexApiKey',
    label: 'Codex API key',
    description: 'Your OpenAI API key. Leave empty to remove it.',
  },
] as const

function ProfilePage() {
  const savedKeys = Route.useLoaderData()
  const { user } = Route.useRouteContext()
  const [status, setStatus] = useState<'saved' | 'error' | null>(null)

  const form = useForm<ApiKeys>({
    resolver: zodResolver(apiKeysSchema),
    defaultValues: savedKeys,
  })

  async function onSubmit(data: ApiKeys) {
    setStatus(null)
    try {
      await saveApiKeys({ data })
      // The saved values become the new baseline for the form.
      form.reset(data)
      setStatus('saved')
    } catch (error) {
      console.error('Failed to save API keys', error)
      setStatus('error')
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">
          Signed in as {user?.name} ({user?.email})
        </p>
      </div>
      <Card>
        <form onSubmit={form.handleSubmit(onSubmit)} className="contents">
          <CardHeader>
            <CardTitle>API keys</CardTitle>
            <CardDescription>
              Stored with your account. You can set one, both or neither.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              {fields.map(({ name, label, description }) => (
                <Controller
                  key={name}
                  name={name}
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={name}>{label}</FieldLabel>
                      <Input
                        {...field}
                        id={name}
                        type="password"
                        autoComplete="off"
                        spellCheck={false}
                        aria-invalid={fieldState.invalid}
                      />
                      <FieldDescription>{description}</FieldDescription>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              ))}
            </FieldGroup>
          </CardContent>
          <CardFooter className="flex items-center gap-3">
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Saving…' : 'Save'}
            </Button>
            <p role="status" className="text-sm text-muted-foreground">
              {status === 'saved' && 'Saved.'}
            </p>
            {status === 'error' && (
              <FieldError>Could not save your keys. Try again.</FieldError>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

import { useState } from 'react'
import { createFileRoute, redirect, useRouter } from '@tanstack/react-router'
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
import type {
  ApiKeyProvider,
  ApiKeyStatus,
  ApiKeys,
} from '#/lib/api-keys-schema'
import { pageTitle } from '#/lib/page-title'
import { getApiKeys, removeApiKey, saveApiKeys } from '#/lib/session'

export const Route = createFileRoute('/profile')({
  beforeLoad: ({ context }) => {
    if (!context.user) throw redirect({ to: '/login' })
  },
  // Always fetch the key status fresh, never serve a cached copy.
  loader: () => getApiKeys(),
  staleTime: 0,
  gcTime: 0,
  head: () => ({ meta: [{ title: pageTitle('Profile') }] }),
  component: ProfilePage,
})

const fields = [
  {
    name: 'claudeApiKey',
    provider: 'claude',
    label: 'Claude API key',
    description: 'Your Anthropic API key.',
  },
  {
    name: 'codexApiKey',
    provider: 'codex',
    label: 'Codex API key',
    description: 'Your OpenAI API key.',
  },
] as const

const emptyKeys: ApiKeys = { claudeApiKey: '', codexApiKey: '' }

function savedKeyText(status: ApiKeyStatus): string | null {
  if (status.state === 'set') return `Saved key ending in ${status.hint}.`
  if (status.state === 'unreadable')
    return 'Your saved key can no longer be read. Enter it again or remove it.'
  return null
}

function ProfilePage() {
  const keysStatus = Route.useLoaderData()
  const { user } = Route.useRouteContext()
  const router = useRouter()
  const [status, setStatus] = useState<'saved' | 'removed' | 'error' | null>(
    null,
  )
  const [removing, setRemoving] = useState<ApiKeyProvider | null>(null)
  const disabled = !keysStatus.storageConfigured

  // Write-only: the inputs start empty and never show a saved key.
  const form = useForm<ApiKeys>({
    resolver: zodResolver(apiKeysSchema),
    defaultValues: emptyKeys,
  })

  async function onSubmit(data: ApiKeys) {
    setStatus(null)
    try {
      await saveApiKeys({ data })
      form.reset(emptyKeys)
      await router.invalidate()
      setStatus('saved')
    } catch (error) {
      console.error('Failed to save API keys', error)
      setStatus('error')
    }
  }

  async function onRemove(provider: ApiKeyProvider) {
    setStatus(null)
    setRemoving(provider)
    try {
      await removeApiKey({ data: { provider } })
      await router.invalidate()
      setStatus('removed')
    } catch (error) {
      console.error('Failed to remove API key', error)
      setStatus('error')
    } finally {
      setRemoving(null)
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
              Stored encrypted with your account and never shown again after
              saving. Leave a field empty to keep the saved key.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              {disabled && (
                <FieldError>
                  Saving API keys is not available right now.
                </FieldError>
              )}
              {fields.map(({ name, provider, label, description }) => {
                const keyStatus = keysStatus[provider]
                const savedText = savedKeyText(keyStatus)
                return (
                  <Controller
                    key={name}
                    name={name}
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={name}>{label}</FieldLabel>
                        <div className="flex gap-2">
                          <Input
                            {...field}
                            id={name}
                            type="password"
                            autoComplete="off"
                            spellCheck={false}
                            disabled={disabled}
                            placeholder={
                              keyStatus.state === 'set'
                                ? keyStatus.hint
                                : undefined
                            }
                            aria-invalid={fieldState.invalid}
                          />
                          {keyStatus.state !== 'none' && (
                            <Button
                              type="button"
                              variant="outline"
                              disabled={removing !== null}
                              onClick={() => onRemove(provider)}
                            >
                              {removing === provider ? 'Removing…' : 'Remove'}
                            </Button>
                          )}
                        </div>
                        <FieldDescription>
                          {description} {savedText}
                        </FieldDescription>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                )
              })}
            </FieldGroup>
          </CardContent>
          <CardFooter className="flex items-center gap-3">
            <Button
              type="submit"
              disabled={disabled || form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? 'Saving…' : 'Save'}
            </Button>
            <p role="status" className="text-sm text-muted-foreground">
              {status === 'saved' && 'Saved.'}
              {status === 'removed' && 'Removed.'}
            </p>
            {status === 'error' && (
              <FieldError>Could not update your keys. Try again.</FieldError>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

import { useMemo, useRef, useState } from 'react'
import type { FormEvent, KeyboardEvent, ReactNode } from 'react'
import { fetchServerSentEvents, useChat } from '@tanstack/ai-react'
import type { UIMessage } from '@tanstack/ai-react'
import {
  ArrowUpIcon,
  BrainIcon,
  ChevronDownIcon,
  GlobeIcon,
  ListChecksIcon,
  PencilIcon,
  SquareIcon,
} from 'lucide-react'
import { Alert, AlertAction, AlertDescription } from '#/components/ui/alert'
import { Bubble, BubbleContent } from '#/components/ui/bubble'
import { Button } from '#/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '#/components/ui/dropdown-menu'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from '#/components/ui/input-group'
import { Message, MessageContent } from '#/components/ui/message'
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from '#/components/ui/message-scroller'
import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceDescription,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from '#/components/ui/trace'
import type { ApiKeyProvider } from '#/lib/api-keys-schema'
import { providerLabels } from '#/lib/api-keys-schema'
import { createQuizClientTools } from '#/lib/assistant-client-tools'
import type { WorkingCopyStore } from '#/lib/assistant-client-tools'
import { toolLabels } from '#/lib/assistant-tools'
import { outline } from '#/lib/working-copy'

/*
 * The quiz assistant's conversation. Not kept anywhere: a reload starts a new
 * one (see docs/adr/0002). Each user message carries, after the user's text,
 * the working copy's outline at that moment; it is part of the history from
 * then on, so the conversation the model sees never changes after the fact.
 * The chat shows only the user's text.
 */

const OUTLINE_SEPARATOR = '\n\n<quiz_outline>\n'

/** The user's own text of a message we sent: everything before the outline. */
function userText(content: string): string {
  const at = content.lastIndexOf(OUTLINE_SEPARATOR)
  return at === -1 ? content : content.slice(0, at)
}

/** Chat replies with **bold** and `code` shown as such; everything else as text. */
function ReplyText({ text }: { text: string }) {
  const pieces = text.split(/(\*\*[^*\n]+\*\*|`[^`\n]+`)/g)
  return (
    <>
      {pieces.map((piece, index) => {
        if (
          piece.startsWith('**') &&
          piece.endsWith('**') &&
          piece.length > 4
        ) {
          return <strong key={index}>{piece.slice(2, -2)}</strong>
        }
        if (piece.startsWith('`') && piece.endsWith('`') && piece.length > 2) {
          return (
            <code
              key={index}
              className="rounded bg-muted px-1 font-mono text-[0.9em]"
            >
              {piece.slice(1, -1)}
            </code>
          )
        }
        return piece
      })}
    </>
  )
}

type Part = UIMessage['parts'][number]
type ToolCall = Extract<Part, { type: 'tool-call' }>
type ToolResult = Extract<Part, { type: 'tool-result' }>

export function AssistantChat({
  store,
  providers,
  isNew,
}: {
  store: WorkingCopyStore
  providers: ReadonlyArray<ApiKeyProvider>
  isNew: boolean
}) {
  const [provider, setProvider] = useState<ApiKeyProvider>(providers[0])
  const providerRef = useRef(provider)
  providerRef.current = provider
  const [input, setInput] = useState('')
  const threadId = useMemo(() => crypto.randomUUID(), [])
  const tools = useMemo(() => createQuizClientTools(store), [store])
  const connection = useMemo(
    () =>
      fetchServerSentEvents('/api/assistant', () => ({
        body: { provider: providerRef.current },
      })),
    [store],
  )

  const chatState = useChat({ connection, threadId, tools })
  const { messages, sendMessage, isLoading, error, stop, reload, clear } =
    chatState
  // A failed continuation after quiz tools ran: retry just that, so the
  // changes already made are not made twice. Otherwise send the message again.
  const retry = chatState.interruptErrors.some((e) => e.retryable)
    ? chatState.retryInterrupts
    : () => void reload()
  const started = messages.length > 0

  function send(text: string) {
    void sendMessage(
      `${text}${OUTLINE_SEPARATOR}${outline(store.get().quiz)}\n</quiz_outline>`,
    )
  }

  function submit(event?: FormEvent) {
    event?.preventDefault()
    const text = input.trim()
    if (!text || isLoading) return
    setInput('')
    send(text)
  }

  function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (
      event.key === 'Enter' &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      event.preventDefault()
      submit()
    }
  }

  const suggestions = isNew
    ? [
        'Make a quiz about the basics of photosynthesis, about 10 questions',
        'Help me plan a quiz for an exam I am studying for',
      ]
    : [
        'Add 5 harder questions',
        'Check every explanation for mistakes',
        'Add a mock exam',
      ]

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="min-h-0 flex-1">
        <MessageScrollerProvider autoScroll>
          <MessageScroller>
            <MessageScrollerViewport>
              <MessageScrollerContent className="p-4">
                {!started ? (
                  <MessageScrollerItem messageId="intro">
                    <Intro isNew={isNew} />
                  </MessageScrollerItem>
                ) : null}
                {messages.map((message, index) => (
                  <MessageScrollerItem
                    key={message.id}
                    messageId={message.id}
                    scrollAnchor={message.role === 'user'}
                  >
                    <ChatMessage
                      message={message}
                      active={isLoading && index === messages.length - 1}
                    />
                  </MessageScrollerItem>
                ))}
                {isLoading && messages.at(-1)?.role === 'user' ? (
                  <MessageScrollerItem messageId="pending">
                    <Trace>
                      <TraceLine status="running">
                        <TraceIcon>
                          <BrainIcon />
                        </TraceIcon>
                        <TraceTitle>Thinking</TraceTitle>
                      </TraceLine>
                    </Trace>
                  </MessageScrollerItem>
                ) : null}
              </MessageScrollerContent>
            </MessageScrollerViewport>
            <MessageScrollerButton />
          </MessageScroller>
        </MessageScrollerProvider>
      </div>

      <div className="flex flex-col gap-2 border-t p-3">
        {error ? (
          <Alert variant="destructive">
            <AlertDescription>{friendlyError(error)}</AlertDescription>
            <AlertAction>
              <Button size="sm" variant="outline" onClick={retry}>
                Retry
              </Button>
            </AlertAction>
          </Alert>
        ) : null}
        {!started ? (
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion) => (
              <Button
                key={suggestion}
                variant="outline"
                size="sm"
                className="h-auto py-1 text-left whitespace-normal"
                onClick={() => send(suggestion)}
              >
                {suggestion}
              </Button>
            ))}
          </div>
        ) : null}
        <form onSubmit={submit}>
          <InputGroup>
            <InputGroupTextarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={onKeyDown}
              placeholder={
                isNew
                  ? 'What should the quiz be about? Paste notes or links too.'
                  : 'What should change in this quiz?'
              }
              aria-label="Message the quiz assistant"
              className="max-h-48 min-h-16"
            />
            <InputGroupAddon align="block-end" className="justify-between">
              <ProviderPicker
                providers={providers}
                provider={provider}
                // Each provider keeps its own reasoning and tool state in the
                // conversation: switching starts a new one.
                locked={started}
                onChange={setProvider}
              />
              <div className="flex items-center gap-1">
                {started && !isLoading ? (
                  <InputGroupButton onClick={clear}>New chat</InputGroupButton>
                ) : null}
                {isLoading ? (
                  <InputGroupButton
                    size="icon-sm"
                    variant="default"
                    onClick={stop}
                    aria-label="Stop"
                  >
                    <SquareIcon />
                  </InputGroupButton>
                ) : (
                  <InputGroupButton
                    type="submit"
                    size="icon-sm"
                    variant="default"
                    disabled={!input.trim()}
                    aria-label="Send"
                  >
                    <ArrowUpIcon />
                  </InputGroupButton>
                )}
              </div>
            </InputGroupAddon>
          </InputGroup>
        </form>
      </div>
    </div>
  )
}

function Intro({ isNew }: { isNew: boolean }) {
  return (
    <div className="flex flex-col gap-2 text-sm text-muted-foreground">
      <p className="text-base font-medium text-foreground">Quiz assistant</p>
      <p>
        {isNew
          ? 'Describe the quiz you want: the topic, your level, how many questions. You can paste notes or links; the assistant can also look things up on the web.'
          : 'Ask for changes to this quiz: new questions, fixes, a different focus. The assistant edits the preview; you decide when to save.'}
      </p>
      <p>Runs on your own API key. Nothing is saved until you click Save.</p>
    </div>
  )
}

function friendlyError(error: Error): string {
  const raw = error.message || 'Something went wrong.'
  // Provider errors arrive as "<status> <JSON body>": show the body's message.
  const nested = /"message":"((?:[^"\\]|\\.)*)"/.exec(raw)?.[1]
  const message = nested ? `${raw.split(' ')[0]} ${nested}` : raw
  // Our own endpoint's 401: the session ended, not the provider key.
  if (/status: 401/.test(message)) {
    return 'You were signed out. Sign in again to go on.'
  }
  if (/401|authentication|api[_ -]?key|invalid x-api-key/i.test(message)) {
    return 'The provider rejected your API key. Check it on your profile.'
  }
  if (/status: 413\b/.test(message)) {
    return 'This conversation is too long. Start a new chat to go on.'
  }
  if (/429|rate limit/i.test(message)) {
    return 'The provider is rate limiting your key. Wait a moment and retry.'
  }
  if (/credit|billing|quota|insufficient/i.test(message)) {
    return 'Your provider account has no credit left for this key.'
  }
  return message
}

function ProviderPicker({
  providers,
  provider,
  locked,
  onChange,
}: {
  providers: ReadonlyArray<ApiKeyProvider>
  provider: ApiKeyProvider
  locked: boolean
  onChange: (provider: ApiKeyProvider) => void
}) {
  if (providers.length < 2 || locked) {
    return (
      <span className="px-1.5 text-xs text-muted-foreground">
        {providerLabels[provider]}
      </span>
    )
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<InputGroupButton />}>
        {providerLabels[provider]}
        <ChevronDownIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuRadioGroup
          value={provider}
          onValueChange={(value) => onChange(value as ApiKeyProvider)}
        >
          {providers.map((p) => (
            <DropdownMenuRadioItem key={p} value={p}>
              {providerLabels[p]}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function ChatMessage({
  message,
  active,
}: {
  message: UIMessage
  /** The last message while the assistant is still working. */
  active: boolean
}) {
  if (message.role === 'user') {
    const text = message.parts
      .flatMap((part) => (part.type === 'text' ? [userText(part.content)] : []))
      .join('\n')
    return (
      <Message align="end">
        <MessageContent>
          <Bubble align="end">
            <BubbleContent className="whitespace-pre-wrap">
              {text}
            </BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
    )
  }
  if (message.role !== 'assistant') return null

  const results = new Map<string, ToolResult>()
  for (const part of message.parts) {
    if (part.type === 'tool-result') results.set(part.toolCallId, part)
  }

  // One Trace per run of activity; text ends a run.
  const blocks: Array<ReactNode> = []
  let run: Array<ReactNode> = []
  const flush = () => {
    if (run.length > 0) {
      blocks.push(<Trace key={`trace-${blocks.length}`}>{run}</Trace>)
      run = []
    }
  }
  message.parts.forEach((part, index) => {
    if (part.type === 'text') {
      if (!part.content.trim()) return
      flush()
      blocks.push(
        <Bubble key={index} variant="ghost">
          <BubbleContent className="whitespace-pre-wrap">
            <ReplyText text={part.content} />
          </BubbleContent>
        </Bubble>,
      )
    } else if (part.type === 'thinking') {
      if (!part.content.trim()) return
      const thinking = active && index === message.parts.length - 1
      run.push(
        <TraceCollapsible key={index}>
          <TraceCollapsibleTrigger>
            <TraceLine status={thinking ? 'running' : undefined}>
              <TraceIcon>
                <BrainIcon />
              </TraceIcon>
              <TraceTitle>{thinking ? 'Thinking' : 'Thought'}</TraceTitle>
            </TraceLine>
          </TraceCollapsibleTrigger>
          <TraceCollapsibleContent className="whitespace-pre-wrap">
            {part.content}
          </TraceCollapsibleContent>
        </TraceCollapsible>,
      )
    } else if (part.type === 'tool-call') {
      run.push(
        <ToolRow
          key={part.id}
          call={part}
          result={results.get(part.id)}
          active={active}
        />,
      )
    }
  })
  flush()

  if (blocks.length === 0) return null
  return (
    <Message>
      <MessageContent className="w-full gap-3">{blocks}</MessageContent>
    </Message>
  )
}

function toolInput(call: ToolCall): Record<string, unknown> {
  if (call.input && typeof call.input === 'object') {
    return call.input as Record<string, unknown>
  }
  try {
    const parsed: unknown = JSON.parse(call.arguments)
    return parsed && typeof parsed === 'object'
      ? (parsed as Record<string, unknown>)
      : {}
  } catch {
    return {}
  }
}

function toolIcon(name: string) {
  if (name === 'web_search' || name === 'web_fetch') return <GlobeIcon />
  if (name === 'get_outline' || name === 'read_questions') {
    return <ListChecksIcon />
  }
  return <PencilIcon />
}

function ToolRow({
  call,
  result,
  active,
}: {
  call: ToolCall
  result: ToolResult | undefined
  active: boolean
}) {
  const input = toolInput(call)
  const output = call.output as Record<string, unknown> | undefined
  const failed =
    call.state === 'error' || result?.state === 'error' || output?.ok === false
  const finished =
    failed || output !== undefined || result !== undefined || !active
  const label = toolLabels[call.name] ?? {
    running: `Running ${call.name}`,
    done: `Ran ${call.name}`,
  }

  let detail: string | undefined
  if (call.name === 'web_search' && typeof input.query === 'string') {
    detail = input.query
  } else if (call.name === 'web_fetch' && typeof input.url === 'string') {
    detail = input.url
  } else if (call.name === 'add_questions' && Array.isArray(output?.addedIds)) {
    detail = `${output.addedIds.length} added`
    if (Array.isArray(output.rejected) && output.rejected.length > 0) {
      detail += `, ${output.rejected.length} rejected`
    }
  } else if (
    call.name === 'remove_questions' &&
    Array.isArray(input.questionIds)
  ) {
    detail = `${input.questionIds.length}`
  }
  const error = typeof output?.error === 'string' ? output.error : result?.error

  const line = (
    <TraceLine status={failed ? 'error' : finished ? undefined : 'running'}>
      <TraceIcon>{toolIcon(call.name)}</TraceIcon>
      <TraceTitle>
        {failed
          ? `Failed: ${label.running.toLowerCase()}`
          : finished
            ? label.done
            : label.running}
      </TraceTitle>
      {detail ? <TraceDescription>{detail}</TraceDescription> : null}
    </TraceLine>
  )
  if (!failed || !error) return line
  return (
    <TraceCollapsible>
      <TraceCollapsibleTrigger>{line}</TraceCollapsibleTrigger>
      <TraceCollapsibleContent>{error}</TraceCollapsibleContent>
    </TraceCollapsible>
  )
}

import { useId, useState } from 'react'
import type { ComponentType, FormEvent, ReactNode } from 'react'
import type { Editor } from '@tiptap/react'
import { useEditorState } from '@tiptap/react'
import {
  BoldIcon,
  CodeIcon,
  ExternalLinkIcon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  ImageIcon,
  ItalicIcon,
  LinkIcon,
  ListIcon,
  ListOrderedIcon,
  MinusIcon,
  QuoteIcon,
  SquareCodeIcon,
  StrikethroughIcon,
  TableIcon,
} from 'lucide-react'
import { Button } from '#/components/ui/button'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTitle,
  PopoverTrigger,
} from '#/components/ui/popover'
import { Separator } from '#/components/ui/separator'
import { Toggle } from '#/components/ui/toggle'
import { isAllowedImageUrl, isAllowedLinkUrl } from '#/domain/notes'

/*
 * The note editor's toolbar. Everything here also has a markdown shortcut
 * (typing `## `, `**bold**`, `- `, `> `, ``` and so on); links and images
 * get a small form for their URL.
 */

/** "example.com" as people type it: https is assumed. */
function withScheme(url: string): string {
  const trimmed = url.trim()
  if (trimmed === '' || /^[a-z][a-z\d+.-]*:/i.test(trimmed)) return trimmed
  return `https://${trimmed}`
}

export function NoteToolbar({ editor }: { editor: Editor }) {
  // Re-renders the toolbar when the selection or its formatting changes.
  const state = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      h1: e.isActive('heading', { level: 1 }),
      h2: e.isActive('heading', { level: 2 }),
      h3: e.isActive('heading', { level: 3 }),
      bold: e.isActive('bold'),
      italic: e.isActive('italic'),
      strike: e.isActive('strike'),
      code: e.isActive('code'),
      bulletList: e.isActive('bulletList'),
      orderedList: e.isActive('orderedList'),
      blockquote: e.isActive('blockquote'),
      codeBlock: e.isActive('codeBlock'),
      link: e.isActive('link'),
      inTable: e.isActive('table'),
      inHeaderRow: e.isActive('tableHeader'),
    }),
  })
  const chain = () => editor.chain().focus()

  return (
    <div
      role="toolbar"
      aria-label="Formatting"
      aria-controls="note-content"
      className="flex flex-wrap items-center gap-1 border-b p-1"
    >
      <Mark
        label="Heading 1"
        icon={Heading1Icon}
        pressed={state.h1}
        onToggle={() => chain().toggleHeading({ level: 1 }).run()}
      />
      <Mark
        label="Heading 2"
        icon={Heading2Icon}
        pressed={state.h2}
        onToggle={() => chain().toggleHeading({ level: 2 }).run()}
      />
      <Mark
        label="Heading 3"
        icon={Heading3Icon}
        pressed={state.h3}
        onToggle={() => chain().toggleHeading({ level: 3 }).run()}
      />
      <Divider />
      <Mark
        label="Bold"
        icon={BoldIcon}
        pressed={state.bold}
        onToggle={() => chain().toggleBold().run()}
      />
      <Mark
        label="Italic"
        icon={ItalicIcon}
        pressed={state.italic}
        onToggle={() => chain().toggleItalic().run()}
      />
      <Mark
        label="Strikethrough"
        icon={StrikethroughIcon}
        pressed={state.strike}
        onToggle={() => chain().toggleStrike().run()}
      />
      <Mark
        label="Inline code"
        icon={CodeIcon}
        pressed={state.code}
        onToggle={() => chain().toggleCode().run()}
      />
      <Divider />
      <Mark
        label="Bulleted list"
        icon={ListIcon}
        pressed={state.bulletList}
        onToggle={() => chain().toggleBulletList().run()}
      />
      <Mark
        label="Numbered list"
        icon={ListOrderedIcon}
        pressed={state.orderedList}
        onToggle={() => chain().toggleOrderedList().run()}
      />
      <Mark
        label="Quote"
        icon={QuoteIcon}
        pressed={state.blockquote}
        onToggle={() => chain().toggleBlockquote().run()}
      />
      <Mark
        label="Code block"
        icon={SquareCodeIcon}
        pressed={state.codeBlock}
        onToggle={() => chain().toggleCodeBlock().run()}
      />
      <Button
        variant="ghost"
        size="icon"
        aria-label="Horizontal line"
        title="Horizontal line"
        onClick={() => chain().setHorizontalRule().run()}
      >
        <MinusIcon />
      </Button>
      <Divider />
      <LinkForm editor={editor} active={state.link} />
      <ImageForm editor={editor} />
      <Button
        variant="ghost"
        size="icon"
        aria-label="Insert table"
        title="Insert table"
        disabled={state.inTable}
        onClick={() =>
          chain().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
        }
      >
        <TableIcon />
      </Button>
      {state.inTable ? (
        <TableTools editor={editor} inHeaderRow={state.inHeaderRow} />
      ) : null}
    </div>
  )
}

function Divider() {
  return <Separator orientation="vertical" className="mx-1 h-6" />
}

function Mark({
  label,
  icon: Icon,
  pressed,
  onToggle,
}: {
  label: string
  icon: ComponentType
  pressed: boolean
  onToggle: () => void
}) {
  return (
    <Toggle
      aria-label={label}
      title={label}
      pressed={pressed}
      onPressedChange={onToggle}
    >
      <Icon />
    </Toggle>
  )
}

/** Rows and columns of the table the cursor is in (a header row stays). */
function TableTools({
  editor,
  inHeaderRow,
}: {
  editor: Editor
  inHeaderRow: boolean
}) {
  const chain = () => editor.chain().focus()
  return (
    <div className="flex flex-wrap items-center gap-1" aria-label="Table">
      <Divider />
      <Button
        variant="ghost"
        size="sm"
        onClick={() => chain().addRowAfter().run()}
      >
        Add row
      </Button>
      <Button
        variant="ghost"
        size="sm"
        // The first row is the table's header (markdown needs one).
        disabled={inHeaderRow}
        onClick={() => chain().deleteRow().run()}
      >
        Delete row
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => chain().addColumnAfter().run()}
      >
        Add column
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => chain().deleteColumn().run()}
      >
        Delete column
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => chain().deleteTable().run()}
      >
        Delete table
      </Button>
    </div>
  )
}

/** A toolbar button that opens a small form in a popover. */
function ToolbarPopover({
  label,
  icon: Icon,
  pressed = false,
  open,
  onOpenChange,
  children,
}: {
  label: string
  icon: ComponentType
  pressed?: boolean
  open: boolean
  onOpenChange: (open: boolean) => void
  children: ReactNode
}) {
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger
        render={
          <Toggle
            aria-label={label}
            title={label}
            pressed={pressed}
            onPressedChange={() => {}}
          />
        }
      >
        <Icon />
      </PopoverTrigger>
      <PopoverContent align="start" className="w-80">
        <PopoverTitle>{label}</PopoverTitle>
        {children}
      </PopoverContent>
    </Popover>
  )
}

function LinkForm({ editor, active }: { editor: Editor; active: boolean }) {
  const id = useId()
  const [open, setOpen] = useState(false)
  const [url, setUrl] = useState('')
  const [error, setError] = useState<string | null>(null)
  const current = active
    ? (editor.getAttributes('link').href as string | undefined)
    : undefined

  const onOpenChange = (next: boolean) => {
    setOpen(next)
    if (next) {
      setUrl(current ?? '')
      setError(null)
    }
  }

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const href = withScheme(url)
    if (href === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      setOpen(false)
      return
    }
    if (!isAllowedLinkUrl(href)) {
      setError('Use a web address (https://…) or an email link (mailto:…).')
      return
    }
    const { empty } = editor.state.selection
    if (empty && !active) {
      // Nothing selected: insert the address itself as the link text.
      editor
        .chain()
        .focus()
        .insertContent({
          type: 'text',
          text: href,
          marks: [{ type: 'link', attrs: { href } }],
        })
        .run()
    } else {
      editor.chain().focus().extendMarkRange('link').setLink({ href }).run()
    }
    setOpen(false)
  }

  const remove = () => {
    editor.chain().focus().extendMarkRange('link').unsetLink().run()
    setOpen(false)
  }

  return (
    <ToolbarPopover
      label="Link"
      icon={LinkIcon}
      pressed={active}
      open={open}
      onOpenChange={onOpenChange}
    >
      <form onSubmit={submit} noValidate>
        <FieldGroup className="gap-3">
          <Field data-invalid={error ? true : undefined}>
            <FieldLabel htmlFor={`${id}-url`}>Address</FieldLabel>
            <Input
              id={`${id}-url`}
              type="url"
              inputMode="url"
              placeholder="https://example.com"
              value={url}
              aria-invalid={error ? true : undefined}
              onChange={(event) => {
                setUrl(event.target.value)
                setError(null)
              }}
            />
            {error ? <FieldError>{error}</FieldError> : null}
          </Field>
          <div className="flex flex-wrap items-center gap-2">
            <Button type="submit" size="sm">
              {active ? 'Update link' : 'Add link'}
            </Button>
            {active ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={remove}
              >
                Remove link
              </Button>
            ) : null}
            {current && isAllowedLinkUrl(current) ? (
              <Button
                variant="ghost"
                size="sm"
                nativeButton={false}
                render={
                  <a href={current} target="_blank" rel="noopener noreferrer" />
                }
              >
                <ExternalLinkIcon data-icon="inline-start" />
                Open
              </Button>
            ) : null}
          </div>
        </FieldGroup>
      </form>
    </ToolbarPopover>
  )
}

function ImageForm({ editor }: { editor: Editor }) {
  const id = useId()
  const [open, setOpen] = useState(false)
  const [src, setSrc] = useState('')
  const [alt, setAlt] = useState('')
  const [error, setError] = useState<string | null>(null)

  const onOpenChange = (next: boolean) => {
    setOpen(next)
    if (next) {
      setSrc('')
      setAlt('')
      setError(null)
    }
  }

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const url = withScheme(src)
    if (!isAllowedImageUrl(url)) {
      setError(
        'Use the address of an image on the web, starting with https://.',
      )
      return
    }
    editor
      .chain()
      .focus()
      .setImage({ src: url, alt: alt.trim() || undefined })
      .run()
    setOpen(false)
  }

  return (
    <ToolbarPopover
      label="Image"
      icon={ImageIcon}
      open={open}
      onOpenChange={onOpenChange}
    >
      <form onSubmit={submit} noValidate>
        <FieldGroup className="gap-3">
          <Field data-invalid={error ? true : undefined}>
            <FieldLabel htmlFor={`${id}-src`}>Image address</FieldLabel>
            <Input
              id={`${id}-src`}
              type="url"
              inputMode="url"
              placeholder="https://example.com/diagram.png"
              value={src}
              aria-invalid={error ? true : undefined}
              onChange={(event) => {
                setSrc(event.target.value)
                setError(null)
              }}
            />
            {error ? <FieldError>{error}</FieldError> : null}
          </Field>
          <Field>
            <FieldLabel htmlFor={`${id}-alt`}>Description</FieldLabel>
            <Input
              id={`${id}-alt`}
              placeholder="What the image shows"
              value={alt}
              onChange={(event) => setAlt(event.target.value)}
            />
          </Field>
          <div>
            <Button type="submit" size="sm">
              Add image
            </Button>
          </div>
        </FieldGroup>
      </form>
    </ToolbarPopover>
  )
}

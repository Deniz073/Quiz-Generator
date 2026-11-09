import { Marked } from 'marked'
import type { marked } from 'marked'
import { Extension, InputRule } from '@tiptap/core'
import type { AnyExtension, JSONContent, MarkdownTokenizer } from '@tiptap/core'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import {
  Table,
  TableCell,
  TableHeader,
  TableKit,
} from '@tiptap/extension-table'
import { Markdown, MarkdownManager } from '@tiptap/markdown'
import StarterKit from '@tiptap/starter-kit'
import { isAllowedImageUrl, isAllowedLinkUrl } from '#/domain/notes'

/*
 * What a note may contain, and how it is read from and written to markdown.
 * Shared by the note editor (browser) and the server functions, which parse
 * a note the same way to check its links and images before saving it.
 *
 * Markdown is the stored form, so only what round-trips through markdown is
 * offered: no underline, no merged or resized table cells, and table cells
 * hold one line of inline content (Enter moves to the next cell). Raw HTML
 * in the markdown is not parsed: it shows as text. The one exception is
 * `<br>`, which the table writer uses for line breaks within a cell.
 */

/** Exactly a `<br>` tag, the only HTML a note's markdown may contain. */
const BR_TAG = /^<br\s*\/?>/i

/**
 * A markdown parser of its own (the editor adds its tokenizers to it), with
 * raw HTML read as plain text.
 */
function createNoteMarked(): typeof marked {
  const instance = new Marked()
  instance.use({
    tokenizer: {
      // Undefined: not HTML; the paragraph and text tokenizers take it.
      html: () => undefined,
      // False: the default tokenizer, for a <br> only.
      tag: (src) => (BR_TAG.test(src) ? false : undefined),
    },
  })
  // A Marked instance has the API of the `marked` singleton the extension
  // types expect.
  return instance as unknown as typeof marked
}

/*
 * Writing links and images as markdown: the stock writers copy the URL, alt
 * text and title as they are, so a space, an unbalanced parenthesis or a
 * bracket would break the markdown and the link or image would not come
 * back. These encode or drop what would.
 */

/** A URL as a markdown link destination. */
function markdownUrl(url: string): string {
  return url.replace(
    /[\s()<>]/g,
    (c) => `%${c.charCodeAt(0).toString(16).toUpperCase().padStart(2, '0')}`,
  )
}

/** A link or image title, between double quotes. */
function markdownTitle(title: string): string {
  return title.replace(/\s+/g, ' ').replace(/["\\]/g, '\\$&')
}

/** An image's alt text, between square brackets. */
function markdownAlt(alt: string): string {
  return alt.replace(/[[\]\\]/g, '').replace(/\s+/g, ' ')
}

function attr(node: JSONContent, name: string): string {
  const value: unknown = node.attrs?.[name]
  return typeof value === 'string' ? value : ''
}

const NoteLink = Link.extend({
  renderMarkdown: (node, h) => {
    const href = markdownUrl(attr(node, 'href'))
    const title = markdownTitle(attr(node, 'title'))
    const text = h.renderChildren(node)
    return title ? `[${text}](${href} "${title}")` : `[${text}](${href})`
  },
}).configure({
  openOnClick: false,
  // Typed or pasted absolute URLs only, the same rule as the server's (so
  // "example.com" is not linked; "https://example.com" is).
  autolink: true,
  defaultProtocol: 'https',
  isAllowedUri: (url) => isAllowedLinkUrl(url),
  HTMLAttributes: { rel: 'noopener noreferrer nofollow', target: '_blank' },
})

/**
 * An image, only ever from an https URL: pasted HTML and the `![alt](url)`
 * shortcut with any other source make no image (instead of an invisible one
 * that the server would refuse to save).
 */
const NoteImage = Image.extend({
  parseHTML() {
    return [
      {
        tag: 'img[src]',
        getAttrs: (element: HTMLElement) =>
          isAllowedImageUrl(element.getAttribute('src') ?? '') ? null : false,
      },
    ]
  },
  addAttributes() {
    return {
      ...this.parent?.(),
      src: {
        default: null,
        renderHTML: (attributes: { src?: string | null }) =>
          attributes.src && isAllowedImageUrl(attributes.src)
            ? { src: attributes.src }
            : {},
      },
    }
  },
  addInputRules() {
    return (this.parent?.() ?? []).map(
      (rule) =>
        new InputRule({
          find: rule.find,
          handler: (props) => {
            // The image shortcut's third group is the URL.
            const src: string | undefined = props.match[3]
            return src && isAllowedImageUrl(src) ? rule.handler(props) : null
          },
        }),
    )
  },
  renderMarkdown: (node) => {
    const src = markdownUrl(attr(node, 'src'))
    const alt = markdownAlt(attr(node, 'alt'))
    const title = markdownTitle(attr(node, 'title'))
    return title ? `![${alt}](${src} "${title}")` : `![${alt}](${src})`
  },
}).configure({
  // Inline: markdown images sit inside paragraphs (and table cells).
  inline: true,
  allowBase64: false,
  HTMLAttributes: { referrerpolicy: 'no-referrer', loading: 'lazy' },
})

/** The first two lines of `src` are a table's header row and separator. */
function startsWithTable(src: string): boolean {
  const firstEnd = src.indexOf('\n')
  if (firstEnd < 0) return false
  const secondEnd = src.indexOf('\n', firstEnd + 1)
  const separator = src.slice(
    firstEnd + 1,
    secondEnd < 0 ? undefined : secondEnd,
  )
  return (
    /^[ \t|:]*-[ \t|:-]*$/.test(separator) &&
    separator.includes('|') &&
    src.slice(0, firstEnd).includes('|')
  )
}

/**
 * The stock table tokenizer splits the whole rest of the document into
 * lines at every block, which makes parsing quadratic: a long note could
 * keep the server busy for seconds. The same check on the first two lines
 * comes first, so only real tables reach it.
 */
const stockTableTokenizer: MarkdownTokenizer | undefined =
  Table.config.markdownTokenizer
const NoteTable = Table.extend({
  markdownTokenizer: stockTableTokenizer && {
    ...stockTableTokenizer,
    start: (src) => (startsWithTable(src) ? 0 : -1),
    tokenize: (src, tokens, lexer) =>
      startsWithTable(src)
        ? stockTableTokenizer.tokenize(src, tokens, lexer)
        : undefined,
  },
}).configure({ resizable: false, renderWrapper: true })

/**
 * Enter in a table cell moves to the next cell (adding a row after the last
 * one): a cell holds a single paragraph.
 */
const NextCellOnEnter = Extension.create({
  name: 'noteNextCellOnEnter',
  addKeyboardShortcuts() {
    return {
      Enter: () => {
        const { editor } = this
        if (!editor.isActive('tableCell') && !editor.isActive('tableHeader')) {
          return false
        }
        if (editor.commands.goToNextCell()) return true
        return editor.chain().addRowAfter().goToNextCell().run()
      },
    }
  },
})

/** The editor's content extensions, without the markdown one. */
function contentExtensions(): Array<AnyExtension> {
  return [
    StarterKit.configure({
      heading: { levels: [1, 2, 3] },
      underline: false,
      link: false,
    }),
    NoteLink,
    NoteImage,
    TableKit.configure({ table: false, tableCell: false, tableHeader: false }),
    NoteTable,
    TableCell.extend({ content: 'paragraph' }),
    TableHeader.extend({ content: 'paragraph' }),
  ]
}

/** Every extension of the note editor. */
export function noteEditorExtensions(): Array<AnyExtension> {
  return [
    ...contentExtensions(),
    NextCellOnEnter,
    Markdown.configure({ marked: createNoteMarked() }),
  ]
}

/** Calls `visit` for every node of a parsed document, depth first. */
function walk(node: JSONContent, visit: (node: JSONContent) => void): void {
  visit(node)
  node.content?.forEach((child) => walk(child, visit))
}

/**
 * The links and images of a note's markdown that a note may not contain, as
 * the editor would read them. Empty: the note may be saved. Server side.
 */
export function findDisallowedUrls(markdown: string): Array<string> {
  const manager = new MarkdownManager({
    marked: createNoteMarked(),
    extensions: contentExtensions(),
  })
  const disallowed: Array<string> = []
  const check = (url: unknown, allowed: (url: string) => boolean) => {
    if (typeof url !== 'string' || !allowed(url)) {
      disallowed.push(typeof url === 'string' && url !== '' ? url : '(empty)')
    }
  }
  walk(manager.parse(markdown), (node) => {
    if (node.type === 'image') check(node.attrs?.src, isAllowedImageUrl)
    for (const mark of node.marks ?? []) {
      if (mark.type === 'link') check(mark.attrs?.href, isAllowedLinkUrl)
    }
  })
  return disallowed
}

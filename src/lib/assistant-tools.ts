import { toolDefinition } from '@tanstack/ai'
import { z } from 'zod'
import { examConfigInput } from '#/lib/api-inputs'
import { MAX_OPTIONS, MIN_OPTIONS } from '#/quizzes/rules'

/*
 * The quiz assistant's quiz tools. Shared definitions: the server hands them
 * to the model (definitions only, no implementation), the browser implements
 * them on the working copy (see QuizAssistant). Nothing here writes to the
 * database; only Save does. See docs/adr/0002.
 */

/** The tag around the working copy's outline at the end of each user message. */
export const OUTLINE_TAG = 'quiz_outline'

const OUTLINE_START = `\n\n<${OUTLINE_TAG}>\n`

/** A user message as sent: the user's text, then the outline. */
export function withOutline(text: string, outline: string): string {
  return `${text}${OUTLINE_START}${outline}\n</${OUTLINE_TAG}>`
}

/** The user's own text of a message sent with withOutline. */
export function withoutOutline(content: string): string {
  const at = content.lastIndexOf(OUTLINE_START)
  return at === -1 ? content : content.slice(0, at)
}

const questionInput = z.object({
  question: z.string().meta({
    description:
      'The question text. For multiple-answer questions state the count, e.g. "Select two."',
  }),
  options: z.array(z.string()).meta({
    description: `${MIN_OPTIONS}-${MAX_OPTIONS} answer options (usually 4), no duplicates.`,
  }),
  correctIndexes: z.array(z.number().int()).meta({
    description:
      '0-based indexes into options of the correct answers: one entry for a single-answer question, 2 or more (but fewer than all options) for a multiple-answer question.',
  }),
  explanation: z.string().meta({
    description:
      '1-3 sentences: why the answer is correct and why the most tempting wrong option is wrong.',
  }),
})

export const getOutlineDef = toolDefinition({
  name: 'get_outline',
  description:
    'Returns the current outline of the working copy: title, description, mock exam settings, and every chapter and question id with the question text. Use it when unsure of the current state.',
  inputSchema: z.object({}),
})

export const readQuestionsDef = toolDefinition({
  name: 'read_questions',
  description:
    'Returns full questions (options, correct indexes, explanation) by question ids or for one chapter. Read a question before changing it.',
  inputSchema: z.object({
    questionIds: z.array(z.string()).optional(),
    chapterId: z.string().optional(),
  }),
})

export const setQuizDetailsDef = toolDefinition({
  name: 'set_quiz_details',
  description: "Sets the quiz's title and/or its one-sentence description.",
  inputSchema: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
  }),
})

export const setMockExamDef = toolDefinition({
  name: 'set_mock_exam',
  description:
    'Sets the timed mock exam settings, or removes the mock exam with exam: null. questionCount can be at most the number of questions in the quiz.',
  inputSchema: z.object({
    exam: examConfigInput.nullable(),
  }),
})

export const addChapterDef = toolDefinition({
  name: 'add_chapter',
  description:
    'Adds an empty chapter at the end and returns its id. Add questions to it right after: a chapter needs at least one question.',
  inputSchema: z.object({ title: z.string() }),
})

export const renameChapterDef = toolDefinition({
  name: 'rename_chapter',
  description: "Changes a chapter's title. Its id never changes.",
  inputSchema: z.object({ chapterId: z.string(), title: z.string() }),
})

export const removeChapterDef = toolDefinition({
  name: 'remove_chapter',
  description:
    'Removes a chapter with all its questions. Only when the user asked for it.',
  inputSchema: z.object({ chapterId: z.string() }),
})

export const addQuestionsDef = toolDefinition({
  name: 'add_questions',
  description:
    'Adds questions at the end of a chapter (ids are assigned for you). Invalid questions are rejected with the reasons; fix and add them again. Add at most about 10 per call.',
  inputSchema: z.object({
    chapterId: z.string(),
    questions: z.array(questionInput),
  }),
})

export const updateQuestionDef = toolDefinition({
  name: 'update_question',
  description:
    'Changes fields of one question; fields left out stay as they are. When changing options, also give correctIndexes. chapterId moves the question to the end of that chapter. Its id never changes.',
  inputSchema: z.object({
    questionId: z.string(),
    question: z.string().optional(),
    options: z.array(z.string()).optional(),
    correctIndexes: z.array(z.number().int()).optional(),
    explanation: z.string().optional(),
    chapterId: z.string().optional(),
  }),
})

export const removeQuestionsDef = toolDefinition({
  name: 'remove_questions',
  description:
    'Removes questions by id. Only when the user asked for it, or to replace a question that cannot be fixed.',
  inputSchema: z.object({ questionIds: z.array(z.string()) }),
})

export type QuizToolName = (typeof quizToolDefs)[number]['name']

/** Every quiz tool, as the server declares them to the model. */
export const quizToolDefs = [
  getOutlineDef,
  readQuestionsDef,
  setQuizDetailsDef,
  setMockExamDef,
  addChapterDef,
  renameChapterDef,
  removeChapterDef,
  addQuestionsDef,
  updateQuestionDef,
  removeQuestionsDef,
] as const

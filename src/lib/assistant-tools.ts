import { toolDefinition } from '@tanstack/ai'
import { z } from 'zod'

/*
 * The quiz assistant's quiz tools. Shared definitions: the server hands them
 * to the model (definitions only, no implementation), the browser implements
 * them on the working copy (see QuizAssistant). Nothing here writes to the
 * database; only Save does. See docs/adr/0002.
 */

const questionInput = z.object({
  question: z.string().meta({
    description:
      'The question text. For multiple-answer questions state the count, e.g. "Select two."',
  }),
  options: z
    .array(z.string())
    .meta({ description: '2-6 answer options (usually 4), no duplicates.' }),
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
    exam: z
      .object({
        questionCount: z.number().int(),
        minutes: z.number().int(),
        passPercent: z.number().int(),
      })
      .nullable(),
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

/** Names the chat shows for a tool call, by tool name. */
export const toolLabels: Record<string, { running: string; done: string }> = {
  get_outline: { running: 'Reading the quiz', done: 'Read the quiz' },
  read_questions: { running: 'Reading questions', done: 'Read questions' },
  set_quiz_details: { running: 'Updating details', done: 'Updated details' },
  set_mock_exam: {
    running: 'Updating mock exam',
    done: 'Updated mock exam',
  },
  add_chapter: { running: 'Adding a chapter', done: 'Added a chapter' },
  rename_chapter: { running: 'Renaming a chapter', done: 'Renamed a chapter' },
  remove_chapter: { running: 'Removing a chapter', done: 'Removed a chapter' },
  add_questions: { running: 'Adding questions', done: 'Added questions' },
  update_question: {
    running: 'Changing a question',
    done: 'Changed a question',
  },
  remove_questions: {
    running: 'Removing questions',
    done: 'Removed questions',
  },
  web_search: { running: 'Searching the web', done: 'Searched the web' },
  web_fetch: { running: 'Reading a page', done: 'Read a page' },
}

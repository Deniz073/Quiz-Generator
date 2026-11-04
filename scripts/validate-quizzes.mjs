// Loads every seed quiz (src/db/seed/quizzes) through Vite's module runner
// (the data files use extensionless imports and the `#/` alias) and prints a
// summary, or the validation errors. Also runs before `npm run build`, so a
// broken seed quiz never gets deployed. `npm run db:seed` validates again
// before writing anything.
import { createServer } from 'vite'

const server = await createServer({
  configFile: false,
  logLevel: 'silent',
  appType: 'custom',
  server: { middlewareMode: true, hmr: false, watch: null },
  optimizeDeps: { noDiscovery: true },
  resolve: { tsconfigPaths: true },
})

let exitCode = 0
try {
  const { seedQuizzes } = await server.ssrLoadModule(
    '/src/db/seed/quizzes/index.ts',
  )
  const { validateQuizzes } = await server.ssrLoadModule(
    '/src/quizzes/validate.ts',
  )
  const quizzes = seedQuizzes
  const errors = validateQuizzes(quizzes)
  const ids = quizzes.map((quiz) => quiz.id)
  for (const id of new Set(ids)) {
    if (ids.indexOf(id) !== ids.lastIndexOf(id)) {
      errors.push(`Quiz id "${id}" is used by two seed quizzes.`)
    }
  }
  if (errors.length > 0) {
    throw new Error(
      `Invalid seed quizzes (${errors.length}):\n` +
        errors.map((error) => `  - ${error}`).join('\n'),
    )
  }
  let chapters = 0
  let questions = 0
  let multi = 0
  for (const quiz of quizzes) {
    const quizQuestions = quiz.chapters.reduce(
      (total, chapter) => total + chapter.questions.length,
      0,
    )
    chapters += quiz.chapters.length
    questions += quizQuestions
    for (const chapter of quiz.chapters) {
      multi += chapter.questions.filter((q) => 'correctIndexes' in q).length
    }
    console.log(
      `  ${quiz.id}: ${quiz.chapters.length} chapters, ${quizQuestions} questions`,
    )
  }
  console.log(
    `OK: ${quizzes.length} quizzes, ${chapters} chapters, ${questions} questions (${multi} multi-answer)`,
  )
} catch (error) {
  console.error(error instanceof Error ? error.message : error)
  exitCode = 1
} finally {
  await server.close()
}
process.exit(exitCode)

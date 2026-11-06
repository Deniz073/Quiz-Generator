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
  const { assertValidQuizzes } = await server.ssrLoadModule(
    '/src/quizzes/validate.ts',
  )
  const { countQuestions } = await server.ssrLoadModule('/src/quizzes/index.ts')
  const { isMultipleAnswer } = await server.ssrLoadModule(
    '/src/quizzes/question.ts',
  )
  assertValidQuizzes(seedQuizzes)
  let chapters = 0
  let questions = 0
  let multi = 0
  for (const quiz of seedQuizzes) {
    const quizQuestions = countQuestions(quiz)
    chapters += quiz.chapters.length
    questions += quizQuestions
    for (const chapter of quiz.chapters) {
      multi += chapter.questions.filter(isMultipleAnswer).length
    }
    console.log(
      `  ${quiz.id}: ${quiz.chapters.length} chapters, ${quizQuestions} questions`,
    )
  }
  console.log(
    `OK: ${seedQuizzes.length} quizzes, ${chapters} chapters, ${questions} questions (${multi} multi-answer)`,
  )
} catch (error) {
  console.error(error instanceof Error ? error.message : error)
  exitCode = 1
} finally {
  await server.close()
}
process.exit(exitCode)

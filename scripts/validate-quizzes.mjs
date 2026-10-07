// Loads the quiz registry through Vite's module runner (the data files use
// extensionless imports, the `#/` alias and import.meta.glob, so plain node
// cannot load them) and prints a summary, or the validation errors.
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
  const { quizzes, countQuestions } = await server.ssrLoadModule(
    '/src/quizzes/index.ts',
  )
  let chapters = 0
  let questions = 0
  let multi = 0
  for (const quiz of quizzes) {
    const quizQuestions = countQuestions(quiz)
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

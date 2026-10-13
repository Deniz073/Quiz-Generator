import type { Chapter } from '#/quizzes/types'

/** "Chapter 3 — Cloud service types": how a chapter is named on screen. */
export function formatChapter(chapter: Pick<Chapter, 'number' | 'title'>) {
  return `Chapter ${chapter.number} — ${chapter.title}`
}

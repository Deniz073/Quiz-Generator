import type { Quiz } from '#/quizzes/types'
import { chapter01 } from './chapter-01'
import { chapter02 } from './chapter-02'
import { chapter03 } from './chapter-03'
import { chapter04 } from './chapter-04'
import { chapter05 } from './chapter-05'
import { chapter06 } from './chapter-06'
import { chapter07 } from './chapter-07'
import { chapter08 } from './chapter-08'
import { chapter09 } from './chapter-09'
import { chapter10 } from './chapter-10'
import { chapter11 } from './chapter-11'
import { chapter12 } from './chapter-12'
import { chapter13 } from './chapter-13'
import { chapter14 } from './chapter-14'
import { chapter15 } from './chapter-15'

const ai901: Quiz = {
  id: 'ai-901',
  title: 'AI-901 Microsoft Azure AI Fundamentals',
  description:
    'Questions per module of the AI-901 learning paths (AI concepts and Microsoft Foundry), plus topics from the official practice assessment.',
  chapters: [
    chapter01,
    chapter02,
    chapter03,
    chapter04,
    chapter05,
    chapter06,
    chapter07,
    chapter08,
    chapter09,
    chapter10,
    chapter11,
    chapter12,
    chapter13,
    chapter14,
    chapter15,
  ],
  // Question count and pass mark follow the official practice assessment
  // (50 questions, 80% target score); that assessment itself is untimed.
  exam: { questionCount: 50, minutes: 45, passPercent: 80 },
}

export default ai901

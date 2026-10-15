import type { Quiz } from '../types'
import { chapter01 } from './chapter-01'
import { chapter02 } from './chapter-02'
import { chapter03 } from './chapter-03'
import { chapter04 } from './chapter-04'
import { chapter05 } from './chapter-05'
import { chapter06 } from './chapter-06'
import { chapter07 } from './chapter-07'
import { chapter08 } from './chapter-08'
import { chapter09 } from './chapter-09'

const pspo1: Quiz = {
  id: 'pspo-1',
  title: 'PSPO I Professional Scrum Product Owner',
  description:
    'Multiple-choice questions per chapter, based on the 2020 Scrum Guide and Scrum.org product ownership material.',
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
  ],
  // Real exam: 80 questions, 60 minutes, 85% pass mark.
  exam: { questionCount: 80, minutes: 60, passPercent: 85 },
}

export default pspo1

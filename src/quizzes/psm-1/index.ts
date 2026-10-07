import type { Quiz } from '../types'
import { chapter01 } from './chapter-01'
import { chapter02 } from './chapter-02'
import { chapter03 } from './chapter-03'
import { chapter04 } from './chapter-04'
import { chapter05 } from './chapter-05'
import { chapter06 } from './chapter-06'
import { chapter07 } from './chapter-07'
import { chapter08 } from './chapter-08'

const psm1: Quiz = {
  id: 'psm-1',
  title: 'PSM I Professional Scrum Master',
  description:
    'Multiple-choice questions per chapter, based on the 2020 Scrum Guide.',
  chapters: [
    chapter01,
    chapter02,
    chapter03,
    chapter04,
    chapter05,
    chapter06,
    chapter07,
    chapter08,
  ],
  exam: { questionCount: 80, minutes: 60, passPercent: 85 },
}

export default psm1

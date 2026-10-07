import type { Chapter } from '../types'

export const chapter02: Chapter = {
  id: '2-scrum-values',
  number: 2,
  title: 'Scrum Values',
  questions: [
    {
      question: 'Which three of the following are Scrum values? Select three.',
      options: [
        'Transparency',
        'Courage',
        'Accountability',
        'Focus',
        'Respect',
      ],
      correctIndexes: [1, 3, 4],
      explanation:
        'The five Scrum values are Commitment, Focus, Openness, Respect, and Courage. Transparency is one of the three pillars of empiricism, not a value, and accountability is not listed.',
    },
    {
      question:
        'The Scrum Team and its stakeholders are ______ about the work and the challenges. Which Scrum value completes the sentence?',
      options: ['Courageous', 'Committed', 'Open', 'Respectful'],
      correctIndex: 2,
      explanation:
        'Openness is the value of the Scrum Team and its stakeholders being open about the work and the challenges. Courage is about doing the right thing and working on tough problems.',
    },
    {
      question:
        'According to the Scrum Guide, what does the Scrum value Focus mean for the Scrum Team?',
      options: [
        'Each member works on a separate initiative to maximize individual output',
        'Their primary focus is on the work of the Sprint, to make the best possible progress toward their goals',
        "The team concentrates only on the Product Owner's instructions and ignores stakeholders",
        'The team concentrates on following the rules of Scrum rather than on the outcome',
      ],
      correctIndex: 1,
      explanation:
        "The Guide says the Scrum Team's primary focus is on the work of the Sprint to make the best possible progress toward its goals. Working on separate initiatives is the opposite of what the Sprint Goal encourages.",
    },
    {
      question:
        'According to the Scrum Guide, what does the Scrum value Commitment mean?',
      options: [
        'The Scrum Team commits to achieving its goals and to supporting each other',
        'Developers commit to finishing every forecast item regardless of what they learn during the Sprint',
        'Each individual commits to working overtime whenever the Sprint is at risk',
        'The Scrum Master commits to removing every impediment personally',
      ],
      correctIndex: 0,
      explanation:
        'Commitment means the Scrum Team commits to achieving its goals and supporting each other. Scope can still be clarified and renegotiated with the Product Owner during the Sprint, and working overtime is not mentioned in the Guide.',
    },
    {
      question:
        'A manager regularly tells individual Developers exactly how to do their work, assuming they cannot decide this themselves. Which Scrum value is being undermined?',
      options: ['Focus', 'Courage', 'Openness', 'Respect'],
      correctIndex: 3,
      explanation:
        "The Guide says Scrum Team members respect each other to be capable, independent people, and are respected as such by the people with whom they work. Telling Developers how to turn items into Increments also contradicts the Developers' sole discretion over this.",
    },
    {
      question:
        'According to the Scrum Guide, the members of the Scrum Team have the courage to:',
      options: [
        'Ignore decisions of the Product Owner that they disagree with',
        'Escalate every disagreement to management',
        'Do the right thing and work on tough problems',
        'Commit to more work than they believe they can finish',
      ],
      correctIndex: 2,
      explanation:
        'The Guide says Scrum Team members have the courage to do the right thing and to work on tough problems. Nothing in the Guide suggests ignoring decisions or over-committing.',
    },
    {
      question:
        'According to the Scrum Guide, what happens when the Scrum values are embodied by the Scrum Team and the people they work with?',
      options: [
        'The Scrum events become optional because the team no longer needs them',
        'The empirical pillars of transparency, inspection, and adaptation come to life, building trust',
        'The Scrum Master is no longer needed to establish Scrum',
        'The pillars are replaced by the values as the foundation of Scrum',
      ],
      correctIndex: 1,
      explanation:
        'The Guide says that when the values are embodied, the empirical pillars come to life, building trust. The values reinforce the pillars and do not replace them or make events optional.',
    },
    {
      question:
        'Which two statements about the Scrum values are supported by the Scrum Guide? Select two.',
      options: [
        'Successful use of Scrum depends on people becoming more proficient in living the values',
        'The values are rules that the Scrum Master enforces through formal compliance reviews',
        'The values apply only to the Developers, not to the Product Owner or stakeholders',
        'The decisions made, steps taken and the way Scrum is used should reinforce the values, not diminish or undermine them',
      ],
      correctIndexes: [0, 3],
      explanation:
        'The Guide ties the successful use of Scrum to people becoming more proficient in living the values, and says the way Scrum is used should reinforce them. The values concern the whole Scrum Team and its stakeholders, and are not an enforcement mechanism.',
    },
  ],
}

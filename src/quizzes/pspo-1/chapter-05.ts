import type { Chapter } from '../types'

export const chapter05: Chapter = {
  id: '5-artifacts-and-commitments',
  number: 5,
  title: 'Artifacts & commitments',
  questions: [
    {
      id: '5-01',
      question: 'Which pairing of artifact and commitment is correct?',
      options: [
        'Product Backlog: Sprint Goal; Sprint Backlog: Product Goal; Increment: Definition of Done',
        'Product Backlog: Product Goal; Sprint Backlog: Sprint Goal; Increment: Definition of Done',
        'Product Backlog: Definition of Done; Sprint Backlog: Sprint Goal; Increment: Product Goal',
        'Product Backlog: Product Goal; Sprint Backlog: Definition of Done; Increment: Sprint Goal',
      ],
      correctIndex: 1,
      explanation:
        'Each artifact contains a commitment: Product Goal for the Product Backlog, Sprint Goal for the Sprint Backlog and Definition of Done for the Increment. They provide information that enhances transparency and focus.',
    },
    {
      id: '5-02',
      question: 'What is the Product Goal?',
      options: [
        'A list of features that must be delivered before a release date',
        'The objective of one particular Sprint',
        'A future state of the product that can serve as a target for the Scrum Team to plan against',
        'The financial target of the product set by the stakeholders',
      ],
      correctIndex: 2,
      explanation:
        'The Product Goal describes a future state of the product which can serve as a target for the Scrum Team to plan against. The rest of the Product Backlog emerges to define what will fulfill the Product Goal.',
    },
    {
      id: '5-03',
      question:
        'How many Product Goals does the Scrum Team work toward at one time?',
      options: [
        'One; they must fulfill or abandon it before taking on the next',
        'One per Sprint, each Sprint with its own Product Goal',
        'One per Developer, so that everyone has a clear target',
        'As many as the stakeholders ask for',
      ],
      correctIndex: 0,
      explanation:
        'The Product Goal is the long-term objective for the Scrum Team. They must fulfill (or abandon) one objective before taking on the next; the Scrum Team focuses on one objective at a time.',
    },
    {
      id: '5-04',
      question: 'Where does the Product Goal live?',
      options: [
        'In a product vision document owned by the stakeholders',
        'In the Sprint Backlog, together with the Sprint Goal',
        'In the Definition of Done',
        'In the Product Backlog',
      ],
      correctIndex: 3,
      explanation:
        'The Product Goal is in the Product Backlog; it is the commitment for that artifact.',
    },
    {
      id: '5-05',
      question: 'What does the Sprint Backlog consist of?',
      options: [
        'The Sprint Goal (why), the selected Product Backlog items (what) and an actionable plan for delivering the Increment (how)',
        'The Product Goal and all items in the Product Backlog that are ready',
        'A list of tasks assigned to individual Developers by the Scrum Master',
        'The Product Backlog items that the Product Owner has approved for the Sprint',
      ],
      correctIndex: 0,
      explanation:
        'The Sprint Backlog is composed of the Sprint Goal (why), the set of Product Backlog items selected for the Sprint (what) and an actionable plan for delivering the Increment (how).',
    },
    {
      id: '5-06',
      question: 'Who owns the Sprint Backlog, and when may it change?',
      options: [
        'The Product Owner; it is frozen after Sprint Planning',
        'The Developers; it is a plan by and for them and is updated throughout the Sprint as more is learned',
        'The Scrum Master; it is updated at each Daily Scrum',
        'The whole Scrum Team; it may only be changed in the Sprint Retrospective',
      ],
      correctIndex: 1,
      explanation:
        'The Sprint Backlog is a plan by and for the Developers: a highly visible, real-time picture of the work they plan to accomplish. It is updated throughout the Sprint as more is learned.',
    },
    {
      id: '5-07',
      question: 'Which statement about the Sprint Goal is correct?',
      options: [
        'It is the list of items the Product Owner expects to be Done in the Sprint',
        'It is set by the stakeholders to hold the team accountable',
        'It is the single objective for the Sprint, a commitment by the Developers that gives flexibility in the exact work needed to achieve it',
        'It is optional and only used by teams with Sprints longer than two weeks',
      ],
      correctIndex: 2,
      explanation:
        'The Sprint Goal is the single objective for the Sprint. Although it is a commitment by the Developers, it gives flexibility in terms of the exact work needed and creates coherence and focus.',
    },
    {
      id: '5-08',
      question:
        'Halfway through the Sprint the Developers see that not all selected items can be finished, but the Sprint Goal can still be met. What should they do?',
      options: [
        'Work overtime so that all items are finished as planned',
        'Cancel the Sprint and plan a new one',
        'Lower the Definition of Done for the remaining items to stay on schedule',
        'Collaborate with the Product Owner to negotiate the scope of the Sprint Backlog without affecting the Sprint Goal',
      ],
      correctIndex: 3,
      explanation:
        'If the work turns out to be different than expected, the Developers collaborate with the Product Owner to negotiate the scope of the Sprint Backlog within the Sprint without affecting the Sprint Goal. Quality does not decrease.',
    },
    {
      id: '5-09',
      question: 'What is an Increment?',
      options: [
        'A set of Product Backlog items that were started in the Sprint',
        'A concrete stepping stone toward the Product Goal that is additive to prior Increments, thoroughly verified and usable',
        'A document describing the work done during the Sprint',
        'The version of the product that is released at the end of the Sprint',
      ],
      correctIndex: 1,
      explanation:
        'An Increment is a concrete stepping stone toward the Product Goal. Each Increment is additive to all prior Increments and thoroughly verified, and in order to provide value it must be usable.',
    },
    {
      id: '5-10',
      question: 'How many Increments can a Scrum Team create in one Sprint?',
      options: [
        'Exactly one, which is presented at the Sprint Review',
        'One per Product Backlog item, but only after the Product Owner has approved it',
        'One per Sprint, plus a separate integration Increment',
        'Multiple Increments; the sum of the Increments is presented at the Sprint Review',
      ],
      correctIndex: 3,
      explanation:
        'Multiple Increments may be created within a Sprint. The sum of the Increments is presented at the Sprint Review, and an Increment may be delivered to stakeholders before the end of the Sprint.',
    },
    {
      id: '5-11',
      question: 'What is the Definition of Done?',
      options: [
        'A checklist of acceptance criteria written by the Product Owner for each item',
        'A formal description of the state of the Increment when it meets the quality measures required for the product',
        'The condition that must hold before an item may enter the Sprint Backlog',
        "The Product Owner's personal criteria for accepting a Product Backlog item",
      ],
      correctIndex: 1,
      explanation:
        'The Definition of Done is a formal description of the state of the Increment when it meets the quality measures required for the product. It creates transparency through a shared understanding of what was completed.',
    },
    {
      id: '5-12',
      question: 'At what moment is an Increment born?',
      options: [
        'When the Developers have finished coding the Product Backlog item',
        'When the Product Owner has accepted the Product Backlog item',
        'When the Product Backlog item meets the Definition of Done',
        'When the Sprint Review has taken place',
      ],
      correctIndex: 2,
      explanation:
        'The moment a Product Backlog item meets the Definition of Done, an Increment is born. Work cannot be considered part of an Increment unless it meets the Definition of Done.',
    },
    {
      id: '5-13',
      question:
        'A Product Backlog item does not meet the Definition of Done at the end of the Sprint. What should happen?',
      options: [
        'It is shown at the Sprint Review as "almost done" and finished in the next Sprint',
        'It is released anyway, with a note about the missing quality measures',
        'It is accepted by the Product Owner, who may waive parts of the Definition of Done',
        'It cannot be released or even presented at the Sprint Review; it returns to the Product Backlog for future consideration',
      ],
      correctIndex: 3,
      explanation:
        'If an item does not meet the Definition of Done, it cannot be released or even presented at the Sprint Review. It returns to the Product Backlog for future consideration.',
    },
    {
      id: '5-14',
      question:
        'The organization has a Definition of Done that applies to all products. What must a Scrum Team do?',
      options: [
        'Follow it as a minimum; the Scrum Team may add stricter criteria',
        'Ignore it, because each Scrum Team defines its own Definition of Done',
        'Follow it only for items the Product Owner marks as critical',
        "Replace it with the Product Owner's acceptance criteria",
      ],
      correctIndex: 0,
      explanation:
        'If the Definition of Done is part of the standards of the organization, all Scrum Teams must follow it as a minimum. If it is not an organizational standard, the Scrum Team must create one appropriate for the product.',
    },
    {
      id: '5-15',
      question:
        'Several Scrum Teams work together on the same product. What does the Scrum Guide require regarding the Definition of Done?',
      options: [
        'Each team may define its own, as long as the Product Owner approves it',
        'Only the team with the most Developers defines it',
        'They must mutually define and comply with the same Definition of Done',
        'The Scrum Master of the oldest team decides it',
      ],
      correctIndex: 2,
      explanation:
        'If there are multiple Scrum Teams working together on a product, they must mutually define and comply with the same Definition of Done.',
    },
  ],
}

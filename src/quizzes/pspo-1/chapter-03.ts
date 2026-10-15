import type { Chapter } from '../types'

export const chapter03: Chapter = {
  id: '3-product-owner',
  number: 3,
  title: 'The Product Owner',
  questions: [
    {
      id: '3-01',
      question:
        'What is the Product Owner primarily accountable for, according to the Scrum Guide?',
      options: [
        'Making sure the Developers complete all selected items by the end of the Sprint',
        'Maximizing the value of the product resulting from the work of the Scrum Team',
        'Managing the project plan, budget and deadlines',
        'Establishing Scrum and removing impediments for the Developers',
      ],
      correctIndex: 1,
      explanation:
        'The Product Owner is accountable for maximizing the value of the product resulting from the work of the Scrum Team. How this is done may vary widely across organizations, Scrum Teams and individuals.',
    },
    {
      id: '3-02',
      question:
        'Which three activities are part of effective Product Backlog management, for which the Product Owner is accountable? Select three.',
      options: [
        'Developing and explicitly communicating the Product Goal',
        'Creating and clearly communicating Product Backlog items',
        'Assigning Product Backlog items to individual Developers',
        'Ordering Product Backlog items',
        'Facilitating the Sprint Retrospective',
      ],
      correctIndexes: [0, 1, 3],
      explanation:
        'The Guide lists four: developing and communicating the Product Goal, creating and communicating Product Backlog items, ordering them, and ensuring the Product Backlog is transparent, visible and understood. Developers decide among themselves who does what.',
    },
    {
      id: '3-03',
      question:
        'A busy Product Owner lets a business analyst create and order most Product Backlog items. Who is accountable for the Product Backlog?',
      options: [
        'The business analyst, who now does the work',
        'The Scrum Team collectively',
        'The Product Owner remains accountable',
        "The Scrum Master, who must check the analyst's work",
      ],
      correctIndex: 2,
      explanation:
        'The Product Owner may do the work or delegate it to others, but regardless remains accountable. Accountability cannot be delegated.',
    },
    {
      id: '3-04',
      question:
        'A steering committee of five managers wants to jointly act as Product Owner so that all departments are represented. What does the Scrum Guide say?',
      options: [
        'This is fine when the committee chooses one member to speak for it in Sprint Planning',
        'This is fine, as long as the committee is listed in the Product Backlog',
        'This is fine for products with many stakeholders, with each member owning part of the Product Backlog',
        'The Product Owner is one person, not a committee, who may represent the needs of many stakeholders',
      ],
      correctIndex: 3,
      explanation:
        'The Product Owner is one person, not a committee. They may represent the needs of many stakeholders in the Product Backlog, and those wanting to change it do so by trying to convince the Product Owner.',
    },
    {
      id: '3-05',
      question:
        'A stakeholder is convinced that an item should be much higher in the Product Backlog. What is the right way for this stakeholder to get it changed?',
      options: [
        'Ask the Scrum Master to move the item, as the Scrum Master owns the process',
        'Ask the Developers to start working on it, as they own the Sprint Backlog',
        'Try to convince the Product Owner',
        'Escalate to management, who can reorder the Product Backlog directly',
      ],
      correctIndex: 2,
      explanation:
        "Those wanting to change the Product Backlog can do so by trying to convince the Product Owner. Content and ordering are the Product Owner's decisions.",
    },
    {
      id: '3-06',
      question:
        'The Scrum Guide says that "for Product Owners to succeed, the entire organization must respect their decisions". Where are these decisions visible?',
      options: [
        'In the Sprint Retrospective notes and the Daily Scrum',
        'In status reports sent to management after each Sprint',
        'In the content and ordering of the Product Backlog, and in the inspectable Increment at the Sprint Review',
        'In the Definition of Done, which the Product Owner sets alone',
      ],
      correctIndex: 2,
      explanation:
        'The decisions are visible in the content and ordering of the Product Backlog and through the inspectable Increment at the Sprint Review.',
    },
    {
      id: '3-07',
      question:
        'A senior manager tells the Developers to work on an item that the Product Owner ordered far down the Product Backlog. Which principle of the Scrum Guide is being violated?',
      options: [
        'The organization must respect the decisions of the Product Owner',
        'Developers must always work on the oldest item in the Product Backlog',
        'The Scrum Master must approve each Sprint Backlog item',
        'The manager is not allowed to talk to the Developers in any situation',
      ],
      correctIndex: 0,
      explanation:
        "The whole organization must respect the Product Owner's decisions, which are visible in the content and ordering of the Product Backlog. The manager can try to convince the Product Owner, not bypass them.",
    },
    {
      id: '3-08',
      question:
        'During Sprint Planning, who selects the Product Backlog items for the Sprint?',
      options: [
        'The Product Owner, who tells the Developers what to take',
        "The Scrum Master, based on the Developers' capacity",
        'The Developers, through discussion with the Product Owner',
        'The stakeholders, based on their needs',
      ],
      correctIndex: 2,
      explanation:
        'Through discussion with the Product Owner, the Developers select items from the Product Backlog to include in the current Sprint. The Product Owner does not assign work.',
    },
    {
      id: '3-09',
      question:
        'In the "Why is this Sprint valuable?" topic of Sprint Planning, what is the Product Owner\'s role?',
      options: [
        'Define the Sprint Goal alone and hand it over to the Developers',
        'Propose how the product could increase its value and utility, after which the whole Scrum Team collaborates on the Sprint Goal',
        'Wait for the Developers to propose the Sprint Goal and then accept or reject it',
        'Ask the stakeholders to write the Sprint Goal',
      ],
      correctIndex: 1,
      explanation:
        'The Product Owner proposes how the product could increase its value and utility. The whole Scrum Team then collaborates to define a Sprint Goal that communicates why the Sprint is valuable to stakeholders.',
    },
    {
      id: '3-10',
      question:
        'How does Scrum.org describe the difference between a Product Owner and a Product Manager?',
      options: [
        'They are the same role with different names, always held by different people in a Scrum Team',
        'A Product Owner is an accountability in Scrum; Product Manager is a job title, and a Product Manager can fill the Product Owner accountability when given the authority',
        'A Product Manager is accountable for the Product Backlog; a Product Owner only writes the items',
        'A Product Manager overrules the Product Owner on matters of strategy',
      ],
      correctIndex: 1,
      explanation:
        'Scrum.org describes Product Owner as an accountability within Scrum and Product Manager as a job title. A Product Manager can be the Product Owner if they have the authority over the product; others do not overrule the Product Owner.',
    },
    {
      id: '3-11',
      question:
        'Which statement about the Product Owner in the Daily Scrum is correct?',
      options: [
        'The Product Owner leads the Daily Scrum to collect progress for stakeholders',
        'The Product Owner must attend every Daily Scrum and approve the plan for the day',
        'The Daily Scrum is for the Developers; the Product Owner participates as a Developer only when actively working on Sprint Backlog items',
        'The Product Owner may never be present at the Daily Scrum',
      ],
      correctIndex: 2,
      explanation:
        'The Daily Scrum is a 15-minute event for the Developers. If the Product Owner or Scrum Master are actively working on items in the Sprint Backlog, they participate as Developers.',
    },
  ],
}

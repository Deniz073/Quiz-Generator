import type { Chapter } from '../types'

export const chapter02: Chapter = {
  id: '2-scrum-team',
  number: 2,
  title: 'The Scrum Team & accountabilities',
  questions: [
    {
      id: '2-01',
      question:
        'According to the Scrum Guide, what does a Scrum Team consist of?',
      options: [
        'One Scrum Master, one Product Owner, and Developers',
        'One Scrum Master, one Product Owner, Developers and the key stakeholders',
        'A project manager, a Product Owner and a team of Developers',
        'A Product Owner and Developers, with the Scrum Master serving from outside the team',
      ],
      correctIndex: 0,
      explanation:
        'The Scrum Team consists of one Scrum Master, one Product Owner and Developers. Stakeholders are not part of the Scrum Team, and there is no project manager role.',
    },
    {
      id: '2-02',
      question:
        'A large product organization wants to introduce a "QA sub-team" and a "design sub-team" within the Scrum Team, each with its own lead. What does the Scrum Guide say?',
      options: [
        'This is allowed, as long as the leads report to the Scrum Master',
        'This is allowed when the Scrum Team has more than seven Developers',
        'This is allowed, but only for the Developers and not the Product Owner',
        'Within a Scrum Team there are no sub-teams or hierarchies; it is a cohesive unit',
      ],
      correctIndex: 3,
      explanation:
        'The Guide states that within a Scrum Team there are no sub-teams or hierarchies. All Developers are Developers, regardless of the specialty they bring.',
    },
    {
      id: '2-03',
      question:
        'What is the typical size of a Scrum Team, according to the Scrum Guide?',
      options: [
        'Exactly seven people, plus or minus two',
        'Typically 10 or fewer people',
        'Between 12 and 15 people, so that all skills are covered',
        'As many people as the product needs, the Guide gives no hint',
      ],
      correctIndex: 1,
      explanation:
        'The Scrum Team is small enough to remain nimble and large enough to complete significant work within a Sprint, typically 10 or fewer people. Smaller teams tend to communicate better and be more productive.',
    },
    {
      id: '2-04',
      question: 'What does it mean that a Scrum Team is cross-functional?',
      options: [
        'Every member can do every task of every other member',
        'The members have all the skills necessary to create value each Sprint',
        'The team consists of people from several departments who report to different managers',
        'The Product Owner and the Scrum Master also develop the product',
      ],
      correctIndex: 1,
      explanation:
        'Cross-functional means the members have, collectively, all the skills necessary to create value each Sprint. It does not mean everybody can do everything.',
    },
    {
      id: '2-05',
      question:
        'Which two of the following are the Developers always accountable for? Select two.',
      options: [
        'Creating a plan for the Sprint, the Sprint Backlog',
        'Ordering the Product Backlog items',
        'Instilling quality by adhering to a Definition of Done',
        'Establishing Scrum as defined in the Scrum Guide',
        'Developing and communicating the Product Goal',
      ],
      correctIndexes: [0, 2],
      explanation:
        'The Developers are always accountable for creating the Sprint Backlog, instilling quality through the Definition of Done, adapting their plan daily toward the Sprint Goal, and holding each other accountable as professionals. Ordering and the Product Goal belong to the Product Owner; establishing Scrum belongs to the Scrum Master.',
    },
    {
      id: '2-06',
      question:
        'Who decides how Product Backlog items are turned into an Increment of value?',
      options: [
        'The Product Owner, because they are accountable for maximizing value',
        "The Scrum Master, because they are accountable for the Scrum Team's effectiveness",
        'The Developers, at their sole discretion',
        'The stakeholders who requested the items',
      ],
      correctIndex: 2,
      explanation:
        'How this is done is at the sole discretion of the Developers. No one else tells them how to turn Product Backlog items into Increments of value.',
    },
    {
      id: '2-07',
      question:
        'Which accountability does the Scrum Guide assign to the Scrum Master?',
      options: [
        'Ordering the Product Backlog together with the Developers',
        "Establishing Scrum as defined in the Scrum Guide and the Scrum Team's effectiveness",
        'Assigning work to Developers and tracking their progress',
        'Reporting the progress of the Sprint to management',
      ],
      correctIndex: 1,
      explanation:
        "The Scrum Master is accountable for establishing Scrum as defined in the Guide and for the Scrum Team's effectiveness, by enabling the team to improve its practices within the Scrum framework.",
    },
    {
      id: '2-08',
      question:
        'Which two of the following are ways in which the Scrum Master serves the Product Owner? Select two.',
      options: [
        'Helping find techniques for effective Product Goal definition and Product Backlog management',
        'Facilitating stakeholder collaboration as requested or needed',
        'Deciding which stakeholder requests are added to the Product Backlog',
        'Approving Product Backlog items before the Developers may select them',
        'Ordering the Product Backlog whenever the Product Owner is unavailable',
      ],
      correctIndexes: [0, 1],
      explanation:
        'The Scrum Master helps with Product Goal definition techniques and Product Backlog management, helps the team understand the need for clear items, helps establish empirical product planning, and facilitates stakeholder collaboration as requested or needed. Content and ordering decisions stay with the Product Owner.',
    },
    {
      id: '2-09',
      question:
        'A product has grown and the Scrum Team now has 25 people. What does the Scrum Guide suggest?',
      options: [
        'Keep a single Scrum Team and add sub-teams per feature area',
        'Reorganize into multiple cohesive Scrum Teams, each focused on the same product',
        'Replace the Scrum Team with a dedicated project management office',
        'Split the product into unrelated products, one Product Owner each, with separate goals',
      ],
      correctIndex: 1,
      explanation:
        'If Scrum Teams become too large, they should reorganize into multiple cohesive Scrum Teams, each focused on the same product. They should share the same Product Goal, Product Backlog and Product Owner.',
    },
    {
      id: '2-10',
      question: 'Who are the "Developers" in Scrum?',
      options: [
        'Only the people who write code',
        'Only the people who are not the Product Owner or Scrum Master and have a technical degree',
        'The people in the Scrum Team committed to creating any aspect of a usable Increment each Sprint',
        'Everyone in the organization who contributes to the product, including stakeholders',
      ],
      correctIndex: 2,
      explanation:
        'Developers are the people in the Scrum Team committed to creating any aspect of a usable Increment each Sprint, whatever their specialty. The Guide uses the word not to exclude but to simplify.',
    },
    {
      id: '2-11',
      question:
        'Which statement about the responsibilities of the Scrum Team is correct?',
      options: [
        'The Scrum Team is responsible for all product-related activities, from stakeholder collaboration to operation and experimentation',
        'The Scrum Team creates the Increment; stakeholder collaboration is handled by a separate business unit',
        'The Scrum Team only builds the product; verification and maintenance are done by another team',
        'The Product Owner is responsible for product-related activities, the Developers only write code',
      ],
      correctIndex: 0,
      explanation:
        'The Scrum Team is responsible for all product-related activities: stakeholder collaboration, verification, maintenance, operation, experimentation, research and development, and anything else that might be required.',
    },
  ],
}

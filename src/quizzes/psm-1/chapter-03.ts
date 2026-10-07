import type { Chapter } from '../types'

export const chapter03: Chapter = {
  id: '3-scrum-team',
  number: 3,
  title: 'The Scrum Team, Developers & Product Owner',
  questions: [
    {
      id: '3-01',
      question: 'According to the Scrum Guide, who makes up a Scrum Team?',
      options: [
        'A project manager, a Product Owner, Developers and testers',
        'One Scrum Master, one Product Owner, and Developers',
        'Developers and a Scrum Master; the Product Owner is a stakeholder outside the team',
        'One Product Owner, Developers, and a Scrum Master for each group of Developers',
      ],
      correctIndex: 1,
      explanation:
        'The Scrum Team consists of one Scrum Master, one Product Owner, and Developers. Scrum defines three accountabilities within it: the Developers, the Product Owner and the Scrum Master.',
    },
    {
      id: '3-02',
      question:
        'A Scrum Team of nine people wants to move faster and splits into a "design sub-team" and a "build sub-team", each with its own lead. What does the Scrum Guide say?',
      options: [
        'This is acceptable as long as the Scrum Master coordinates both sub-teams',
        'This is acceptable once the team has more than seven members',
        'This is acceptable if each sub-team gets its own Product Owner',
        'Within a Scrum Team there are no sub-teams or hierarchies; it is a cohesive unit of professionals',
      ],
      correctIndex: 3,
      explanation:
        'The Guide states that within a Scrum Team there are no sub-teams or hierarchies. If a team becomes too large, it should reorganize into multiple cohesive Scrum Teams rather than internal sub-teams.',
    },
    {
      id: '3-03',
      question:
        'The Product Goal is described as the long-term objective for the Scrum Team. What must the Scrum Team do with it before taking on another objective?',
      options: [
        'Hand it over to the Scrum Master',
        'Fulfill it (or abandon it)',
        'Get it approved by the stakeholders at the Sprint Review',
        'Split it across several Product Owners',
      ],
      correctIndex: 1,
      explanation:
        'The Scrum Team is focused on one objective at a time, the Product Goal, and must fulfill (or abandon) one objective before taking on the next.',
    },
    {
      id: '3-04',
      question:
        'According to the Scrum Guide, what does it mean that Scrum Teams are cross-functional?',
      options: [
        'The members have all the skills necessary to create value each Sprint',
        'Every team member must be able to perform every task on their own',
        'The team includes a representative of every department in the organization',
        'The team receives specialist work from external teams each Sprint',
      ],
      correctIndex: 0,
      explanation:
        'Cross-functional means the members have all the skills necessary to create value each Sprint; Scrum teams collectively have the skills and share or acquire them as needed. The Guide does not require each individual to be able to do everything.',
    },
    {
      id: '3-05',
      question:
        'A manager outside the Scrum Team wants to assign Sprint tasks to individual Developers. According to the Scrum Guide, who decides who does what, when, and how?',
      options: [
        "The Scrum Master, as the person accountable for the Scrum Team's effectiveness",
        'The Product Owner, as the person accountable for maximizing value',
        'The line manager of each Developer',
        'The Scrum Team itself, because it is self-managing',
      ],
      correctIndex: 3,
      explanation:
        'Scrum Teams are self-managing, meaning they internally decide who does what, when, and how. They are structured and empowered by the organization to manage their own work.',
    },
    {
      id: '3-06',
      question:
        'A product has grown so much that a Scrum Team of 25 people is no longer nimble. The Scrum Team reorganizes into multiple cohesive Scrum Teams focused on the same product. Which three things should these teams share? Select three.',
      options: [
        'The same Product Goal',
        'A separate Product Owner for each Scrum Team',
        'The same Product Backlog',
        'The same Product Owner',
        'Their own independent Product Backlog for each Scrum Team',
      ],
      correctIndexes: [0, 2, 3],
      explanation:
        'The Guide says that multiple Scrum Teams on one product should share the same Product Goal, Product Backlog, and Product Owner. Separate Product Owners or backlogs would split the single source of work for the product.',
    },
    {
      id: '3-07',
      question:
        'How does the Scrum Guide describe the typical size of a Scrum Team?',
      options: [
        'Exactly nine people, because that is the optimal size',
        'At least twelve people, so that all necessary skills are covered',
        'Small enough to remain nimble and large enough to complete significant work within a Sprint, typically 10 or fewer people',
        'There is no guidance on size, because Scrum Teams are self-managing',
      ],
      correctIndex: 2,
      explanation:
        'The Guide says typically 10 or fewer people, and that smaller teams communicate better and are more productive. It does not prescribe an exact number or a minimum of twelve.',
    },
    {
      id: '3-08',
      question:
        'After a release, users report operational problems with the product. According to the Scrum Guide, who is responsible for operating and maintaining the product?',
      options: [
        'A separate operations team that takes over after each Sprint',
        'Only the Product Owner',
        'The Scrum Team, which is responsible for all product-related activities',
        'The Scrum Master, as the person accountable for effectiveness',
      ],
      correctIndex: 2,
      explanation:
        'The Scrum Team is responsible for all product-related activities, from stakeholder collaboration, verification, maintenance, operation, experimentation, and research and development to anything else that might be required.',
    },
    {
      id: '3-09',
      question:
        'Who is accountable for creating a valuable, useful Increment every Sprint?',
      options: [
        'Only the Developers, because they do the work',
        'Only the Product Owner, because they maximize the value of the product',
        'Only the Scrum Master, because they are accountable for effectiveness',
        'The entire Scrum Team',
      ],
      correctIndex: 3,
      explanation:
        'The Guide states that the entire Scrum Team is accountable for creating a valuable, useful Increment every Sprint. The Developers are committed to creating the Increment, but accountability is not limited to them.',
    },
    {
      id: '3-10',
      question:
        'The Developers are always accountable for which three of the following? Select three.',
      options: [
        'Creating a plan for the Sprint, the Sprint Backlog',
        'Ordering the Product Backlog items',
        'Instilling quality by adhering to a Definition of Done',
        'Ensuring that all Scrum events take place and are kept within the timebox',
        'Adapting their plan each day toward the Sprint Goal',
      ],
      correctIndexes: [0, 2, 4],
      explanation:
        'The Developers are accountable for creating the Sprint Backlog, instilling quality through the Definition of Done, adapting their plan daily toward the Sprint Goal, and holding each other accountable as professionals. Ordering the Product Backlog belongs to the Product Owner, and ensuring events take place belongs to the Scrum Master.',
    },
    {
      id: '3-11',
      question:
        'For which two of the following is the Product Owner accountable as part of effective Product Backlog management? Select two.',
      options: [
        'Developing and explicitly communicating the Product Goal',
        'Deciding how the Developers turn Product Backlog items into Increments',
        'Ordering Product Backlog items',
        'Ensuring that all Scrum events are kept within the timebox',
      ],
      correctIndexes: [0, 2],
      explanation:
        "The Product Owner is accountable for developing and communicating the Product Goal, creating and communicating Product Backlog items, ordering them, and ensuring the Product Backlog is transparent. How the work is done is at the sole discretion of the Developers, and timeboxes are the Scrum Master's concern.",
    },
    {
      id: '3-12',
      question:
        'The Product Owner delegates the ordering of the Product Backlog to a senior Developer. Who is accountable for the ordering of the Product Backlog?',
      options: [
        'The senior Developer who now does the ordering',
        'The Scrum Master, who approved the delegation',
        'The entire Scrum Team equally',
        'The Product Owner, who remains accountable',
      ],
      correctIndex: 3,
      explanation:
        'The Guide says the Product Owner may do the Product Backlog work or delegate it to others, but regardless, the Product Owner remains accountable.',
    },
    {
      id: '3-13',
      question:
        'A company wants a committee of department heads to act as the Product Owner so that all departments are represented. What does the Scrum Guide say?',
      options: [
        'This is fine if the committee appoints a chairperson as the Product Owner',
        'This is fine if the Scrum Master moderates the committee',
        'The Product Owner is one person, not a committee, but may represent the needs of many stakeholders in the Product Backlog',
        'This is fine for products with more than one Scrum Team',
      ],
      correctIndex: 2,
      explanation:
        'The Guide explicitly says the Product Owner is one person, not a committee. The Product Owner can still represent the needs of many stakeholders in the Product Backlog.',
    },
    {
      id: '3-14',
      question:
        'A stakeholder wants a new item to be added to the Product Backlog and ranked at the top. According to the Scrum Guide, how should the stakeholder proceed?',
      options: [
        'Ask the Scrum Master to insert the item into the Product Backlog',
        'Ask the Developers to add the item to the Sprint Backlog directly',
        'Escalate to management so that the Product Backlog is reordered',
        'Try to convince the Product Owner',
      ],
      correctIndex: 3,
      explanation:
        'The Guide says those wanting to change the Product Backlog can do so by trying to convince the Product Owner. Neither the Scrum Master nor the Developers nor management decide the content and ordering of the Product Backlog for the Product Owner.',
    },
    {
      id: '3-15',
      question:
        'According to the Scrum Guide, what must the entire organization do for Product Owners to succeed?',
      options: [
        'Review the ordering of the Product Backlog in a weekly steering committee',
        'Respect their decisions',
        'Approve each Product Backlog item before it can be selected for a Sprint',
        "Assign a project manager to confirm the Product Owner's decisions",
      ],
      correctIndex: 1,
      explanation:
        "The Guide says the entire organization must respect the Product Owner's decisions. These decisions are visible in the content and ordering of the Product Backlog and through the inspectable Increment at the Sprint Review.",
    },
    {
      id: '3-16',
      question:
        "According to the Scrum Guide, what improves the Scrum Team's focus and consistency?",
      options: [
        'Extending Sprints to two months so there are fewer events',
        'Working overtime near the end of each Sprint to finish the forecast',
        'Splitting the team into specialist sub-teams',
        'Working in Sprints at a sustainable pace',
      ],
      correctIndex: 3,
      explanation:
        "The Guide says that working in Sprints at a sustainable pace improves the Scrum Team's focus and consistency. Sprints are fixed length events of one month or less, and there are no sub-teams within a Scrum Team.",
    },
  ],
}

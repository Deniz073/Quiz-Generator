import type { Chapter } from '../types'

export const chapter07: Chapter = {
  id: '7-backlogs-and-goals',
  number: 7,
  title: 'Product Backlog, Sprint Backlog & Goals',
  questions: [
    {
      id: '7-01',
      question:
        'According to the Scrum Guide, what do Scrum artifacts represent, and what are they designed to maximize?',
      options: [
        'Work or value; transparency of key information',
        'Progress reports; predictability of delivery dates',
        'Contracts between the Scrum Team and stakeholders; accountability',
        'Plans for the Sprint; productivity of the Developers',
      ],
      correctIndex: 0,
      explanation:
        'Scrum artifacts represent work or value and are designed to maximize transparency of key information, so that everyone inspecting them has the same basis for adaptation.',
    },
    {
      id: '7-02',
      question:
        'Each Scrum artifact contains a commitment. Which pairing of artifact and commitment is correct?',
      options: [
        'Product Backlog and Sprint Goal',
        'Increment and Product Goal',
        'Sprint Backlog and Definition of Done',
        'Sprint Backlog and Sprint Goal',
      ],
      correctIndex: 3,
      explanation:
        'The commitments are the Product Goal for the Product Backlog, the Sprint Goal for the Sprint Backlog and the Definition of Done for the Increment.',
    },
    {
      id: '7-03',
      question:
        'Which two statements describe the Product Backlog, according to the Scrum Guide? Select two.',
      options: [
        'It is an emergent, ordered list of what is needed to improve the product',
        'It is a complete specification that must be fixed before the first Sprint starts',
        'It is the single source of work undertaken by the Scrum Team',
        'It is owned by the Developers, who add items as they see fit',
      ],
      correctIndexes: [0, 2],
      explanation:
        'The Product Backlog is an emergent, ordered list and the single source of work undertaken by the Scrum Team. It is never complete or frozen, and the Product Owner is accountable for it.',
    },
    {
      id: '7-04',
      question:
        'When are Product Backlog items deemed ready for selection in a Sprint Planning event?',
      options: [
        'When they can be Done by the Scrum Team within one Sprint',
        'When the stakeholders have approved them in writing',
        'When they meet a formal Definition of Ready',
        'When the Product Owner has placed them at the top of the Product Backlog',
      ],
      correctIndex: 0,
      explanation:
        'Items that can be Done by the Scrum Team within one Sprint are deemed ready for selection, usually after refining activities. The Scrum Guide does not define a Definition of Ready, and position in the order alone does not make an item ready.',
    },
    {
      id: '7-05',
      question:
        'A new team member asks how often Product Backlog refinement happens in Scrum. What does the Scrum Guide say?',
      options: [
        'It is a formal event that takes place once per Sprint',
        'It is done once, before the first Sprint',
        'It is an ongoing activity of breaking down and further defining Product Backlog items',
        'It is done by the Product Owner alone, between Sprints',
      ],
      correctIndex: 2,
      explanation:
        'Refinement is the act of breaking down and further defining Product Backlog items into smaller, more precise items, and it is an ongoing activity. It is not one of the five Scrum events.',
    },
    {
      id: '7-06',
      question:
        'The Product Owner asks the Developers to size a Product Backlog item smaller to fit it into the Sprint. Who is responsible for the sizing, and what can the Product Owner do?',
      options: [
        'The Product Owner is responsible and informs the Developers of the size',
        'The Developers are responsible, and the Product Owner may influence them by helping them understand and select trade-offs',
        'The Scrum Master is responsible and arbitrates between the Developers and the Product Owner',
        'The stakeholders are responsible, and the Product Owner translates their view',
      ],
      correctIndex: 1,
      explanation:
        'The Developers who will do the work are responsible for the sizing. The Product Owner may only influence them by helping them understand and select trade-offs.',
    },
    {
      id: '7-07',
      question: 'What does the Product Goal describe, and where does it live?',
      options: [
        'The objective of the current Sprint; in the Sprint Backlog',
        'The quality criteria for each Increment; in the Definition of Done',
        'A future state of the product that serves as a target to plan against; in the Product Backlog',
        'The roadmap with fixed release dates; in a separate planning document',
      ],
      correctIndex: 2,
      explanation:
        'The Product Goal describes a future state of the product which can serve as a target for the Scrum Team to plan against, and it is in the Product Backlog. The rest of the Product Backlog emerges to define what will fulfill it.',
    },
    {
      id: '7-08',
      question:
        'Which two statements about the Product Goal are supported by the Scrum Guide? Select two.',
      options: [
        'It is the long-term objective for the Scrum Team',
        'The Scrum Team works on several Product Goals in parallel to spread risk',
        'The Scrum Team must fulfill (or abandon) one objective before taking on the next',
        'It is set by the stakeholders at each Sprint Review',
      ],
      correctIndexes: [0, 2],
      explanation:
        'The Product Goal is the long-term objective, and the team must fulfill or abandon one before taking on the next. The Scrum Team is focused on one objective at a time, and the Product Owner develops and communicates the Product Goal.',
    },
    {
      id: '7-09',
      question:
        'Which description matches how the Scrum Guide characterizes a product?',
      options: [
        'A software application released at the end of each Sprint',
        'A vehicle to deliver value with a clear boundary, known stakeholders and well-defined users or customers',
        'Anything the organization pays the Scrum Team to work on, with no defined boundaries',
        'A list of features agreed on with the stakeholders',
      ],
      correctIndex: 1,
      explanation:
        'A product is a vehicle to deliver value, with a clear boundary, known stakeholders and well-defined users or customers. It could be a service, a physical product or something more abstract, so it is not limited to software.',
    },
    {
      id: '7-10',
      question:
        'Which three elements make up the Sprint Backlog, according to the Scrum Guide? Select three.',
      options: [
        'The Sprint Goal',
        'The complete Product Backlog',
        'The Product Backlog items selected for the Sprint',
        'A release plan approved by the stakeholders',
        'An actionable plan for delivering the Increment',
      ],
      correctIndexes: [0, 2, 4],
      explanation:
        'The Sprint Backlog consists of the Sprint Goal (why), the selected Product Backlog items (what) and an actionable plan for delivering the Increment (how). The full Product Backlog and release plans are not part of it.',
    },
    {
      id: '7-11',
      question: 'Whose plan is the Sprint Backlog?',
      options: [
        'The Product Owner, who uses it to track the Developers',
        'The Scrum Master, who uses it to report progress to management',
        'The stakeholders, who use it to follow the delivery',
        'The Developers, as a plan by and for them',
      ],
      correctIndex: 3,
      explanation:
        'The Sprint Backlog is a plan by and for the Developers: a highly visible, real-time picture of the work they plan to accomplish during the Sprint to achieve the Sprint Goal.',
    },
    {
      id: '7-12',
      question:
        'Halfway through the Sprint the Developers discover that some planned work is not needed and other work is. What does the Scrum Guide say about the Sprint Backlog?',
      options: [
        'It is fixed once Sprint Planning ends and cannot change',
        'It is updated throughout the Sprint as more is learned',
        'It may only be changed by the Product Owner',
        'It may only be changed at the Sprint Review',
      ],
      correctIndex: 1,
      explanation:
        'The Sprint Backlog is a real-time picture of the plan and is updated throughout the Sprint as more is learned. It is a plan of the Developers, not a frozen contract.',
    },
    {
      id: '7-13',
      question:
        'How much detail should the Sprint Backlog have, according to the Scrum Guide?',
      options: [
        'An hourly estimate for every task, so that stakeholders can track effort',
        'Only the titles of the selected Product Backlog items',
        'Enough detail that the Developers can inspect their progress in the Daily Scrum',
        'As much detail as the Scrum Master needs to report to management',
      ],
      correctIndex: 2,
      explanation:
        'The Sprint Backlog should have enough detail that the Developers can inspect their progress in the Daily Scrum. The Guide prescribes neither hourly estimates nor a level of detail for outside reporting.',
    },
    {
      id: '7-14',
      question:
        'Which two statements about the Sprint Goal are supported by the Scrum Guide? Select two.',
      options: [
        'It is the single objective for the Sprint',
        'It fixes the exact list of work for the Sprint',
        'It is set by the Product Owner alone, before Sprint Planning',
        'It creates coherence and focus, encouraging the Scrum Team to work together rather than on separate initiatives',
      ],
      correctIndexes: [0, 3],
      explanation:
        'The Sprint Goal is the single objective for the Sprint and creates coherence and focus. It provides flexibility regarding the exact work needed, and it is created during Sprint Planning.',
    },
    {
      id: '7-15',
      question: 'When is the Sprint Goal created, and where is it then kept?',
      options: [
        'During the Sprint Review of the previous Sprint; in the Product Backlog',
        'During the Sprint Planning event; added to the Sprint Backlog',
        'At the first Daily Scrum; in the Definition of Done',
        'Before the Sprint, by the stakeholders; in the Product Backlog',
      ],
      correctIndex: 1,
      explanation:
        'The Sprint Goal is created during the Sprint Planning event and then added to the Sprint Backlog. The whole Scrum Team collaborates on it there, so neither stakeholders nor a later event define it.',
    },
    {
      id: '7-16',
      question:
        'During the Sprint the Developers find that the work is harder than expected and they cannot finish everything selected. What should they do?',
      options: [
        'Ask the Scrum Master to extend the Sprint by a few days',
        'Cancel the Sprint, since the plan no longer holds',
        'Let the stakeholders decide to change the Sprint Goal',
        'Collaborate with the Product Owner to negotiate the scope of the Sprint Backlog without affecting the Sprint Goal',
      ],
      correctIndex: 3,
      explanation:
        'If the work turns out to be different than expected, the Developers collaborate with the Product Owner to negotiate the scope of the Sprint Backlog within the Sprint without affecting the Sprint Goal. Sprints have a fixed length, and cancellation is only for an obsolete Sprint Goal, by the Product Owner.',
    },
  ],
}

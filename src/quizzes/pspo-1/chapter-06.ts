import type { Chapter } from '../types'

export const chapter06: Chapter = {
  id: '6-product-backlog-management',
  number: 6,
  title: 'Product Backlog management',
  questions: [
    {
      id: '6-01',
      question: 'How does the Scrum Guide describe the Product Backlog?',
      options: [
        'A complete specification of the product that is signed off before the first Sprint',
        'A prioritized list of requirements, owned jointly by the Scrum Team and stakeholders',
        'An emergent, ordered list of what is needed to improve the product, and the single source of work undertaken by the Scrum Team',
        'A list of tasks for the next three Sprints, assigned to the Developers',
      ],
      correctIndex: 2,
      explanation:
        'The Product Backlog is an emergent, ordered list of what is needed to improve the product. It is the single source of work undertaken by the Scrum Team.',
    },
    {
      id: '6-02',
      question:
        'Which description of the Product Backlog sequence matches the Scrum Guide and Scrum.org teaching?',
      options: [
        'It is ordered; the best ordering is not always by priority, because dependencies, risk, learning and cost of delay also play a role',
        "It is prioritized by value only; all other factors are the Developers' concern",
        'It is ordered by the date the request was received',
        'It is ordered by the stakeholder with the highest seniority',
      ],
      correctIndex: 0,
      explanation:
        'The Guide speaks of an ordered list, not a prioritized one. Scrum.org stresses that good ordering weighs many factors, such as dependencies, risk, learning, cost and cost of delay, instead of merely listing the highest priority first.',
    },
    {
      id: '6-03',
      question: 'Who is accountable for ordering the Product Backlog items?',
      options: [
        'The Developers, as they know the effort',
        'The stakeholders, by voting at the Sprint Review',
        'The Scrum Master, in cooperation with the Product Owner',
        'The Product Owner',
      ],
      correctIndex: 3,
      explanation:
        "Ordering Product Backlog items is part of the Product Owner's accountability for effective Product Backlog management. The Product Owner may delegate the work but remains accountable.",
    },
    {
      id: '6-04',
      question: 'What is Product Backlog refinement?',
      options: [
        'A formal event at the start of each Sprint where the Product Backlog is estimated',
        'The act of breaking down and further defining Product Backlog items into smaller, more precise items; an ongoing activity',
        'A phase in which the Product Owner writes the detailed requirements for the Developers',
        'The Sprint Review activity in which stakeholders reorder the Product Backlog',
      ],
      correctIndex: 1,
      explanation:
        'Refinement is the act of breaking down and further defining Product Backlog items. It is an ongoing activity to add details such as description, order and size, not a formal event with a prescribed timebox.',
    },
    {
      id: '6-05',
      question:
        'The Developers say they want a weekly, 90-minute meeting for refinement. Which statement is accurate?',
      options: [
        'This is not allowed, because refinement may only take place in the Sprint Planning event',
        'This is not allowed, because only the Product Owner refines items',
        'This is required, because refinement is the sixth formal Scrum event',
        'This is allowed; refinement is an ongoing activity and Scrum does not prescribe how or when it is done',
      ],
      correctIndex: 3,
      explanation:
        'Scrum does not prescribe a refinement event; it is an ongoing activity that the Scrum Team organizes in whatever way works. The Product Backlog is refined as needed during the Sprint.',
    },
    {
      id: '6-06',
      question: 'Who is responsible for the sizing of Product Backlog items?',
      options: [
        'The Product Owner, because they know the business value',
        'The Developers who will be doing the work',
        'The Scrum Master, who coaches the estimation process',
        'The Scrum Team members who are not Developers',
      ],
      correctIndex: 1,
      explanation:
        'The Developers who will be doing the work are responsible for the sizing. The Product Owner may influence them by helping them understand and select trade-offs.',
    },
    {
      id: '6-07',
      question:
        "The Product Owner finds an item's size too high. What may the Product Owner do according to the Scrum Guide?",
      options: [
        'Change the size to match the budget',
        'Influence the Developers by helping them understand and select trade-offs',
        'Ask the Scrum Master to overrule the Developers',
        'Reject the item and remove it from the Product Backlog without discussion',
      ],
      correctIndex: 1,
      explanation:
        'The Product Owner may influence the Developers by helping them understand and select trade-offs; the sizing itself stays with the Developers who will do the work.',
    },
    {
      id: '6-08',
      question:
        'A new Product Owner asks whether Product Backlog items must be written as user stories. What is the best answer?',
      options: [
        'Yes; user stories are the required format for Product Backlog items in Scrum',
        'Yes, but only for items in the next Sprint',
        'No; Scrum does not prescribe a format for Product Backlog items, so a user story is one option among many',
        'No; items must be written as tasks of at most one day',
      ],
      correctIndex: 2,
      explanation:
        'The Scrum Guide does not use the term user story and prescribes no format or attributes beyond things such as description, order and size, which vary with the domain of work. The Scrum Team chooses what is helpful.',
    },
    {
      id: '6-09',
      question:
        'Which statement about estimating Product Backlog items is correct?',
      options: [
        'Story points are mandatory, so that velocity can be calculated',
        'Planning poker is mandatory for all items in the next Sprint',
        'Absolute hours are mandatory, to make the work transparent for stakeholders',
        'Scrum does not mandate an estimation technique or unit; the Developers choose how to size the work',
      ],
      correctIndex: 3,
      explanation:
        'The Guide talks about sizing, done by the Developers, without prescribing a unit or technique. Story points, planning poker or other approaches are optional.',
    },
    {
      id: '6-10',
      question:
        'According to the Scrum Guide, when are Product Backlog items deemed ready for selection in Sprint Planning?',
      options: [
        'When they meet a formal Definition of Ready approved by the Product Owner',
        'When they have a size expressed in story points',
        'When they can be Done by the Scrum Team within one Sprint',
        'When the stakeholders have signed off on them',
      ],
      correctIndex: 2,
      explanation:
        'Items that can be Done by the Scrum Team within one Sprint are deemed ready for selection in Sprint Planning. A Definition of Ready is not part of Scrum and is no formal gate.',
    },
    {
      id: '6-11',
      question:
        'The Developers refuse every item that does not meet their "Definition of Ready". Which statement is correct?',
      options: [
        'Correct; the Definition of Ready is a Scrum commitment that protects the Developers',
        'Scrum does not define a Definition of Ready; items just need to be sufficiently transparent to be selected, and the Scrum Team can refine them during Sprint Planning',
        'Correct; the Scrum Master has to enforce it for every item',
        'Wrong; the Product Owner may overrule it, as the Product Owner owns the Product Backlog',
      ],
      correctIndex: 1,
      explanation:
        'Definition of Ready is not a Scrum concept. Items deemed ready for selection are those that can be Done within a Sprint, and the Scrum Team may refine items during Sprint Planning to increase understanding and confidence.',
    },
    {
      id: '6-12',
      question:
        'During the Sprint a stakeholder asks a Developer to add a new feature. What is the most appropriate handling?',
      options: [
        'The Developer adds it to the Sprint Backlog immediately, since the stakeholder is a customer',
        'The Developer tells the stakeholder that the Product Owner decides about the Product Backlog and that this person may try to convince the Product Owner',
        'The Scrum Master adds the feature to the Sprint Backlog and removes another item',
        'The Developer declines and asks the stakeholder to submit it again after the release',
      ],
      correctIndex: 1,
      explanation:
        'Stakeholders influence the Product Backlog by convincing the Product Owner, who decides on content and order. New items belong in the Product Backlog; the Sprint Backlog is changed only by the Developers with the Sprint Goal in mind.',
    },
    {
      id: '6-13',
      question:
        'Which two of the following may legitimately influence the order of the Product Backlog? Select two.',
      options: [
        'Dependencies between items and risk',
        'The cost of delay and the expected value of an item',
        'The seniority of the person who requested the item',
        'The personal preference of the most vocal Developer',
      ],
      correctIndexes: [0, 1],
      explanation:
        'Scrum does not prescribe how the Product Backlog is ordered. Scrum.org lists factors such as dependencies, risk, learning, value, cost and cost of delay; requester seniority and personal preference are not sound ordering criteria.',
    },
    {
      id: '6-14',
      question:
        'A stakeholder demands the full Product Backlog be detailed before the first Sprint. What is the most appropriate response of the Product Owner?',
      options: [
        'Agree, because an incomplete Product Backlog will cause the Sprint to fail',
        'Agree, and schedule a Sprint 0 for the preparation work',
        'Explain that the Product Backlog is emergent: start with what is known, refine items as needed and learn from each Increment',
        'Refuse, because the Developers create the Product Backlog during the first Sprint',
      ],
      correctIndex: 2,
      explanation:
        'The Product Backlog is emergent and is refined on an ongoing basis. Scrum does not require a complete specification, and "Sprint 0" does not exist in the Guide.',
    },
  ],
}

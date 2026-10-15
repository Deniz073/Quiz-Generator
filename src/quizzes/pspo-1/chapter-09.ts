import type { Chapter } from '../types'

export const chapter09: Chapter = {
  id: '9-scenarios-and-anti-patterns',
  number: 9,
  title: 'Scenarios & anti-patterns',
  questions: [
    {
      id: '9-01',
      question:
        'A Product Owner assigns each Developer personal tasks at the start of every Sprint and tracks their progress. What is wrong with this?',
      options: [
        'Nothing; the Product Owner is accountable for value, so should control the work',
        'It undermines the self-managing Developers, who decide who does what, when and how',
        'The Product Owner should delegate this to the Scrum Master, which is the correct role',
        'The Product Owner should assign tasks on a weekly rather than Sprint basis',
      ],
      correctIndex: 1,
      explanation:
        'Scrum Teams are self-managing and the Developers plan their own work in the Sprint Backlog. The Product Owner decides what is valuable through the Product Backlog, not how or by whom it is built.',
    },
    {
      id: '9-02',
      question:
        'The Developers cannot reach the Product Owner for several days, and items are unclear. What is the most appropriate action?',
      options: [
        'The Developers make assumptions and continue; the Product Owner can inspect at the Sprint Review',
        'The Scrum Master takes over the role of the Product Owner temporarily',
        'The Developers stop the Sprint and ask the stakeholders to cancel it',
        'The Scrum Team treats it as an impediment and the Scrum Master helps the Product Owner and the organization to address it',
      ],
      correctIndex: 3,
      explanation:
        'Scope is clarified and renegotiated with the Product Owner during the Sprint, so the Product Owner needs to be available. The Scrum Master causes the removal of impediments and helps the organization understand the role.',
    },
    {
      id: '9-03',
      question:
        'A Product Owner wants to formally approve every Product Backlog item before it counts as Done. Which statement is correct?',
      options: [
        'This is the main purpose of the Sprint Review',
        'This is the main reason why a Product Owner exists',
        'An item is Done when it meets the Definition of Done; the Sprint Review is for inspecting the Increment and adapting, not for formal acceptance',
        'This is only valid when the Product Owner is also a Developer',
      ],
      correctIndex: 2,
      explanation:
        'Done is defined by the Definition of Done, which the Developers adhere to. The Sprint Review is a working session to inspect the outcome and adapt, not an approval gate.',
    },
    {
      id: '9-04',
      question:
        'The Product Owner joins the Daily Scrum and asks each Developer for a status update on their work. How does this relate to the Scrum Guide?',
      options: [
        'It is a good practice, as the Product Owner needs to see progress',
        'It is the required format of the Daily Scrum',
        'It is correct if the Scrum Master has agreed',
        'The Daily Scrum is for the Developers to inspect progress toward the Sprint Goal and plan the next day, not a status meeting for others',
      ],
      correctIndex: 3,
      explanation:
        'The Daily Scrum is a 15-minute event for the Developers. They choose the structure; the purpose is to inspect progress toward the Sprint Goal and adapt the Sprint Backlog.',
    },
    {
      id: '9-05',
      question:
        'Which of the following are anti-patterns of a Product Owner? Select two.',
      options: [
        'Writing down every stakeholder request in the Product Backlog without making ordering decisions',
        'Reducing the role to tracking milestones and assigning tasks, like a project manager',
        'Ordering the Product Backlog to maximize value toward the Product Goal',
        'Inviting key stakeholders to the Sprint Review to collaborate on what to do next',
      ],
      correctIndexes: [0, 1],
      explanation:
        'A Product Owner who merely transcribes requests or acts as a project manager does not maximize value. Ordering toward the Product Goal and collaborating with stakeholders is what the role is for.',
    },
    {
      id: '9-06',
      question:
        'A new Scrum Team insists on a "Sprint 0" in which the Product Owner writes all requirements, and the architecture is designed. How does this relate to Scrum?',
      options: [
        'It is required for new teams, to establish the Product Backlog',
        'The Guide has no Sprint 0; the team can begin with what is known and deliver a usable Increment in the first Sprint',
        'It is allowed only for products with more than three teams',
        'It is allowed when the Scrum Master approves it',
      ],
      correctIndex: 1,
      explanation:
        'Scrum has no Sprint 0. The Product Backlog is emergent, and every Sprint, including the first, aims at a usable Increment toward the Product Goal.',
    },
    {
      id: '9-07',
      question:
        'The Developers think an item should be ordered higher because of a technical dependency, but the Product Owner has it lower. What is the best approach?',
      options: [
        'The Developers reorder the Product Backlog themselves',
        'The Developers share the information and try to convince the Product Owner, who decides on the order',
        'The Developers ask the Scrum Master to overrule the Product Owner',
        'The Developers stop work until the stakeholders decide',
      ],
      correctIndex: 1,
      explanation:
        'Those who want to change the Product Backlog try to convince the Product Owner, who orders it. Technical insight such as dependencies helps the Product Owner make a good decision.',
    },
    {
      id: '9-08',
      question:
        'Three Scrum Teams work on one product. Each team wants its own Product Owner and Product Backlog. What does the Scrum Guide say?',
      options: [
        'This is the best way to keep teams independent',
        'This is fine if the Product Owners meet every Sprint',
        'This is fine when each team has its own Product Goal',
        'Teams working on the same product share the same Product Goal, Product Backlog and Product Owner, who may delegate work',
      ],
      correctIndex: 3,
      explanation:
        'Multiple Scrum Teams focused on the same product should share the same Product Goal, Product Backlog and Product Owner. The Product Owner can delegate work but remains accountable.',
    },
    {
      id: '9-09',
      question:
        'A customer has a new, urgent request. The Sprint Goal is still valid, and the request is not related to it. What should the Product Owner do?',
      options: [
        'Cancel the Sprint and start a new one with the request',
        'Add it to the Product Backlog and order it, unless it is so urgent that the Sprint Goal becomes obsolete',
        'Ask the Developers to add the item and drop the Sprint Goal',
        'Ask the Scrum Master to put it on the Sprint Backlog',
      ],
      correctIndex: 1,
      explanation:
        'New work goes into the Product Backlog and is ordered by the Product Owner. Only if the Sprint Goal becomes obsolete could the Product Owner cancel the Sprint.',
    },
    {
      id: '9-10',
      question:
        'A Product Owner delegates all decisions about the Product Backlog to a customer representative, and says "I am no longer accountable". Which statement is correct?',
      options: [
        'This is correct; the customer representative is now the Product Owner',
        'This is correct if the customer representative is a Scrum Team member',
        'The Product Owner remains accountable, regardless of delegation',
        'The Scrum Master becomes accountable',
      ],
      correctIndex: 2,
      explanation:
        'The Product Owner may delegate the work, but regardless remains accountable. The Product Owner is one person, not a committee or a proxy.',
    },
    {
      id: '9-11',
      question:
        'A stakeholder complains that the Increment shown at the Sprint Review is missing a feature and wants the Sprint extended. What is the most appropriate response?',
      options: [
        'Extend the Sprint until the feature is delivered',
        'Cancel the Sprint and start a new one with the feature',
        'Sprints are fixed length; the stakeholder can discuss the feature with the Product Owner, who can add or order it in the Product Backlog',
        'Ask the Developers to add the feature to the Increment before the end of the Review',
      ],
      correctIndex: 2,
      explanation:
        'Sprints are fixed length. The feedback is input for the Product Backlog; the Product Owner decides how to order it, which may become the work of the next Sprint.',
    },
  ],
}

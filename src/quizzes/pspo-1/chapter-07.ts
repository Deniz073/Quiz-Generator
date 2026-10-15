import type { Chapter } from '../types'

export const chapter07: Chapter = {
  id: '7-value-stakeholders-and-ebm',
  number: 7,
  title: 'Value, vision, stakeholders & EBM',
  questions: [
    {
      id: '7-01',
      question: 'How does the Scrum Guide describe a product?',
      options: [
        'A set of features that the Developers deliver during a project',
        'A vehicle to deliver value, with a clear boundary, known stakeholders and well-defined users or customers',
        'The sum of all Increments delivered in the current release',
        'A physical or digital item that can be sold for money',
      ],
      correctIndex: 1,
      explanation:
        'A product is a vehicle to deliver value. It has a clear boundary, known stakeholders and well-defined users or customers, and could be a service, a physical product or something more abstract.',
    },
    {
      id: '7-02',
      question:
        'How do the Product Goal and the product vision relate in Scrum.org teaching?',
      options: [
        'They are the same; the Product Goal is just another name for the vision',
        'The Product Goal replaces the vision, which has been removed from Scrum',
        'The vision is the objective of a single Sprint, the Product Goal of the whole product',
        'The vision describes the long-term purpose of the product; the Product Goal is a nearer-term target that bridges the vision and the Sprint Goals',
      ],
      correctIndex: 3,
      explanation:
        'The Guide itself does not mention a product vision, but Scrum.org teaches that the Product Owner owns it and that the Product Goal is the next target on the way to it. Sprint Goals are in turn steps toward the Product Goal.',
    },
    {
      id: '7-03',
      question: 'Who are stakeholders, relative to the Scrum Team?',
      options: [
        'Members of the Scrum Team who are not Developers',
        'Only the people who pay for the product',
        'Only people inside the organization who are senior to the Product Owner',
        'People outside the Scrum Team with an interest in the product, whose needs the Product Owner may represent in the Product Backlog',
      ],
      correctIndex: 3,
      explanation:
        'Stakeholders are not part of the Scrum Team. The Product Owner may represent the needs of many stakeholders in the Product Backlog, and the Scrum Team collaborates with them, especially at the Sprint Review.',
    },
    {
      id: '7-04',
      question:
        'Two stakeholder groups ask for opposite things, and both want theirs first. What is the best action for the Product Owner?',
      options: [
        'Let the groups vote at the next Sprint Review and follow the result',
        'Ask the Scrum Master to decide, since the Scrum Master facilitates stakeholder collaboration',
        'Order the Product Backlog following the request of the most senior stakeholder',
        'Listen to both, bring the groups together if helpful, then decide and make the order transparent in the Product Backlog',
      ],
      correctIndex: 3,
      explanation:
        "The Product Owner is one person who represents the needs of many stakeholders and is accountable for content and ordering. The Scrum Master may facilitate collaboration, but the decision remains the Product Owner's.",
    },
    {
      id: '7-05',
      question:
        'Which approach to the Sprint Review best supports stakeholder collaboration?',
      options: [
        'A working session in which the Scrum Team and stakeholders review what was accomplished and what has changed, then collaborate on what to do next',
        'A presentation by the Developers, with questions only at the end',
        'A report that is sent to the stakeholders after the Sprint',
        'A formal sign-off meeting where stakeholders accept or reject each item',
      ],
      correctIndex: 0,
      explanation:
        'The Sprint Review is a working session; the Scrum Team should avoid limiting it to a presentation. Attendees collaborate on what to do next and the Product Backlog may be adjusted to meet new opportunities.',
    },
    {
      id: '7-06',
      question: 'How does Scrum.org describe Evidence-Based Management (EBM)?',
      options: [
        'A prescriptive process for writing and approving Product Backlog items',
        'An empirical approach that helps organizations to continuously improve customer outcomes',
        'A set of mandatory measures that every Scrum Team must report on',
        'A technique to estimate the effort of Product Backlog items based on historical evidence',
      ],
      correctIndex: 1,
      explanation:
        'EBM is an empirical approach that helps organizations continuously improve customer outcomes by forming hypotheses, measuring results, and inspecting and adapting goals. It is not part of the Scrum Guide, and it defines no mandatory measures.',
    },
    {
      id: '7-07',
      question:
        'Which four are the Key Value Areas of Evidence-Based Management? Select four.',
      options: [
        'Current Value',
        'Unrealized Value',
        'Time-to-Market',
        'Ability to Innovate',
        'Velocity',
        'Team Utilization',
      ],
      correctIndexes: [0, 1, 2, 3],
      explanation:
        'The four Key Value Areas are Current Value, Unrealized Value, Time-to-Market and Ability to Innovate. Velocity and utilization are not Key Value Areas.',
    },
    {
      id: '7-08',
      question:
        'Which Key Value Area covers the potential future value that could be realized if the organization met the needs of all potential customers or users?',
      options: [
        'Current Value',
        'Time-to-Market',
        'Unrealized Value',
        'Ability to Innovate',
      ],
      correctIndex: 2,
      explanation:
        'Unrealized Value is the potential future value that could be realized if the organization met the needs of all customers or users. Current Value is the value the product delivers today.',
    },
    {
      id: '7-09',
      question:
        'A team tracks how often it releases and how long it takes for a change to reach users. Which Key Value Area do such measures inform?',
      options: [
        'Current Value',
        'Time-to-Market',
        'Unrealized Value',
        'Ability to Innovate',
      ],
      correctIndex: 1,
      explanation:
        "Time-to-Market is the organization's ability to quickly deliver new capabilities, services or products. Release frequency and lead time are typical example measures. Defect trends and technical debt are examples for Ability to Innovate.",
    },
    {
      id: '7-10',
      question:
        'A Product Owner wants to know whether the product delivers more value to customers. Which measure is the best fit for this question?',
      options: [
        'The number of story points the Developers completed per Sprint',
        'The number of Product Backlog items released',
        'Customer satisfaction and usage of the product',
        'The number of hours the Developers worked',
      ],
      correctIndex: 2,
      explanation:
        'Value is expressed in outcomes for customers and users, such as satisfaction and usage (Current Value). Story points, items released and hours worked measure output or effort, not value.',
    },
    {
      id: '7-11',
      question:
        'Does Evidence-Based Management require that specific Key Value Measures are used?',
      options: [
        'Yes, the same measures for every product so that they can be compared',
        'Yes, but only the measures of the Current Value area',
        'No; the listed measures are examples and organizations choose measures that fit their goals',
        'No; measures are not used in EBM, because Scrum relies on judgement',
      ],
      correctIndex: 2,
      explanation:
        'EBM defines no specific Key Value Measures; the ones in the guide show the kinds of measures that can be used. Organizations choose measures that fit their goals.',
    },
    {
      id: '7-12',
      question:
        'Which sequence best describes how EBM supports inspection and adaptation?',
      options: [
        'Plan the full scope, execute, report, close the project',
        'Form a hypothesis, run an experiment, inspect the measured results, adapt the goal or approach',
        'Collect requirements, build, acceptance test, release',
        'Commit to a target, work until it is met, reward the team',
      ],
      correctIndex: 1,
      explanation:
        'EBM is built on forming hypotheses, running experiments, inspecting the measured results against goals and adapting. This mirrors the empirical pillars of Scrum.',
    },
  ],
}

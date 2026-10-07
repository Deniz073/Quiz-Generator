import type { Chapter } from '../types'

export const chapter05: Chapter = {
  id: '5-sprint-and-planning',
  number: 5,
  title: 'The Sprint & Sprint Planning',
  questions: [
    {
      id: '5-01',
      question:
        'According to the Scrum Guide, what is the relationship between the Sprint and the other Scrum events?',
      options: [
        'The Sprint is one of five equal events that happen in sequence',
        'The Sprint is a container for all other events',
        'The Sprint is the event in which the Product Owner reviews all other events',
        'The Sprint is a planning horizon that sits above the events and is not an event itself',
      ],
      correctIndex: 1,
      explanation:
        'The Guide states that the Sprint is a container for all other events. All work necessary to achieve the Product Goal, including Sprint Planning, Daily Scrums, Sprint Review and Sprint Retrospective, happens within Sprints.',
    },
    {
      id: '5-02',
      question: 'Which statement about the length of a Sprint is correct?',
      options: [
        'Sprints are fixed length events of one month or less',
        'The Developers may extend a Sprint by a few days if the work is not finished',
        'A Sprint lasts exactly two weeks, otherwise it is not Scrum',
        'The length is chosen freshly in every Sprint Planning, up to six weeks',
      ],
      correctIndex: 0,
      explanation:
        'Sprints are fixed length events of one month or less to create consistency. Extending a Sprint to finish work would break the fixed length, and Scrum does not mandate exactly two weeks.',
    },
    {
      id: '5-03',
      question:
        'A Sprint has just concluded with its Sprint Retrospective. When does the next Sprint start?',
      options: [
        'After a short break in which the Product Owner prepares the Product Backlog',
        'Once the stakeholders have approved the results of the previous Sprint',
        'Immediately after the conclusion of the previous Sprint',
        'At the beginning of the next calendar week, after a day of Sprint preparation',
      ],
      correctIndex: 2,
      explanation:
        'A new Sprint starts immediately after the conclusion of the previous Sprint. The Guide describes no gap, approval step or preparation phase between Sprints.',
    },
    {
      id: '5-04',
      question:
        'Which two statements describe what happens during the Sprint, according to the Scrum Guide? Select two.',
      options: [
        'No changes are made that would endanger the Sprint Goal',
        'Scope may never change once Sprint Planning has ended',
        'Quality does not decrease',
        'Product Backlog refinement pauses until the Sprint Review',
      ],
      correctIndexes: [0, 2],
      explanation:
        'The Guide lists: no changes that endanger the Sprint Goal, quality does not decrease, the Product Backlog is refined as needed, and scope may be clarified and renegotiated with the Product Owner. Scope is therefore not frozen, and refinement does not pause.',
    },
    {
      id: '5-05',
      question:
        "According to the Scrum Guide, what may happen when a Sprint's horizon is too long? Select three.",
      options: [
        'The Sprint Goal may become invalid',
        'The Definition of Done may be relaxed',
        'Complexity may rise',
        'The Daily Scrum may be held weekly instead',
        'Risk may increase',
      ],
      correctIndexes: [0, 2, 4],
      explanation:
        "The Guide says that when a Sprint's horizon is too long the Sprint Goal may become invalid, complexity may rise, and risk may increase. Sprints are limited to one month or less so that progress toward the Product Goal is inspected at least every calendar month.",
    },
    {
      id: '5-06',
      question:
        'Halfway through a Sprint, the organization changes direction and the Sprint Goal no longer makes sense. Who has the authority to cancel the Sprint?',
      options: [
        'The Scrum Master, because they are accountable for the Scrum events',
        'The Developers, because they committed to the Sprint Goal',
        'The stakeholders who requested the change of direction',
        'Only the Product Owner',
      ],
      correctIndex: 3,
      explanation:
        'A Sprint could be cancelled if the Sprint Goal becomes obsolete, and only the Product Owner has the authority to cancel it. Neither the Scrum Master, the Developers nor stakeholders may do so.',
    },
    {
      id: '5-07',
      question:
        'Which two reasons does the Scrum Guide give for employing shorter Sprints? Select two.',
      options: [
        'They generate more learning cycles',
        'They make the Definition of Done less strict',
        'They limit the risk of cost and effort to a smaller time frame',
        'They allow the Sprint Retrospective to be skipped',
      ],
      correctIndexes: [0, 2],
      explanation:
        'The Guide says shorter Sprints can generate more learning cycles and limit risk of cost and effort to a smaller time frame. Nothing in Scrum lets shorter Sprints lower quality standards or drop an event.',
    },
    {
      id: '5-08',
      question:
        'A stakeholder says that the burn-down chart of the Scrum Team forecasts the outcome, so empirical inspection of progress is no longer needed. What does the Scrum Guide say about burn-downs, burn-ups and cumulative flows?',
      options: [
        'They are required Scrum practices that replace the need for empiricism',
        'They are forbidden because they are not defined in Scrum',
        'While proven useful, they do not replace the importance of empiricism',
        'They are only useful for Sprints longer than two weeks',
      ],
      correctIndex: 2,
      explanation:
        'The Guide acknowledges these practices as proven useful but says they do not replace empiricism, because in complex environments only what has already happened may be used for forward-looking decisions. They are neither required nor prohibited.',
    },
    {
      id: '5-09',
      question:
        'Why does the Scrum Guide say events are used in Scrum, besides creating opportunities to inspect and adapt?',
      options: [
        'To create regularity and to minimize the need for meetings not defined in Scrum',
        'To give the Scrum Master a way to track how much each Developer contributes',
        'To give management regular status reports on the Developers',
        'To replace the need for a Product Backlog',
      ],
      correctIndex: 0,
      explanation:
        'Events create regularity and minimize the need for meetings not defined in Scrum. They are formal opportunities to inspect and adapt artifacts, not reporting mechanisms for management or the Scrum Master.',
    },
    {
      id: '5-10',
      question:
        'Who creates the plan for the Sprint that is laid out during Sprint Planning?',
      options: [
        'The Developers alone, since only they do the work',
        'The Product Owner, who then hands it to the Developers',
        'The Scrum Master, who facilitates and documents it',
        'The entire Scrum Team, through collaborative work',
      ],
      correctIndex: 3,
      explanation:
        'The resulting plan is created by the collaborative work of the entire Scrum Team. The Developers have sole discretion over how items are turned into Increments, but the Sprint plan as a whole is a Scrum Team effort.',
    },
    {
      id: '5-11',
      question:
        'Who ensures that attendees of Sprint Planning are prepared to discuss the most important Product Backlog items and how they map to the Product Goal?',
      options: [
        'The Scrum Master',
        'The Product Owner',
        'The Developers',
        'The key stakeholders',
      ],
      correctIndex: 1,
      explanation:
        'The Guide assigns this to the Product Owner. The Scrum Master ensures the event takes place and stays in its timebox, but does not own the preparation of Product Backlog content.',
    },
    {
      id: '5-12',
      question:
        'The Developers want a security specialist from another department to join Sprint Planning. What does the Scrum Guide say?',
      options: [
        'Only members of the Scrum Team may attend Sprint Planning',
        'The Scrum Team may invite other people to attend Sprint Planning to provide advice',
        'The specialist must be approved by the stakeholders before attending',
        'The specialist may attend and decide which items the Developers select',
      ],
      correctIndex: 1,
      explanation:
        'The Scrum Team may invite other people to attend Sprint Planning to provide advice. They are there to advise, not to select work for the Developers.',
    },
    {
      id: '5-13',
      question:
        'Which three topics does Sprint Planning address, according to the Scrum Guide? Select three.',
      options: [
        'Why is this Sprint valuable?',
        'Which stakeholders must approve the Sprint scope?',
        'What can be Done this Sprint?',
        'What went wrong in the previous Sprint?',
        'How will the chosen work get done?',
      ],
      correctIndexes: [0, 2, 4],
      explanation:
        'Sprint Planning covers why the Sprint is valuable, what can be Done, and how the chosen work will get done. Stakeholders do not approve the Sprint scope, and looking back on the previous Sprint is the purpose of the Sprint Retrospective.',
    },
    {
      id: '5-14',
      question:
        'Sprint Planning is nearly over. The Developers have selected Product Backlog items, but the Scrum Team has not agreed on a Sprint Goal. What does the Scrum Guide require?',
      options: [
        'The Sprint Goal can be defined at the first Daily Scrum',
        'The Product Owner sets the Sprint Goal after Sprint Planning has ended',
        'The Sprint Goal is optional, the selected items are enough',
        'The Sprint Goal must be finalized prior to the end of Sprint Planning',
      ],
      correctIndex: 3,
      explanation:
        'The whole Scrum Team collaborates on the Sprint Goal and it must be finalized prior to the end of Sprint Planning. It is also part of the Sprint Backlog, which is the output of Sprint Planning.',
    },
    {
      id: '5-15',
      question:
        'During Sprint Planning, who selects the Product Backlog items to include in the current Sprint?',
      options: [
        'The Developers, through discussion with the Product Owner',
        'The Product Owner, who assigns the items to the Developers',
        "The Scrum Master, based on the Developers' past performance",
        'The stakeholders, based on the highest business value',
      ],
      correctIndex: 0,
      explanation:
        'Through discussion with the Product Owner, the Developers select items from the Product Backlog. The Product Owner proposes how the product could increase its value, but does not assign work to the Developers.',
    },
    {
      id: '5-16',
      question:
        'During Sprint Planning, the Product Owner insists that the Developers break the selected items into tasks in a specific way. Who decides how Product Backlog items are turned into Increments of value?',
      options: [
        'The Product Owner, since they are accountable for the product',
        'The Scrum Master, who coaches the Developers on the technique',
        'The Developers, at their sole discretion',
        'The Scrum Team by majority vote',
      ],
      correctIndex: 2,
      explanation:
        'How the Developers plan the work is at their sole discretion, and no one else tells them how to turn Product Backlog items into Increments of value. Decomposing items into work of one day or less is typical, but that remains up to the Developers.',
    },
    {
      id: '5-17',
      question:
        'What is the maximum timebox for Sprint Planning in a one-month Sprint?',
      options: ['Four hours', 'Three hours', 'Fifteen minutes', 'Eight hours'],
      correctIndex: 3,
      explanation:
        'Sprint Planning is timeboxed to a maximum of eight hours for a one-month Sprint. For shorter Sprints the event is usually shorter.',
    },
  ],
}

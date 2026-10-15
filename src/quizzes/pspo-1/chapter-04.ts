import type { Chapter } from '../types'

export const chapter04: Chapter = {
  id: '4-sprint-and-events',
  number: 4,
  title: 'The Sprint & Scrum events',
  questions: [
    {
      id: '4-01',
      question: 'What does the Scrum Guide say about the length of a Sprint?',
      options: [
        'It is exactly four weeks',
        'It is fixed length, one month or less, to create consistency',
        'It may be extended whenever the Developers need more time',
        'It is decided by the Product Owner for each Sprint separately',
      ],
      correctIndex: 1,
      explanation:
        'Sprints are fixed length events of one month or less to create consistency. A new Sprint starts immediately after the conclusion of the previous one.',
    },
    {
      id: '4-02',
      question:
        'What happens between the end of one Sprint and the start of the next?',
      options: [
        'A planning phase of at least one week',
        'A hardening period in which the Increment is stabilized',
        'A break chosen by the Product Owner',
        'Nothing; a new Sprint starts immediately after the conclusion of the previous Sprint',
      ],
      correctIndex: 3,
      explanation:
        'A new Sprint starts immediately after the conclusion of the previous Sprint. The Guide has no gaps, "Sprint 0" or hardening Sprints.',
    },
    {
      id: '4-03',
      question: 'Which statement describes what applies during a Sprint?',
      options: [
        'No changes of any kind are allowed once the Sprint has started',
        'The Product Owner may add new items to the Sprint Backlog at any time',
        'Quality may be reduced temporarily to protect the scope of the Sprint',
        'No changes are made that would endanger the Sprint Goal, quality does not decrease, and scope may be clarified and renegotiated with the Product Owner',
      ],
      correctIndex: 3,
      explanation:
        'During the Sprint: no changes that endanger the Sprint Goal, quality does not decrease, the Product Backlog is refined as needed, and scope may be clarified and renegotiated with the Product Owner as more is learned.',
    },
    {
      id: '4-04',
      question: 'Who has the authority to cancel a Sprint?',
      options: [
        'The Scrum Master',
        'The Developers',
        'The Product Owner',
        'The stakeholders, through the Product Owner',
      ],
      correctIndex: 2,
      explanation:
        'Only the Product Owner has the authority to cancel the Sprint. Nobody else, including management, stakeholders and the Scrum Master, can do so.',
    },
    {
      id: '4-05',
      question:
        'Under which condition could a Sprint be cancelled according to the Scrum Guide?',
      options: [
        'The Developers realize that not all selected items will be finished',
        'A stakeholder wants a different feature built urgently',
        'The Scrum Master identifies too many impediments',
        'The Sprint Goal becomes obsolete',
      ],
      correctIndex: 3,
      explanation:
        'A Sprint could be cancelled if the Sprint Goal becomes obsolete, for example after a change in company direction or market conditions. Falling behind is handled by negotiating scope, not by cancelling.',
    },
    {
      id: '4-06',
      question:
        'What is the maximum timebox of Sprint Planning for a one-month Sprint?',
      options: ['Four hours', 'Six hours', 'Eight hours', 'Two working days'],
      correctIndex: 2,
      explanation:
        'Sprint Planning is timeboxed to a maximum of eight hours for a one-month Sprint. For shorter Sprints the event is usually shorter.',
    },
    {
      id: '4-07',
      question: 'What is the timebox of the Daily Scrum?',
      options: [
        '15 minutes',
        'Ten percent of the Sprint Planning timebox',
        '30 minutes for a one-month Sprint',
        'One hour for teams with more than seven Developers',
      ],
      correctIndex: 0,
      explanation:
        'The Daily Scrum is a 15-minute event for the Developers, held at the same time and place every working day of the Sprint.',
    },
    {
      id: '4-08',
      question:
        'For a one-month Sprint, what are the maximum timeboxes of the Sprint Review and the Sprint Retrospective?',
      options: [
        'Three hours and four hours',
        'Four hours and three hours',
        'Four hours and four hours',
        'Eight hours and three hours',
      ],
      correctIndex: 1,
      explanation:
        'The Sprint Review is timeboxed to a maximum of four hours and the Sprint Retrospective to a maximum of three hours for a one-month Sprint. For shorter Sprints the events are usually shorter.',
    },
    {
      id: '4-09',
      question:
        'Which three topics does Sprint Planning address? Select three.',
      options: [
        'Why is this Sprint valuable?',
        'What can be Done this Sprint?',
        'Who will do which task, as assigned by the Scrum Master?',
        'How will the chosen work get done?',
        'Which stakeholders have to approve the Sprint Backlog?',
      ],
      correctIndexes: [0, 1, 3],
      explanation:
        'Sprint Planning addresses why the Sprint is valuable (the Sprint Goal), what can be Done, and how the chosen work will get done. Nobody assigns tasks and stakeholders do not approve the plan.',
    },
    {
      id: '4-10',
      question: 'By when must the Sprint Goal be finalized?',
      options: [
        'Before the end of Sprint Planning',
        'By the end of the first Daily Scrum',
        'By the middle of the Sprint, when the first results are visible',
        'Before the previous Sprint Review, so that stakeholders can approve it',
      ],
      correctIndex: 0,
      explanation:
        'The Sprint Goal must be finalized prior to the end of Sprint Planning. It is then added to the Sprint Backlog.',
    },
    {
      id: '4-11',
      question: 'Who may attend Sprint Planning?',
      options: [
        'Only the Developers and the Scrum Master',
        'The Scrum Team; it may also invite other people to provide advice',
        'The Scrum Team and all stakeholders, who must approve the Sprint Goal',
        'Only the Product Owner and the Developers',
      ],
      correctIndex: 1,
      explanation:
        'The plan is created by the collaborative work of the entire Scrum Team. The Scrum Team may also invite other people to attend Sprint Planning to provide advice.',
    },
    {
      id: '4-12',
      question: 'What is the purpose of the Daily Scrum?',
      options: [
        'To report status to the Product Owner and Scrum Master',
        'To let the Scrum Master assign the work for the day',
        'To inspect progress toward the Sprint Goal and adapt the Sprint Backlog as necessary',
        'To update the project plan for stakeholders',
      ],
      correctIndex: 2,
      explanation:
        'The purpose of the Daily Scrum is to inspect progress toward the Sprint Goal and adapt the Sprint Backlog as necessary, adjusting the upcoming planned work.',
    },
    {
      id: '4-13',
      question:
        'The Developers want to run their Daily Scrum without the three standard questions. What does the Scrum Guide say?',
      options: [
        'This is not allowed; the three questions are mandatory',
        'This is allowed only if the Scrum Master agrees',
        'The Developers can select whatever structure and techniques they want, as long as it focuses on progress toward the Sprint Goal and produces an actionable plan for the next day of work',
        'The Product Owner decides the structure, because the Daily Scrum informs them',
      ],
      correctIndex: 2,
      explanation:
        'The Developers can select whatever structure and techniques they want, as long as the Daily Scrum focuses on progress toward the Sprint Goal and produces an actionable plan for the next day of work.',
    },
    {
      id: '4-14',
      question: 'What is the purpose of the Sprint Review?',
      options: [
        'To demonstrate the work so that stakeholders can formally accept or reject it',
        'To inspect the outcome of the Sprint and determine future adaptations',
        'To plan improvements in how the Scrum Team works',
        'To decide whether the Increment may be released',
      ],
      correctIndex: 1,
      explanation:
        'The purpose of the Sprint Review is to inspect the outcome of the Sprint and determine future adaptations. It is a working session, not a formal acceptance or release gate.',
    },
    {
      id: '4-15',
      question: 'Who participates in the Sprint Review?',
      options: [
        'The Scrum Team and key stakeholders',
        'The Product Owner and the stakeholders; Developers are only invited when questions arise',
        'The Developers and the Scrum Master only',
        'All employees in the organization',
      ],
      correctIndex: 0,
      explanation:
        'The Scrum Team presents the results of their work to key stakeholders and progress toward the Product Goal is discussed. Attendees then collaborate on what to do next.',
    },
    {
      id: '4-16',
      question:
        'A manager says that an Increment may only be released after the Sprint Review has approved it. What does the Scrum Guide say?',
      options: [
        'The manager is right; releasing happens after the Sprint Review',
        'The manager is right when the Increment contains a new major feature',
        'An Increment may be delivered before the end of the Sprint; the Sprint Review should never be considered a gate to releasing value',
        'The Scrum Master decides whether the Review is a gate',
      ],
      correctIndex: 2,
      explanation:
        'An Increment may be delivered to stakeholders prior to the end of the Sprint. The Sprint Review should never be considered a gate to releasing value.',
    },
    {
      id: '4-17',
      question: 'What is the purpose of the Sprint Retrospective?',
      options: [
        'To plan ways to increase quality and effectiveness',
        'To evaluate the performance of individual Developers',
        'To collect stakeholder feedback about the Increment',
        'To update the Product Backlog with new items',
      ],
      correctIndex: 0,
      explanation:
        'The purpose of the Sprint Retrospective is to plan ways to increase quality and effectiveness. The Scrum Team inspects individuals, interactions, processes, tools and its Definition of Done.',
    },
    {
      id: '4-18',
      question:
        'The Scrum Team identifies an impactful improvement in the Sprint Retrospective. What does the Guide suggest?',
      options: [
        'Collect it in a list that is reviewed once per quarter',
        'Address the most impactful improvements as soon as possible; they may even be added to the Sprint Backlog for the next Sprint',
        'Hand it to management, because process changes are not a team matter',
        'Ask the Product Owner to put it in the Product Backlog as a low-order item',
      ],
      correctIndex: 1,
      explanation:
        'The most impactful improvements are addressed as soon as possible. They may even be added to the Sprint Backlog for the next Sprint.',
    },
    {
      id: '4-19',
      question: 'Which event is the last event of the Sprint, concluding it?',
      options: [
        'Sprint Review',
        'Sprint Planning',
        'Daily Scrum',
        'Sprint Retrospective',
      ],
      correctIndex: 3,
      explanation:
        'The Sprint Review is the second to last event of the Sprint; the Sprint Retrospective concludes the Sprint.',
    },
    {
      id: '4-20',
      question:
        'Which of the following is the Scrum Master accountable for regarding the Scrum events?',
      options: [
        'Ensuring that all Scrum events take place and are positive, productive and kept within the timebox',
        'Personally facilitating every event for the Scrum Team',
        'Deciding the agenda of every event on behalf of the Scrum Team',
        'Attending every event to report to management',
      ],
      correctIndex: 0,
      explanation:
        'The Scrum Master ensures that all events take place and are positive, productive and kept within the timebox. This does not require facilitating each event personally.',
    },
  ],
}

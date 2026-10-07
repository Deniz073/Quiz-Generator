import type { Chapter } from '../types'

export const chapter06: Chapter = {
  id: '6-daily-review-retrospective',
  number: 6,
  title: 'Daily Scrum, Sprint Review & Retrospective',
  questions: [
    {
      id: '6-01',
      question:
        'What is the purpose of the Daily Scrum, according to the Scrum Guide?',
      options: [
        'To report status to the Scrum Master so that they can track the Developers',
        'To inspect progress toward the Sprint Goal and adapt the Sprint Backlog as necessary',
        'To let the Product Owner check which Developers are behind schedule',
        'To plan the work of the next Sprint in advance',
      ],
      correctIndex: 1,
      explanation:
        'The Daily Scrum exists to inspect progress toward the Sprint Goal and adapt the Sprint Backlog, adjusting the upcoming planned work. It is a planning event for the Developers, not a status report to the Scrum Master or Product Owner.',
    },
    {
      id: '6-02',
      question:
        'A Scrum Team runs three-week Sprints. What is the timebox of the Daily Scrum?',
      options: [
        'Thirty minutes',
        'Forty-five minutes, scaled to the Sprint length',
        'Fifteen minutes',
        'There is no timebox for the Daily Scrum',
      ],
      correctIndex: 2,
      explanation:
        'The Daily Scrum is a 15-minute event. Unlike the other events, the Guide does not scale it with the Sprint length.',
    },
    {
      id: '6-03',
      question:
        'For whom is the Daily Scrum an event, according to the Scrum Guide?',
      options: [
        'The Scrum Master and the Product Owner, who receive the update',
        'The Developers of the Scrum Team',
        'The entire Scrum Team and the key stakeholders',
        'The Product Owner and the Developers, led by the Scrum Master',
      ],
      correctIndex: 1,
      explanation:
        'The Daily Scrum is a 15-minute event for the Developers of the Scrum Team. The Scrum Master ensures that it takes place and stays in its timebox, but it is not a meeting for them to receive updates.',
    },
    {
      id: '6-04',
      question:
        'The Product Owner is actively working on several items in the Sprint Backlog. What is their role in the Daily Scrum?',
      options: [
        'They observe silently and answer questions on request',
        'They chair the meeting, because they own the Product Backlog',
        'They participate as Developers',
        'They do not attend, because the Daily Scrum is for the Developers only',
      ],
      correctIndex: 2,
      explanation:
        'If the Product Owner or Scrum Master are actively working on items in the Sprint Backlog, they participate as Developers. Otherwise, the Daily Scrum remains an event for the Developers.',
    },
    {
      id: '6-05',
      question:
        'The Scrum Master insists that every Daily Scrum must follow the same three fixed questions. What does the Scrum Guide say about the structure of the Daily Scrum?',
      options: [
        'The Scrum Master decides the structure, as they ensure the event is productive',
        'The three questions are mandatory in the Scrum Guide',
        'The Product Owner defines the structure, because the Daily Scrum serves the Product Backlog',
        'The Developers can select whatever structure and techniques they want',
      ],
      correctIndex: 3,
      explanation:
        'The Developers can choose any structure and technique, which creates focus and improves self-management. The Guide does not prescribe a set of fixed questions.',
    },
    {
      id: '6-06',
      question:
        'Whatever structure the Developers choose, which two things must their Daily Scrum do? Select two.',
      options: [
        'Focus on progress toward the Sprint Goal',
        'Produce a written status report for the Scrum Master',
        'Produce an actionable plan for the next day of work',
        'Re-order the Product Backlog for the next Sprint',
      ],
      correctIndexes: [0, 2],
      explanation:
        'The Developers may use any structure as long as the Daily Scrum focuses on progress toward the Sprint Goal and produces an actionable plan for the next day of work. Reporting to the Scrum Master or ordering the Product Backlog is not its purpose.',
    },
    {
      id: '6-07',
      question:
        'At 2 pm the Developers realize that their approach will not work. Their Daily Scrum is the next morning. What does the Scrum Guide say?',
      options: [
        'They must wait for the next Daily Scrum before changing their plan',
        'They must ask the Scrum Master for permission to re-plan outside the Daily Scrum',
        'They can adjust their plan right away; the Daily Scrum is not the only time to do so',
        'They must call a Sprint Review to inform the stakeholders before changing the plan',
      ],
      correctIndex: 2,
      explanation:
        'The Daily Scrum is not the only time the Developers are allowed to adjust their plan. They often meet throughout the day for more detailed discussions about adapting or re-planning the rest of the Sprint work.',
    },
    {
      id: '6-08',
      question:
        'Which two benefits of the Daily Scrum are named in the Scrum Guide? Select two.',
      options: [
        'It replaces the need for the Sprint Retrospective',
        'It identifies impediments',
        'It lets the Product Owner approve the work done so far',
        'It promotes quick decision-making',
      ],
      correctIndexes: [1, 3],
      explanation:
        'The Guide says Daily Scrums improve communications, identify impediments, promote quick decision-making and consequently eliminate the need for other meetings. They do not replace any other Scrum event or serve as an approval step.',
    },
    {
      id: '6-09',
      question: 'What is the purpose of the Sprint Review?',
      options: [
        'To inspect the outcome of the Sprint and determine future adaptations',
        'To let the Product Owner formally accept or reject the work so that it can be released',
        'To assess the performance of the Developers during the Sprint',
        'To plan ways to increase quality and effectiveness for the next Sprint',
      ],
      correctIndex: 0,
      explanation:
        'The Sprint Review inspects the outcome of the Sprint and determines future adaptations. Planning ways to improve quality and effectiveness is the purpose of the Sprint Retrospective, and the Review is not a release gate.',
    },
    {
      id: '6-10',
      question:
        'A Scrum Team plans its Sprint Review as a slide presentation followed by questions from the stakeholders. What does the Scrum Guide say about the format?',
      options: [
        'A formal presentation is required so that stakeholders can approve the work',
        'The Sprint Review is a working session, and the Scrum Team should avoid limiting it to a presentation',
        'The Sprint Review is a status meeting for the Scrum Master',
        'The Scrum Team presents, and stakeholders must not discuss the Product Backlog',
      ],
      correctIndex: 1,
      explanation:
        'The Sprint Review is a working session in which the Scrum Team and stakeholders collaborate on what to do next. The Guide explicitly says to avoid limiting it to a presentation.',
    },
    {
      id: '6-11',
      question:
        'During the Sprint Review, a stakeholder points out a new market opportunity. What does the Scrum Guide say about the Product Backlog?',
      options: [
        'It is frozen until the next Sprint Planning',
        'It may not change without a formal change request',
        'It may only be adjusted by the Developers',
        'It may be adjusted to meet new opportunities',
      ],
      correctIndex: 3,
      explanation:
        'Based on what was accomplished and what has changed in the environment, attendees collaborate on what to do next, and the Product Backlog may be adjusted to meet new opportunities. The Product Owner remains the single person accountable for it.',
    },
    {
      id: '6-12',
      question:
        'Which two statements about the order of events at the end of a Sprint are supported by the Scrum Guide? Select two.',
      options: [
        'The Sprint Review is the second to last event of the Sprint',
        'The Sprint Review concludes the Sprint',
        'The Sprint Retrospective concludes the Sprint',
        'Sprint Planning takes place between two Sprints, not within one',
      ],
      correctIndexes: [0, 2],
      explanation:
        'The Review is the second to last event, and the Retrospective concludes the Sprint. Sprint Planning happens within the Sprint, since all work including the events happens within Sprints.',
    },
    {
      id: '6-13',
      question:
        'What is the maximum timebox for the Sprint Review in a one-month Sprint?',
      options: ['Four hours', 'Eight hours', 'Three hours', 'Two hours'],
      correctIndex: 0,
      explanation:
        'The Sprint Review is timeboxed to a maximum of four hours for a one-month Sprint. For shorter Sprints, the event is usually shorter.',
    },
    {
      id: '6-14',
      question: 'What is the purpose of the Sprint Retrospective?',
      options: [
        'To present the Increment to the key stakeholders',
        'To plan ways to increase quality and effectiveness',
        'To decide which Developers need to improve their individual performance',
        'To adjust the Sprint Backlog for the next day of work',
      ],
      correctIndex: 1,
      explanation:
        'The purpose of the Sprint Retrospective is to plan ways to increase quality and effectiveness. Presenting the Increment belongs to the Sprint Review, and adjusting the Sprint Backlog for the next day is the Daily Scrum.',
    },
    {
      id: '6-15',
      question: 'What does the Scrum Team inspect in the Sprint Retrospective?',
      options: [
        'The Increment and the changes in the market, together with the stakeholders',
        'How the last Sprint went regarding individuals, interactions, processes, tools and their Definition of Done',
        'Only the Sprint Backlog items that were not finished',
        'The Product Goal and the order of the Product Backlog',
      ],
      correctIndex: 1,
      explanation:
        'The Scrum Team inspects how the last Sprint went with regard to individuals, interactions, processes, tools and the Definition of Done. Inspecting the Increment and the environment is the Sprint Review.',
    },
    {
      id: '6-16',
      question:
        'Which two activities belong to the Sprint Retrospective, according to the Scrum Guide? Select two.',
      options: [
        'Identifying assumptions that led the team astray and exploring their origins',
        'Getting stakeholder sign-off on the Increment',
        'Ranking the Developers by their contribution to the Sprint',
        'Discussing what went well, what problems were encountered and how they were or were not solved',
      ],
      correctIndexes: [0, 3],
      explanation:
        'The Guide says assumptions that led the team astray are identified and their origins explored, and the team discusses what went well and which problems occurred. Sign-off and rankings are not part of the Retrospective.',
    },
    {
      id: '6-17',
      question:
        'In the Sprint Retrospective the Scrum Team identifies a highly impactful improvement. What does the Scrum Guide say about addressing it?',
      options: [
        'It must wait until the Product Owner has approved it at the Sprint Review',
        'It can only be addressed in the next quarterly improvement initiative',
        'It may even be added to the Sprint Backlog for the next Sprint',
        'It must first be escalated to management for approval',
      ],
      correctIndex: 2,
      explanation:
        'The most impactful improvements are addressed as soon as possible and may even be added to the Sprint Backlog for the next Sprint. No approval step or waiting period is prescribed.',
    },
    {
      id: '6-18',
      question:
        'What is the maximum timebox for the Sprint Retrospective in a one-month Sprint?',
      options: ['Two hours', 'Four hours', 'Three hours', 'One hour'],
      correctIndex: 2,
      explanation:
        'The Sprint Retrospective is timeboxed to a maximum of three hours for a one-month Sprint. For shorter Sprints, the event is usually shorter.',
    },
  ],
}

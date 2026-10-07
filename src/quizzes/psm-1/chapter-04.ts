import type { Chapter } from '../types'

export const chapter04: Chapter = {
  id: '4-scrum-master',
  number: 4,
  title: 'The Scrum Master',
  questions: [
    {
      id: '4-01',
      question:
        'According to the Scrum Guide, how does the Scrum Master establish Scrum as defined in the Scrum Guide?',
      options: [
        'By enforcing the rules of Scrum and reporting deviations to management',
        "By managing the Developers' work and assigning tasks",
        'By helping everyone understand Scrum theory and practice, both within the Scrum Team and the organization',
        "By adapting the rules of Scrum to fit the organization's existing processes",
      ],
      correctIndex: 2,
      explanation:
        'The Scrum Master is accountable for establishing Scrum by helping everyone understand Scrum theory and practice. The Guide describes this as helping and serving, not enforcing or managing.',
    },
    {
      id: '4-02',
      question:
        'For which two of the following is the Scrum Master accountable? Select two.',
      options: [
        'Maximizing the value of the product resulting from the work of the Scrum Team',
        'Establishing Scrum as defined in the Scrum Guide',
        "The Scrum Team's effectiveness",
        'Meeting the delivery date and budget agreed with stakeholders',
      ],
      correctIndexes: [1, 2],
      explanation:
        "The Scrum Master is accountable for establishing Scrum and for the Scrum Team's effectiveness. Maximizing the value of the product is the Product Owner's accountability, and the Guide does not make the Scrum Master accountable for a date or budget.",
    },
    {
      id: '4-03',
      question: 'How does the Scrum Guide describe Scrum Masters?',
      options: [
        'As project managers who direct the work of the Scrum Team',
        'As line managers of the Developers',
        "As administrators who record and report the team's status to management",
        'As true leaders who serve the Scrum Team and the larger organization',
      ],
      correctIndex: 3,
      explanation:
        "The Guide says Scrum Masters are true leaders who serve the Scrum Team and the larger organization. They have no authority to manage the team's work, because the Scrum Team is self-managing.",
    },
    {
      id: '4-04',
      question:
        "Which statement best matches how the Scrum Guide describes the Scrum Master's service regarding impediments?",
      options: [
        'Personally resolving every impediment so that the Developers are never interrupted',
        "Causing the removal of impediments to the Scrum Team's progress",
        'Deciding which impediments the Developers are allowed to raise',
        'Logging impediments for managers to review at the end of the Sprint',
      ],
      correctIndex: 1,
      explanation:
        'The Guide says the Scrum Master serves the Scrum Team by causing the removal of impediments to its progress. This does not mean doing all of it personally, and waiting until the end of the Sprint would delay adaptation.',
    },
    {
      id: '4-05',
      question:
        'Which statement about the Scrum Master and Scrum events is supported by the Scrum Guide?',
      options: [
        'The Scrum Master must personally facilitate every event, otherwise the event is not valid',
        'The Scrum Master ensures that all Scrum events take place and are positive, productive, and kept within the timebox',
        'The Scrum Master may extend a timebox when the discussion is valuable',
        'The Scrum Master is only responsible for Sprint Planning and the Sprint Review',
      ],
      correctIndex: 1,
      explanation:
        'The Guide says the Scrum Master ensures that all Scrum events take place and are positive, productive, and kept within the timebox. It says "ensuring", not personally running each event; for example, the Daily Scrum is an event for the Developers.',
    },
    {
      id: '4-06',
      question:
        'The Product Owner struggles to keep the Product Backlog clear and the Product Goal well defined. How can the Scrum Master help, according to the Scrum Guide?',
      options: [
        'By forming a committee of stakeholders to share the Product Owner role',
        'By helping find techniques for effective Product Goal definition and Product Backlog management',
        "By leaving it alone, because Product Backlog management is outside the Scrum Master's services",
        'By asking management to appoint a project manager to take over the role',
      ],
      correctIndex: 1,
      explanation:
        'The Guide lists helping find techniques for effective Product Goal definition and Product Backlog management among the ways the Scrum Master serves the Product Owner. The Product Owner is one person, not a committee.',
    },
    {
      id: '4-07',
      question:
        'According to the Scrum Guide, when does the Scrum Master facilitate stakeholder collaboration?',
      options: [
        'As requested or needed',
        'Always, at every Sprint Review and Sprint Planning',
        'Never, because only the Product Owner may talk to stakeholders',
        'Only when the Developers are blocked by an impediment',
      ],
      correctIndex: 0,
      explanation:
        'The Guide lists "facilitating stakeholder collaboration as requested or needed" as a service to the Product Owner. It is neither mandatory in every event nor forbidden.',
    },
    {
      id: '4-08',
      question:
        'Which three of the following are ways the Scrum Master serves the organization, according to the Scrum Guide? Select three.',
      options: [
        'Leading, training, and coaching the organization in its Scrum adoption',
        'Setting individual performance targets for Developers',
        'Planning and advising Scrum implementations within the organization',
        'Removing barriers between stakeholders and Scrum Teams',
        'Deciding which stakeholders are allowed to attend the Sprint Review',
      ],
      correctIndexes: [0, 2, 3],
      explanation:
        'The Guide lists leading, training and coaching the organization in Scrum adoption, planning and advising implementations, helping people understand an empirical approach, and removing barriers between stakeholders and Scrum Teams. Managing performance or controlling attendance is not mentioned.',
    },
    {
      id: '4-09',
      question:
        'A manager asks the Scrum Master to assign tasks to individual Developers and to report who is slowest. What does the Scrum Guide suggest?',
      options: [
        "The Scrum Master should assign the tasks, since they are accountable for the team's effectiveness",
        'The Scrum Master should assign the tasks, but only during Sprint Planning',
        'The Scrum Master should coach the Developers in self-management; the Scrum Team internally decides who does what, when, and how',
        'The Scrum Master should let the Product Owner assign tasks instead',
      ],
      correctIndex: 2,
      explanation:
        'The Scrum Master coaches team members in self-management and cross-functionality, and the Scrum Team decides internally who does what, when, and how. Assigning tasks would undermine the self-management that Scrum Masters are meant to foster.',
    },
    {
      id: '4-10',
      question:
        'Which two of the following are ways the Scrum Master serves the Scrum Team, according to the Scrum Guide? Select two.',
      options: [
        'Coaching the team members in self-management and cross-functionality',
        'Ordering the Product Backlog items by value',
        'Helping the Scrum Team focus on creating high-value Increments that meet the Definition of Done',
        'Deciding which Product Backlog items the Developers select for the Sprint',
      ],
      correctIndexes: [0, 2],
      explanation:
        "Coaching in self-management and cross-functionality and helping the team focus on high-value Increments that meet the Definition of Done are listed services. Ordering the Product Backlog is the Product Owner's accountability, and the Developers select the items for the Sprint through discussion with the Product Owner.",
    },
    {
      id: '4-11',
      question:
        'The Scrum Master is also working on items in the Sprint Backlog this Sprint. What is their role in the Daily Scrum?',
      options: [
        'They facilitate it and ask each Developer for a status update',
        'They attend only as an observer, because the Daily Scrum is for the Developers',
        'They participate as Developers',
        'They do not attend, because the Scrum Master must stay neutral',
      ],
      correctIndex: 2,
      explanation:
        'The Guide says that if the Product Owner or Scrum Master are actively working on items in the Sprint Backlog, they participate in the Daily Scrum as Developers. The Developers choose the structure of the event themselves.',
    },
    {
      id: '4-12',
      question:
        'The Scrum Master notices that the Sprint Review has turned into a one-way presentation in which stakeholders only listen. What fits the Scrum Guide best?',
      options: [
        'Help the Scrum Team make it a working session where attendees collaborate on what to do next',
        'Cancel the Sprint Review and let stakeholders inspect the Increment on their own',
        'Extend the timebox so there is more time for presenting',
        'Replace the Sprint Review with a demo run by the Scrum Master',
      ],
      correctIndex: 0,
      explanation:
        'The Scrum Master ensures events are positive and productive, and the Guide says the Sprint Review is a working session that the team should avoid limiting to a presentation. Cancelling it would waste a formal opportunity to inspect and adapt.',
    },
    {
      id: '4-13',
      question:
        "According to the Scrum Guide, how does the Scrum Master increase the Scrum Team's effectiveness?",
      options: [
        "By defining the team's practices and checking that they are followed",
        "By measuring each Developer's productivity and reporting it to management",
        'By enabling the Scrum Team to improve its practices, within the Scrum framework',
        'By modifying the Scrum framework to fit the team',
      ],
      correctIndex: 2,
      explanation:
        "The Guide says the Scrum Master is accountable for the Scrum Team's effectiveness by enabling the team to improve its practices within the Scrum framework. The team improves itself; the framework itself is not changed.",
    },
    {
      id: '4-14',
      question:
        'A department that is new to Scrum does not understand why the work has to be approached empirically and keeps asking for detailed upfront plans. What does the Scrum Guide say the Scrum Master does?',
      options: [
        'Nothing, because the Scrum Master only serves the Scrum Team and not the wider organization',
        'Leaves the adoption entirely to management and focuses on the Developers',
        'Creates a tailored version of Scrum with upfront planning to make the department comfortable',
        'Helps employees and stakeholders understand and enact an empirical approach for complex work',
      ],
      correctIndex: 3,
      explanation:
        'The Scrum Master serves the larger organization by leading, training and coaching it in Scrum adoption and by helping employees and stakeholders understand and enact an empirical approach. Scrum Masters are true leaders who serve the Scrum Team and the larger organization.',
    },
  ],
}

import type { Chapter } from '../types'

export const chapter01: Chapter = {
  id: '1-scrum-theory-and-values',
  number: 1,
  title: 'Scrum theory, values & framework',
  questions: [
    {
      id: '1-01',
      question:
        'Which statement best describes Scrum according to the Scrum Guide?',
      options: [
        'A lightweight framework that helps people, teams and organizations generate value through adaptive solutions for complex problems',
        'A project management methodology that prescribes the activities of every project phase in detail',
        'A set of engineering practices that Developers must follow to build software',
        'A planning technique for predicting the exact scope, cost and date of a product up front',
      ],
      correctIndex: 0,
      explanation:
        'Scrum is a lightweight framework for generating value through adaptive solutions to complex problems. It deliberately gives no detailed instructions; the rules of Scrum guide relationships and interactions.',
    },
    {
      id: '1-02',
      question: 'What does empiricism assert?',
      options: [
        'Knowledge comes from detailed up-front analysis and a plan that is followed precisely',
        'Knowledge comes from experience and making decisions based on what is observed',
        'Knowledge comes from the opinion of the most senior and experienced person',
        'Knowledge comes from comparing the work with industry best practices',
      ],
      correctIndex: 1,
      explanation:
        'Scrum is founded on empiricism and lean thinking. Empiricism asserts that knowledge comes from experience and making decisions based on what is observed; lean thinking reduces waste and focuses on the essentials.',
    },
    {
      id: '1-03',
      question:
        'Which three are the pillars of empirical process control in Scrum? Select three.',
      options: [
        'Transparency',
        'Inspection',
        'Commitment',
        'Adaptation',
        'Courage',
      ],
      correctIndexes: [0, 1, 3],
      explanation:
        'The pillars are transparency, inspection and adaptation. Commitment and courage are two of the five Scrum values, not pillars.',
    },
    {
      id: '1-04',
      question: 'Which of the following is one of the five Scrum values?',
      options: ['Transparency', 'Inspection', 'Adaptation', 'Openness'],
      correctIndex: 3,
      explanation:
        'The five values are Commitment, Focus, Openness, Respect and Courage. Transparency, inspection and adaptation are the empirical pillars, a frequently confused pair.',
    },
    {
      id: '1-05',
      question:
        'The Scrum Guide states that "inspection without transparency is ..." what?',
      options: [
        'Acceptable, as long as the Scrum Master performs it',
        'Faster, because fewer people are involved',
        'Misleading and wasteful',
        'Only a problem for the Sprint Review',
      ],
      correctIndex: 2,
      explanation:
        'Transparency enables inspection; inspection without transparency is misleading and wasteful. Artifacts with low transparency lead to decisions that diminish value and increase risk.',
    },
    {
      id: '1-06',
      question:
        'A Scrum Team decides to drop the Sprint Retrospective because it has not produced much value lately and keeps all other events. According to the Scrum Guide, what is the result?',
      options: [
        'A valid tailoring of Scrum, because Scrum Teams own their own process',
        'A valid tailoring, as long as the Product Owner agrees',
        'Scrum is unaffected, because the Retrospective is the least important event',
        'The result is not Scrum; leaving out elements covers up problems and limits the benefits of Scrum',
      ],
      correctIndex: 3,
      explanation:
        'The Guide says that leaving out elements or not following the rules of Scrum covers up problems and limits the benefits. Implementing only parts of Scrum is possible, but the result is not Scrum.',
    },
    {
      id: '1-07',
      question:
        'A team wants to use user stories, story points and a team charter next to Scrum. What does the Scrum Guide say about adding such techniques?',
      options: [
        'They are forbidden, because Scrum is immutable and may not be combined with other practices',
        'Various processes, techniques and methods can be employed within the framework, which is purposefully incomplete',
        'They must be approved by the Scrum Master before use',
        'They are required for every Scrum Team to make the framework complete',
      ],
      correctIndex: 1,
      explanation:
        'Scrum only defines the parts required to implement Scrum theory and functions as a container for other techniques and practices. Nothing in the Guide mandates or forbids user stories or story points.',
    },
    {
      id: '1-08',
      question: 'What does lean thinking contribute to Scrum?',
      options: [
        'It reduces waste and focuses on the essentials',
        'It prescribes fixed-length work-in-progress limits per Developer',
        'It requires Developers to work on exactly one item at a time',
        'It replaces the need for inspection and adaptation',
      ],
      correctIndex: 0,
      explanation:
        'The Guide states that lean thinking reduces waste and focuses on the essentials. It does not prescribe work-in-progress limits.',
    },
    {
      id: '1-09',
      question:
        'The Scrum Guide says that in complex environments "what will happen is unknown". Which information may therefore be used for forward-looking decision making?',
      options: [
        'Only what has already happened',
        'The best estimate of the most experienced team member',
        'The original plan, which should not be changed',
        'Industry benchmarks of similar products',
      ],
      correctIndex: 0,
      explanation:
        'In complex environments only what has already happened may be used for forward-looking decisions. Forecasting practices such as burn-ups do not replace the importance of empiricism.',
    },
    {
      id: '1-10',
      question:
        'When should an adjustment be made if an aspect of the process deviates outside acceptable limits or the product is unacceptable?',
      options: [
        'At the next Sprint Retrospective, so that the whole team can discuss it',
        'At the end of the release, when all data is available',
        'As soon as possible, to minimize further deviation',
        'Only after the Scrum Master has approved the change',
      ],
      correctIndex: 2,
      explanation:
        'The Guide states the adjustment must be made as soon as possible to minimize further deviation. A Scrum Team is expected to adapt the moment it learns anything new through inspection.',
    },
    {
      id: '1-11',
      question:
        'How many formal events does Scrum define, including the Sprint itself?',
      options: ['Three', 'Four', 'Six', 'Five'],
      correctIndex: 3,
      explanation:
        'Scrum has four formal events for inspection and adaptation (Sprint Planning, Daily Scrum, Sprint Review, Sprint Retrospective) within a containing event, the Sprint: five in total.',
    },
    {
      id: '1-12',
      question:
        'The Scrum Guide says that Scrum Teams should be "self-managing". What does this mean?',
      options: [
        'The team decides internally who does what, when, and how',
        'The team decides which stakeholders may attend the Sprint Review',
        'The team has no accountabilities, so nobody can be held responsible',
        'The team may choose which Scrum events it holds',
      ],
      correctIndex: 0,
      explanation:
        'Self-managing means the Scrum Team internally decides who does what, when and how. This is not the same as dropping the Scrum accountabilities or events.',
    },
  ],
}

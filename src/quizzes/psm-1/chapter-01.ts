import type { Chapter } from '../types'

export const chapter01: Chapter = {
  id: '1-definition-and-theory',
  number: 1,
  title: 'Scrum Definition & Theory',
  questions: [
    {
      question:
        'Which statement best describes Scrum according to the Scrum Guide?',
      options: [
        'A detailed methodology that prescribes step-by-step instructions for every project phase',
        'A project management process designed for work whose outcome is fully predictable',
        'A lightweight framework that helps people, teams and organizations generate value through adaptive solutions for complex problems',
        'A set of engineering practices that Developers must follow to build software',
      ],
      correctIndex: 2,
      explanation:
        'The Scrum Guide defines Scrum as a lightweight framework for generating value through adaptive solutions to complex problems. It deliberately provides no detailed instructions; the rules of Scrum guide relationships and interactions instead.',
    },
    {
      question:
        'Why does the Scrum Guide describe the Scrum framework as "purposefully incomplete"?',
      options: [
        'Because the Scrum Guide is still a draft and teams must wait for the missing events to be defined',
        'Because teams are expected to leave out the parts of Scrum that do not fit their context',
        'Because roles such as project manager are intentionally left for each organization to define',
        'Because it only defines the parts required to implement Scrum theory and is built upon by the collective intelligence of the people using it',
      ],
      correctIndex: 3,
      explanation:
        'Scrum only defines the parts required to implement Scrum theory; people fill in the rest with processes, techniques and methods. Leaving out elements of Scrum is not allowed, because that covers up problems and limits the benefits.',
    },
    {
      question:
        'A Scrum Team finds the Sprint Retrospective unproductive and decides to stop holding it while keeping all other events. According to the Scrum Guide, what is the consequence?',
      options: [
        'Nothing changes, because Scrum Teams may tailor the framework to suit their needs',
        'Leaving out elements covers up problems and limits the benefits of Scrum, and the result is not Scrum',
        'The Scrum Master must document the deviation and get approval from management',
        'The Sprint Review automatically takes over the purpose of the Sprint Retrospective',
      ],
      correctIndex: 1,
      explanation:
        'The Guide states that leaving out elements covers up problems and limits the benefits of Scrum, potentially rendering it useless, and that implementing only parts of Scrum does not result in Scrum. The Sprint Review inspects the outcome of the Sprint, not how the team can improve its own effectiveness.',
    },
    {
      question:
        'In a nutshell, Scrum requires a Scrum Master to foster an environment where which two things happen? Select two.',
      options: [
        'A Product Owner orders the work for a complex problem into a Product Backlog',
        'The Scrum Master assigns the Product Backlog items to individual Developers',
        'The Scrum Team and its stakeholders inspect the results and adjust for the next Sprint',
        'A separate testing team verifies the work after the Sprint has ended',
      ],
      correctIndexes: [0, 2],
      explanation:
        'The four steps are: the Product Owner orders the work into a Product Backlog, the Scrum Team turns a selection into an Increment during a Sprint, the Scrum Team and stakeholders inspect and adjust, and repeat. Nobody assigns work to individuals; the Scrum Team is self-managing.',
    },
    {
      question: 'What is Scrum founded on?',
      options: [
        'Detailed upfront planning and command-and-control management',
        'Defined process control and scientific management',
        'Extreme Programming and Kanban',
        'Empiricism and lean thinking',
      ],
      correctIndex: 3,
      explanation:
        'Scrum is founded on empiricism and lean thinking. It does not rely on detailed upfront plans, because in complex work what will happen is unknown.',
    },
    {
      question:
        'Which two statements about empiricism and lean thinking are in line with the Scrum Guide? Select two.',
      options: [
        'Empiricism asserts that knowledge comes from experience and making decisions based on what is observed',
        'Empiricism asserts that thorough upfront analysis removes the need for frequent inspection',
        'Lean thinking aims to maximize the utilization of every team member at all times',
        'Lean thinking reduces waste and focuses on the essentials',
      ],
      correctIndexes: [0, 3],
      explanation:
        'Empiricism is knowledge from experience and observation; lean thinking reduces waste and focuses on the essentials. The Guide never promotes upfront analysis in place of inspection or maximizing utilization.',
    },
    {
      question:
        'What does Scrum use an iterative, incremental approach to optimize and control?',
      options: [
        'Individual utilization and the number of meetings',
        'Predictability and risk',
        'The amount of documentation and the accuracy of the initial plan',
        'Scope and delivery date, which are fixed at the start',
      ],
      correctIndex: 1,
      explanation:
        'Scrum employs an iterative, incremental approach to optimize predictability and to control risk. Scope is not fixed upfront; it can be clarified and renegotiated with the Product Owner as more is learned.',
    },
    {
      question:
        'Which set lists the three empirical pillars of Scrum, as named in the Scrum Guide?',
      options: [
        'Transparency, inspection, adaptation',
        'Planning, inspection, adaptation',
        'Transparency, commitment, adaptation',
        'Visibility, review, improvement',
      ],
      correctIndex: 0,
      explanation:
        'The Scrum events work because they implement the empirical pillars of transparency, inspection, and adaptation. Commitment is a Scrum value, and planning is not a pillar.',
    },
    {
      question:
        'Which two statements describe how the three pillars of Scrum depend on each other? Select two.',
      options: [
        'Adaptation enables transparency',
        'Transparency enables inspection',
        'Inspection performed diligently makes transparency unnecessary',
        'Inspection enables adaptation',
      ],
      correctIndexes: [1, 3],
      explanation:
        'The Guide says transparency enables inspection, and inspection enables adaptation. Inspection without transparency is misleading and wasteful, so it cannot replace it.',
    },
    {
      question:
        'A Scrum Team inspects its work diligently at every event but never changes its product or process in response. What does the Scrum Guide say about this?',
      options: [
        'It is acceptable as long as the team is self-managing',
        'It is misleading and wasteful',
        'It is a sign of a mature team that has found a stable process',
        'It is pointless, because Scrum events are designed to provoke change',
      ],
      correctIndex: 3,
      explanation:
        'The Guide states that inspection without adaptation is considered pointless, and that Scrum events are designed to provoke change. "Misleading and wasteful" is what the Guide says about inspection without transparency.',
    },
    {
      question: 'How many events does Scrum define, and how many artifacts?',
      options: [
        'Five events, including the Sprint, and three artifacts',
        'Four events and three artifacts',
        'Five events and five artifacts',
        'Four events and two artifacts',
      ],
      correctIndex: 0,
      explanation:
        'Scrum provides five events: the Sprint, which is a container for the four others (Sprint Planning, Daily Scrum, Sprint Review, Sprint Retrospective). It has three artifacts: Product Backlog, Sprint Backlog and Increment.',
    },
    {
      question:
        'During the Sprint, the Developers learn through inspection that their current approach will not achieve the Sprint Goal. According to the Scrum Guide, when should the Scrum Team adapt?',
      options: [
        'At the next Sprint Retrospective, so the adaptation is discussed by the whole team first',
        'At the Sprint Review, after stakeholders have approved the change',
        'As soon as possible, the moment it learns something new, to minimize further deviation',
        'After the Scrum Master has approved the new approach',
      ],
      correctIndex: 2,
      explanation:
        'The Guide says adjustments must be made as soon as possible to minimize further deviation, and that a Scrum Team is expected to adapt the moment it learns anything new. Waiting for an event or for approval from someone else delays adaptation.',
    },
    {
      question:
        'According to the Scrum Guide, adaptation becomes more difficult when:',
      options: [
        'Sprints are shorter than one month',
        'Stakeholders attend the Sprint Review',
        'The Product Owner is also a member of the Scrum Team',
        'The people involved are not empowered or self-managing',
      ],
      correctIndex: 3,
      explanation:
        'The Guide says adaptation becomes more difficult when the people involved are not empowered or self-managing. Shorter Sprints actually create more learning cycles.',
    },
    {
      question:
        'The Scrum Guide uses the word "developers" for the people doing the work. How does the Guide explain this choice?',
      options: [
        'Scrum may only be used for software development',
        'Only people who write code can be part of the Developers',
        'The word is meant to simplify, not to exclude: researchers, analysts, scientists and other specialists are included',
        'Non-software specialists must form a separate team working alongside the Developers',
      ],
      correctIndex: 2,
      explanation:
        'The Guide notes that Scrum is used in many domains of complex work and uses "developers" not to exclude but to simplify. If you get value from Scrum, consider yourself included.',
    },
    {
      question:
        'How does the Scrum Guide describe the relationship between Scrum and existing practices, techniques and methods?',
      options: [
        'Scrum prescribes the exact techniques that must be used within each event',
        'Existing practices must be fully retired before Scrum can be adopted',
        'Scrum is incomplete on its own and must be combined with a traditional project management method',
        'Various practices can be employed within the framework; Scrum wraps around existing practices or renders them unnecessary',
      ],
      correctIndex: 3,
      explanation:
        'The Guide says various processes, techniques and methods can be employed within the framework, and that Scrum wraps around existing practices or renders them unnecessary. It also makes visible how effective the current practices are.',
    },
  ],
}

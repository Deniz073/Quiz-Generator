import type { Chapter } from '../types'

export const chapter08: Chapter = {
  id: '8-increment-and-done',
  number: 8,
  title: 'Increment, Definition of Done & End Note',
  questions: [
    {
      question: 'How does the Scrum Guide define an Increment?',
      options: [
        'The list of Product Backlog items the Developers selected for the Sprint',
        'A concrete stepping stone toward the Product Goal',
        'The final release of the product at the end of the Product Goal',
        'The report on the work completed, presented at the Sprint Review',
      ],
      correctIndex: 1,
      explanation:
        'An Increment is a concrete stepping stone toward the Product Goal. It is a usable piece of the product, not a plan, a report or only the final release.',
    },
    {
      question:
        'Which two statements about every Increment are supported by the Scrum Guide? Select two.',
      options: [
        'It is additive to all prior Increments',
        'It is independent of earlier Increments so that it can be delivered alone',
        'It is thoroughly verified, ensuring that all Increments work together',
        'It is verified by the stakeholders at the Sprint Review before it counts as an Increment',
      ],
      correctIndexes: [0, 2],
      explanation:
        'Each Increment is additive to all prior Increments and thoroughly verified, ensuring that all Increments work together. Work counts as part of an Increment when it meets the Definition of Done, not when stakeholders sign it off.',
    },
    {
      question:
        'According to the Scrum Guide, what must an Increment be in order to provide value?',
      options: [
        'Approved by the Product Owner at the Sprint Review',
        'Fully documented',
        'Larger than the previous Increment',
        'Usable',
      ],
      correctIndex: 3,
      explanation:
        'In order to provide value, the Increment must be usable. The Guide names no approval step, documentation rule or size requirement.',
    },
    {
      question: 'How many Increments may be created within one Sprint?',
      options: [
        'Exactly one, at the end of the Sprint',
        'Multiple Increments may be created',
        'One per week of the Sprint',
        'One, created at the Sprint Review once the stakeholders agree',
      ],
      correctIndex: 1,
      explanation:
        'Multiple Increments may be created within a Sprint, and their sum is presented at the Sprint Review. Each is born when a Product Backlog item meets the Definition of Done.',
    },
    {
      question:
        'On day six of a ten-day Sprint, the Developers complete a Product Backlog item that meets the Definition of Done. The Product Owner wants it released now, but the Scrum Master says it must wait for the Sprint Review. What does the Scrum Guide say?',
      options: [
        'The Scrum Master is right, because the Sprint Review approves releases',
        'The Product Owner may release only if all Sprint Backlog items are Done',
        'The stakeholders must agree to an early release in a separate meeting',
        'It may be released now; the Sprint Review is not a gate to releasing value',
      ],
      correctIndex: 3,
      explanation:
        'The Guide states that an Increment may be delivered prior to the end of the Sprint and that the Sprint Review should never be considered a gate to releasing value. The Review is for inspection and adaptation, not for approval.',
    },
    {
      question:
        'At what moment is an Increment born, according to the Scrum Guide?',
      options: [
        'When the Developers start working on a Product Backlog item',
        'When the Product Owner accepts the work at the Sprint Review',
        'The moment a Product Backlog item meets the Definition of Done',
        'At the end of the Sprint, when the Sprint Backlog is complete',
      ],
      correctIndex: 2,
      explanation:
        'The moment a Product Backlog item meets the Definition of Done, an Increment is born. It does not depend on the Sprint ending or on a Review acceptance.',
    },
    {
      question: 'What is the Definition of Done?',
      options: [
        'A list of acceptance criteria written by the Product Owner for each Product Backlog item',
        'A formal description of the state of the Increment when it meets the quality measures required for the product',
        'A checklist the Scrum Master uses to approve the Sprint',
        'The date by which the Sprint Backlog must be completed',
      ],
      correctIndex: 1,
      explanation:
        'The Definition of Done is a formal description of the state of the Increment when it meets the quality measures required for the product. It gives everyone a shared understanding of what work was completed as part of the Increment.',
    },
    {
      question:
        'At the end of the Sprint, one Product Backlog item does not meet the Definition of Done. Which two statements are supported by the Scrum Guide? Select two.',
      options: [
        'It cannot be released or even presented at the Sprint Review',
        'It is presented at the Sprint Review as almost done, so that stakeholders can give feedback',
        'It returns to the Product Backlog for future consideration',
        'It is carried over automatically into the next Sprint Backlog',
      ],
      correctIndexes: [0, 2],
      explanation:
        'An item that does not meet the Definition of Done cannot be released or even presented at the Sprint Review, and it returns to the Product Backlog for future consideration. It is neither shown as almost done nor carried over automatically.',
    },
    {
      question:
        'The organization has a quality standard that is part of the Definition of Done for the product. A Scrum Team prefers a less strict Definition of Done. What does the Scrum Guide say?',
      options: [
        'The Scrum Team may replace it if the Product Owner agrees',
        'All Scrum Teams must follow the organizational standard as a minimum',
        'The Developers decide, since they are accountable for quality',
        'The standard is only a recommendation',
      ],
      correctIndex: 1,
      explanation:
        'If the Definition of Done is part of the standards of the organization, all Scrum Teams must follow it as a minimum. A team may be stricter than the standard, but not weaker.',
    },
    {
      question:
        'The organization has no standard that applies to the Definition of Done for a product. What does the Scrum Guide say?',
      options: [
        'The Scrum Master defines it for the Scrum Team',
        'The Scrum Team can work without one until problems occur',
        'The stakeholders must provide one before the first Sprint',
        'The Scrum Team must create a Definition of Done appropriate for the product',
      ],
      correctIndex: 3,
      explanation:
        'If the Definition of Done is not an organizational standard, the Scrum Team must create one appropriate for the product. Without it, transparency about what Done means would be lost.',
    },
    {
      question:
        'Three Scrum Teams work together on the same product. What does the Scrum Guide say about their Definition of Done?',
      options: [
        'Each team defines its own, as they are self-managing',
        'The Product Owners of the teams choose the weakest one to keep integration simple',
        'They must mutually define and comply with the same Definition of Done',
        'Only the team with the most Developers needs one',
      ],
      correctIndex: 2,
      explanation:
        'If multiple Scrum Teams work together on a product, they must mutually define and comply with the same Definition of Done. Self-management does not allow each team to define Done differently for one product.',
    },
    {
      question:
        'Who is required to conform to the Definition of Done, according to the Scrum Guide?',
      options: [
        'The Developers',
        'Only the Scrum Master',
        'The stakeholders attending the Sprint Review',
        'Only the Product Owner',
      ],
      correctIndex: 0,
      explanation:
        'The Developers are required to conform to the Definition of Done, as they are accountable for instilling quality by adhering to it. It is the commitment of the Increment.',
    },
    {
      question:
        'Which two statements are made in the End Note of the Scrum Guide? Select two.',
      options: [
        'The Scrum framework is immutable',
        'Teams may remove events they find unnecessary and still call the result Scrum',
        'Implementing only parts of Scrum is possible, but the result is not Scrum',
        'Scrum must not be combined with other techniques or practices',
      ],
      correctIndexes: [0, 2],
      explanation:
        'The framework is immutable, and implementing only parts of it is possible, but the result is not Scrum. Scrum exists only in its entirety, yet it functions well as a container for other techniques.',
    },
    {
      question:
        'How does the Scrum Guide describe the relationship between Scrum and other techniques, methodologies and practices?',
      options: [
        'Scrum functions well as a container for them',
        'Scrum replaces all of them',
        'They must be approved by the Scrum Master before use',
        'They are prohibited by the rules of Scrum',
      ],
      correctIndex: 0,
      explanation:
        'Scrum exists only in its entirety and functions well as a container for other techniques, methodologies and practices. The framework itself stays unchanged, while practices inside it can vary.',
    },
  ],
}

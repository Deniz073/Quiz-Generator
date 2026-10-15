import type { Chapter } from '../types'

export const chapter08: Chapter = {
  id: '8-forecasting-and-release',
  number: 8,
  title: 'Forecasting & release planning',
  questions: [
    {
      id: '8-01',
      question:
        'A stakeholder asks the Product Owner for a fixed date and fixed scope for the next six months. Which response is best aligned with Scrum?',
      options: [
        'Promise the date and scope and ask the Developers to commit to it',
        'Decline to give any information, since Scrum does not allow planning',
        'Share a forecast based on empirical data such as past Sprints, be transparent about the uncertainty and update it every Sprint',
        'Use a fixed Sprint count to give an exact date, scope can be negotiated later',
      ],
      correctIndex: 2,
      explanation:
        'In a complex environment, only what has already happened may be used for forward-looking decisions. A forecast extrapolates from past data, is not a commitment and is revisited each Sprint.',
    },
    {
      id: '8-02',
      question:
        'Why is a burn-up chart often preferred over a burn-down chart for release forecasting?',
      options: [
        'It shows the total scope and its changes separately from the work completed, so added scope is visible',
        'It automatically calculates the exact release date',
        'It is required by the Scrum Guide for the Sprint Review',
        'It hides scope changes, so that stakeholders stay calm',
      ],
      correctIndex: 0,
      explanation:
        'A burn-up shows both the work completed and the total scope, so scope changes are visible. A burn-down can hide added work. Neither is required by the Guide, which only names burn-downs, burn-ups and cumulative flows as useful but not a replacement for empiricism.',
    },
    {
      id: '8-03',
      question:
        'What does the Scrum Guide say about forecasting practices such as burn-downs, burn-ups or cumulative flows?',
      options: [
        'They are mandatory and must be shown at each Sprint Review',
        'They are proven useful but do not replace the importance of empiricism',
        'They are forbidden, because they give a false sense of certainty',
        'They may only be used by the Product Owner',
      ],
      correctIndex: 1,
      explanation:
        'The Guide states that various practices exist to forecast progress. While proven useful, these do not replace the importance of empiricism.',
    },
    {
      id: '8-04',
      question:
        'A team has five items that are 90% finished and not Done. What do they contribute to the Done work that is used for forecasting, e.g. velocity?',
      options: [
        '90% of their size',
        'Half of their size, because the testing is still outstanding',
        'Nothing; only work that meets the Definition of Done counts',
        'Their full size, because the work has been performed',
      ],
      correctIndex: 2,
      explanation:
        'Only work that meets the Definition of Done is part of an Increment and counts as progress. Partially done work provides no value and no reliable data for forecasting.',
    },
    {
      id: '8-05',
      question:
        'Management wants to use the velocity of teams to compare their performance and to set targets. What is the best response?',
      options: [
        'Agree, because it makes the teams more productive',
        'Agree, if the velocity is normalized with story point conversion tables',
        'Use it as a target for individual Developers instead of teams',
        "Explain that velocity is a team's own empirical trend for forecasting, not a performance target, and not comparable across teams",
      ],
      correctIndex: 3,
      explanation:
        'Velocity is not part of the Scrum Guide. If used, it is a trend for forecasting by the team itself; using it as a target or to compare teams invites gaming and destroys its usefulness as data.',
    },
    {
      id: '8-06',
      question: 'Who decides whether and when to release an Increment?',
      options: [
        'The Scrum Master, once the Sprint Retrospective is finished',
        'The stakeholders, at the Sprint Review',
        'A change advisory board outside the Scrum Team',
        'The Product Owner, who is accountable for maximizing the value of the product',
      ],
      correctIndex: 3,
      explanation:
        'In Scrum.org teaching the Product Owner decides about releases as part of maximizing value. Increments meeting the Definition of Done can be released at any time; the Sprint Review is not a gate.',
    },
    {
      id: '8-07',
      question:
        'The Developers propose a "hardening Sprint" at the end of each release for testing and stabilization. What is the best response?',
      options: [
        'Accept; it is the only way to keep releases safe',
        'Accept, but only if the Product Owner approves the extra Sprint',
        'Explain that every Increment must meet the Definition of Done, so work such as testing belongs in each Sprint and may be added to the Definition of Done',
        'Replace the Sprint Retrospective with the hardening Sprint',
      ],
      correctIndex: 2,
      explanation:
        'The Increment must be usable and meet the Definition of Done every Sprint. Deferring work into a separate hardening or release Sprint accumulates undone work and reduces transparency.',
    },
    {
      id: '8-08',
      question:
        'What is the effect of accumulating undone work, i.e. work that does not meet the Definition of Done?',
      options: [
        'It reduces transparency and leads to unrealistic expectations',
        'It increases the velocity of the team',
        'It has no effect as long as the Product Owner knows about it',
        'It makes the Sprint Goal easier to achieve',
      ],
      correctIndex: 0,
      explanation:
        'Undone work reduces transparency; the real state of the product becomes unclear, and forecasts and release decisions rest on a false picture.',
    },
    {
      id: '8-09',
      question: 'Why does the Scrum Guide limit a Sprint to one month or less?',
      options: [
        'Because stakeholders cannot wait longer than a month for results',
        'Because a long horizon may invalidate the Sprint Goal, raise complexity and risk, while Sprints ensure inspection and adaptation at least every calendar month',
        'Because the Scrum Master needs a monthly cadence for reporting',
        'Because Developers need to be moved to other projects each month',
      ],
      correctIndex: 1,
      explanation:
        "When a Sprint's horizon is too long, the Sprint Goal may become invalid, complexity may rise and risk may increase. Shorter Sprints generate more learning cycles and limit risk.",
    },
    {
      id: '8-10',
      question:
        'Which three things, when better known to the Developers, increase their confidence in their Sprint forecasts? Select three.',
      options: [
        'Their past performance',
        'Their upcoming capacity',
        'Their Definition of Done',
        "The stakeholders' preferred release date",
        "The Product Owner's own estimate of the effort",
      ],
      correctIndexes: [0, 1, 2],
      explanation:
        'The Guide says the more the Developers know about their past performance, their upcoming capacity and their Definition of Done, the more confident they will be in their Sprint forecasts.',
    },
    {
      id: '8-11',
      question:
        'The release date is fixed and new, valuable work is discovered. Which two options are available to the Product Owner that fit Scrum? Select two.',
      options: [
        'Reorder the Product Backlog and drop lower-value items, so that the most valuable work is done by the date',
        'Release a smaller Increment earlier and continue with later releases',
        'Ask the Developers to skip testing for the new items',
        'Ask the Developers to work unpaid overtime until all work is done',
      ],
      correctIndexes: [0, 1],
      explanation:
        'The Product Owner maximizes value through ordering and release decisions. Quality (the Definition of Done) must not decrease and sustainable pace is protected, so cutting quality or overtime are not options.',
    },
  ],
}

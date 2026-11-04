# Quiz Generator

A site for practising certification-style multiple-choice quizzes, by chapter or as a timed mock exam. Visitors can use the built-in quizzes; signed-in users also keep their progress and can own quizzes of their own.

## Quizzes and content

**Quiz**:
A named set of chapters with questions, about one subject or certification (e.g. PSPO 1).
_Avoid_: Test, course

**Built-in quiz**:
A quiz without an owner, available to everyone, signed in or not.
_Avoid_: System quiz, public quiz, default quiz

**Personal quiz**:
A quiz owned by one user and visible only to them.
_Avoid_: Private quiz, custom quiz, user quiz

**Owner**:
The user a personal quiz belongs to. Built-in quizzes have none.

**Chapter**:
A numbered, titled group of questions within a quiz.
_Avoid_: Section, module, topic

**Question**:
A prompt with between two and six options, of which one or more are correct.

**Single-answer question**:
A question with exactly one correct option.

**Multiple-answer question**:
A question with two or more correct options (but not all); answered right only when exactly those options are picked.
_Avoid_: Multi-select, checkbox question

**Option**:
One of the answers offered for a question; either correct or not.
_Avoid_: Choice, answer (for the offered text)

**Explanation**:
The text shown after answering, saying why the correct options are correct.

**Seed quiz**:
A quiz whose content is maintained in the repository and loaded into the database by the seed, either as a built-in quiz or as a personal quiz of the seed owner.

**Seed owner**:
The user that personal seed quizzes are given to, identified by configuration rather than in the repository.

## Ways to use a quiz

**Study**:
Browsing a quiz's questions with their answers and explanations, without being scored.

**Chapter run**:
Answering every question of one chapter with feedback after each; the only practice that produces an attempt.

**Practice**:
Answering questions from the whole quiz (or the flagged ones) with feedback after each; not recorded.

**Mock exam**:
A timed run of randomly drawn questions from the whole quiz, without feedback until it is submitted, scored against a pass mark.
_Avoid_: Exam (alone), test

**Exam settings**:
The question count, time limit and pass mark of a mock exam. A quiz defines the defaults; a user may override any of them for themselves.

## Progress

**Visitor**:
Someone using the site without being signed in. Visitors can use built-in quizzes, but nothing they do is kept.
_Avoid_: Guest, anonymous user

**Attempt**:
One finished chapter run or mock exam by a user, with its score out of its total.
_Avoid_: Result (for a single run), score

**Best result**:
A user's attempt with the highest percentage for a chapter or the mock exam; ties go to the newer one.

**Last result**:
A user's most recent attempt for a chapter or the mock exam.

**Flag**:
A user's mark on a question to come back to it later; flagged questions can be practised on their own.
_Avoid_: Bookmark, star

**Unfinished exam**:
A user's started, not yet submitted mock exam, which can be resumed until its time runs out. At most one per user per quiz.
_Avoid_: Exam session (in conversation), draft

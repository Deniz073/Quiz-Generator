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
A quiz owned by one user. Only they can use it; while it is published, anyone can also preview it on the Marketplace.
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
A built-in quiz whose content is maintained in the repository and loaded into the database by the seed. Personal quizzes are never seed quizzes.

## Marketplace

**Marketplace**:
The page listing every published quiz, where anyone can preview one and signed-in users can import it.
_Avoid_: Store, library, catalogue

**Publish**:
An owner making one of their personal quizzes available on the Marketplace. Built-in quizzes are never published; they are already available to everyone.
_Avoid_: Share (reserved for giving a quiz to one specific person)

**Unpublish**:
An owner taking their published quiz off the Marketplace. Copies already imported are unaffected.

**Published quiz**:
A personal quiz that is currently on the Marketplace.
_Avoid_: Shared quiz, public quiz

**Publisher**:
The owner of a published quiz, shown by name on its listing.

**Preview**:
Studying a published quiz on the Marketplace without importing it.

**Import**:
A signed-in user taking a copy of a published quiz as a personal quiz of their own. The copy is a snapshot: later changes to the published quiz do not reach it.
_Avoid_: Subscribe, clone, download

**Imported quiz**:
A personal quiz made by importing a published quiz; it remembers which published quiz it was copied from, while that still exists. A user has at most one imported quiz per published quiz.
_Avoid_: Copy (in the UI), fork

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
Someone using the site without being signed in. Visitors can use built-in quizzes and browse the Marketplace, but nothing they do is kept.
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

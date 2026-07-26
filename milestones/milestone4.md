# Milestone 4

This document should be completed and submitted during **Unit 8** of this course. You **must** check off all completed tasks in this document in order to receive credit for your work.

## Checklist

This unit, be sure to complete all tasks listed below. To complete a task, place an `x` between the brackets.

- [ ] Update the completion percentage of each GitHub Milestone. The milestone for this unit (Milestone 4 - Unit 8) should be 100% completed when you submit for full points.
- [ ] In `readme.md`, check off the features you have completed in this unit by adding a ✅ emoji in front of the feature's name.
  - [ ] Under each feature you have completed, include a GIF showing feature functionality.
- [X] In this document, complete all five questions in the **Reflection** section below.

## Reflection

### 1. What went well during this unit?

Teamwork was a big highlight this unit — our group calls kept everyone aligned and made it easy to divide up work without stepping on each other's changes. Having our issues clearly organized on GitHub also helped a lot, since it gave each of us a clear scope to work from and made it easier to track what was done versus what still needed attention.

### 2. What were some challenges your group faced in this unit?

We ran into some git setup confusion early on (a stray, disconnected local repo that wasn't actually tracking our GitHub remote), which took some troubleshooting to sort out before we could push cleanly. We also discovered a few gaps between issues as originally scoped and the actual state of the code — for example, issue #29's foreign key constraint turned out to need more care than expected because of how our reset.js script only conditionally recreates tables, and issue #35 (Profile page) needed to be reframed once we realized the Profile component and route already existed but were built entirely around a disconnected, fake localStorage auth system instead of the real backend.

### Did you finish all of your tasks in your sprint plan for this week? If you did not finish all of the planned tasks, how would you prioritize the remaining tasks on your list?

We finished some of our planned tasks this sprint, including password hashing, the login endpoint, and wiring the Login and Create Account forms to the real backend (issues #33 and #34), both tested end-to-end and pushed to main. As a team, though, we didn't close out all of Milestone 4 — more than half issues are done.

For prioritizing what's left, we'd focus on:

Issue #29 (foreign key on stories.creator_id) first, since it's already partially planned out and just needs to be finished.
Issue #35 (Profile page) next, since a teammate is currently blocked by it — the profile page throws an error when trying to save changes, because it's still built around old, disconnected fake login data instead of our real backend.
The remaining open issues after that, which we'd reassess together to decide what's essential for the next milestone versus what can be pushed to a later one.

### Which features and user stories would you consider “at risk”? How will you change your plan if those items remain “at risk”?

The StoryReader.jsx merge — a teammate's in-progress pull request is expected to conflict with existing changes to that file, and if it's not resolved soon it could block other work that touches the story reader.
Issue #35 (Profile page) — the existing Profile component still relies on fake, disconnected localStorage data instead of the real backend, and some of its fields (like favorite genre and bio) don't exist in our database at all yet, so this needs a scoping decision before work can move forward cleanly.

### 5. What additional support will you need in upcoming units as you continue to work on your final project?

We'd benefit from having more issues broken out and organized on GitHub going forward, since it helped us stay clear on scope this unit. We'd also like to keep up (or increase) our group call cadence, since that's been a big part of what's kept us coordinated and moving efficiently.

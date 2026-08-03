# Milestone 5

This document should be completed and submitted during **Unit 9** of this course. You **must** check off all completed tasks in this document in order to receive credit for your work.

## Checklist

This unit, be sure to complete all tasks listed below. To complete a task, place an `x` between the brackets.

- [X] Deploy your project on Render
  - [X] In `readme.md`, add the link to your deployed project
- [X] Update the status of issues in your project board as you complete them
- [X] In `readme.md`, check off the features you have completed in this unit by adding a ✅ emoji in front of their title
  - [X] Under each feature you have completed, **include a GIF** showing feature functionality
- [X] In this document, complete the **Reflection** section below
- [X] 🚩🚩🚩**Complete the Final Project Feature Checklist section below**, detailing each feature you completed in the project (ONLY include features you implemented, not features you planned)
- [ ] 🚩🚩🚩**Record a GIF showing a complete run-through of your app** that displays all the components included in the **Final Project Feature Checklist** below
  - [ ] Include this GIF in the **Final Demo GIF** section below

## Final Project Feature Checklist

Complete the checklist below detailing each baseline, custom, and stretch feature you completed in your project. This checklist will help graders look for each feature in the GIF you submit.

### Baseline Features

👉🏾👉🏾👉🏾 Check off each completed feature below.

- [X] The project includes an Express backend app and a React frontend app
- [X] The project includes these backend-specific features:
  - [X] At least one of each of the following database relationships in Postgres
    - [X] one-to-many
    - [X] many-to-many with a join table
  - [x] A well-designed RESTful API that:
    - [x] supports all four main request types for a single entity (ex. tasks in a to-do list app): GET, POST, PATCH, and DELETE
      - [X] the user can **view** items, such as tasks
      - [X] the user can **create** a new item, such as a task
      - [X] the user can **update** an existing item by changing some or all of its values, such as changing the title of task
      - [X] the user can **delete** an existing item, such as a task
    - [X] Routes follow proper naming conventions
  - [X] The web app includes the ability to reset the database to its default state
- [x] The project includes these frontend-specific features:
  - [X] At least one redirection, where users are able to navigate to a new page with a new URL within the app
  - [X] At least one interaction that the user can initiate and complete on the same page without navigating to a new page
  - [X] Dynamic frontend routes created with React Router
  - [X] Hierarchically designed React components
    - [X] Components broken down into categories, including Page and Component types
    - [X] Corresponding container components and presenter components as appropriate
- [X] The project includes dynamic routes for both frontend and backend apps
- [X] The project is deployed on Render with all pages and features that are visible to the user are working as intended

### Custom Features

👉🏾👉🏾👉🏾 Check off each completed feature below.

- [X] The project gracefully handles errors
- [X] The project includes a one-to-one database relationship
- [X] The project includes a slide-out pane or modal as appropriate for your use case that pops up and covers the page content without navigating away from the current page
- [X] The project includes a unique field within the join table
- [X] The project includes a custom non-RESTful route with corresponding controller actions
- [X] The user can filter or sort items based on particular criteria as appropriate for your use case
- [X] Data is automatically generated in response to a certain event or user action. Examples include generating a default inventory for a new user starting a game or creating a starter set of tasks for a user creating a new task app account
- [X] Data submitted via a POST or PATCH request is validated before the database is updated (e.g. validating that an event is in the future before allowing a new event to be created)
  - [X] *To receive full credit, please be sure to demonstrate in your walkthrough that for certain inputs, the item will NOT be successfully created or updated.*

### Stretch Features

👉🏾👉🏾👉🏾 Check off each completed feature below.

- [X] A subset of pages require the user to log in before accessing the content
  - [ ] Users can log in and log out via GitHub OAuth with Passport.js
- [X] Restrict available user options dynamically, such as restricting available purchases based on a user's currency
- [X] Show a spinner while a page or page element is loading
- [X] Disable buttons and inputs during the form submission process
- [X] Disable buttons after they have been clicked
  - *At least 75% of buttons in your app must exhibit this behavior to receive full credit*
- [X] Users can upload images to the app and have them be stored on a cloud service
  - *A user profile picture does **NOT** count for this rubric item **only if** the app also includes "Login via GitHub" functionality.*
  - *Adding a photo via a URL does **NOT** count for this rubric item (for example, if the user provides a URL with an image to attach it to the post).*
  - *Selecting a photo from a list of provided photos does **NOT** count for this rubric item.*
- [X] 🍞 [Toast messages](https://www.patternfly.org/v3/pattern-library/communication/toast-notifications/index.html) deliver simple feedback in response to user events

## Final Demo GIF

🔗 [Here's a GIF walkthrough of the final project](👉🏾👉🏾👉🏾 your link here)

## Reflection

### 1. What went well during this unit?

Teamwork was a real strength this unit. We stayed connected through regular, for example Slack calls, which made it much easier to divide up work, catch each other up on progress, and troubleshoot issues together in real time instead of getting stuck alone. Being able to quickly loop a teammate in whether to flag a bug, coordinate before touching shared resources like our database, or just talk through an approach, kept the project moving forward even when individual pieces got complicated.

### 2. What were some challenges your group faced in this unit?

One of the biggest challenges was dealing with git merge conflicts, especially around our database connection settings — a fix I made kept getting accidentally reverted every time we merged, which took a few rounds to actually track down and understand why. We also ran into some tricky database issues, like our ID sequences getting out of sync after seeding, which caused confusing "duplicate key" errors that weren't obvious at first. Since we're all working off the same shared database, we had to be extra careful about running things like a full database reset, since it could wipe out another teammate's work in progress. Debugging felt like detective work a lot of the time — errors in the browser often didn't tell the real story, and we'd have to dig into the actual server logs to find what was really going on underneath.

### 3. What were some of the highlights or achievements that you are most proud of in this project?

We are really proud of how much debugging we pushed through this unit. We found and fixed several real bugs that could've easily slipped through unnoticed, like the story creator not setting a starting passage, which 
made new stories completely unplayable, and a security gap where our users API had no authentication at all. Building the auto-generated reading progress feature was a highlight too, since it wasn't just about writing new code but actually understanding why the data model was set up the way it was and connecting it properly. Beyond the code itself, We are very happy of how methodically we worked through our checklist, testing each feature for real instead of just assuming it worked, which caught several issues we wouldn't have found otherwise.

### 4. Reflecting on your web development journey so far, how have you grown since the beginning of the course?

Looking back at where we started this course, we've grown a lot in how we actually approach debugging. Early on, an error message would feel like a dead end and now we know to check the server terminal, use tools like Thunder Client or DBeaver to test things directly, and trace a bug back to its actual root cause instead of just patching the symptom. We've also gotten a lot more comfortable with git. For example resolving conflicts, 
being careful about what we push, and coordinating with teammates before touching shared resources like our database. Concepts that felt abstract at the beginning, like authentication, request/response cycles, and how 
the frontend and backend actually talk to each other, feel much more concrete now that we've had to troubleshoot them for real.

### 5. Looking ahead, what are your goals related to web development, and what steps do you plan to take to achieve them?

Looking ahead, we want to keep building on the debugging and collaboration skills we developed this unit, especially around writing more secure, well-tested code from the start rather than catching issues after the fact. Some concrete next steps: finishing the remaining security and permissions work on this project (like properly scoping what regular users vs. admins can do), and getting more comfortable with authentication patterns like OAuth. Beyond this course, we're interested in deepening our skills with full-stack projects, understanding not just how to build a feature, but how to build it in a way that scales and stays maintainable as a codebase grows and more people work on it together.

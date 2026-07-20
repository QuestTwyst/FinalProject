# QuestTwyst  

CodePath WEB103 Final Project

Designed and developed by: Elizabeth Kilroy, Mymuna Murshed, Johanna Devilme, Gaby Yanes, Jerry Rogers Jr

🔗 Link to deployed app:

## About
This web app is a full-stack application, meaning our team will develop both the user-facing interface and the systems that operate behind the scenes. The front end will use React, JavaScript, HTML, CSS, React Router, and Vite to create the story pages, choice-based navigation, user profiles, and other interactive features. The back end will use Node.js and Express.js to process user requests, manage application logic, and communicate with a PostgreSQL database. The database will store information such as user accounts, stories, passages, choices, genres, and reading progress. We will also build a RESTful API to support communication between the front end and back end and deploy the completed application using Render.

### Description and Purpose

QuestTwyst is an interactive web app where readers experience stories one passage at a time. At the end of each passage, readers choose between two options, and each choice leads to a different part of the story. Because every decision changes the path, readers can experience multiple storylines and endings. Users can also create and publish their own branching stories in genres like fantasy, mystery, sci-fi, comedy, or horror.

### Inspiration

We wanted to take the choose-your-own-adventure format traditionally found in printed and e-books and reimagine it as a fully interactive website experience. Traditional books only offer one path and one ending, but QuestTwyst brings that branching story format online, letting readers actively influence how each story unfolds in real time. Readers can dive into pre-made stories curated for the platform, or explore custom stories written and published by other users, giving both readers and writers a creative space to build and share branching narratives.

## Tech Stack

Frontend:
    JavaScript
    HTML
    CSS
    React Router

Backend:
    Node.js
    Express.js
    Restful API 
    PostgreSQL
    Render (at this time)



## Features

### ✅ New Account Create and Login

The frontend provides dedicated Login and Create Account pages, letting users register a new account or sign in with existing credentials. Form validation ensures all required fields are completed before submission, and clear error messages guide users when something needs correction

<img src='https://github.com/QuestTwyst/FinalProject/blob/e5d47216b54c08de2b37c4f11c00f2739cf3c4f1/AuthCreateAccountAndLogin.gif' title='Video Walkthrough' width='' alt='Video Walkthrough' />


### ✅ Story Library API

The frontend will display all available stories as browsable cards showing a title, genre, and short description. Readers can filter the library by genre using a dropdown menu, and clicking a story card opens it directly in the Story Reader Interface.

<<<<<<< HEAD
✅ For example, exploring the site as a whole, Romance genre selection and branching story
=======
 For example, exploring the site as a whole, Romance genre selection and branching story
>>>>>>> 23a26f517eaec8432ad0281beebc679a63b531f8

![Romance feature demo](planning/gifs/QuestTwyst_websire_milestone3.gif)

The backend will include Express routes that allow the app to retrieve available stories from the database. Readers will be able to view a list of stories and open a specific story by ID, but story creation will be handled through seeded/admin-managed data instead of regular user submissions.
<<<<<<< HEAD



=======
>>>>>>> 23a26f517eaec8432ad0281beebc679a63b531f8


### ✅ Branching Passage and Choice Interface
The frontend displays one story passage at a time along with two choice buttons. Selecting a choice instantly loads the next passage based on that decision, letting the reader's path through the story unfold in real time.

<img src='https://github.com/QuestTwyst/FinalProject/blob/c9538aafbe76426befcc29f6b6f0f32cdb2b4632/planning/gifs/BranchingPnCapi.gif' title='Video Walkthrough' width='' alt='Video Walkthrough' />

### ✅ Genre Filtering UI
The frontend lets readers browse genres through a scrollable list and select one to instantly filter the story library, showing only stories that match that genre.

<img src='https://github.com/QuestTwyst/FinalProject/blob/45f62c340dc8d0fb26d2d27db73032c58a78401c/planning/gifs/GenreFilterOption.gif' title='Video Walkthrough' width='' alt='Video Walkthrough' />



### User Reading Progress

The frontend will let signed-in readers pick up exactly where they left off in a story, showing a "Continue Reading" option on their profile or the library page instead of restarting from the beginning.

[gif goes here] (COMING SOON)

The backend will track a reader’s current location within a story. This allows users to leave a story and later return to the passage where they stopped reading.

[gif goes here]

### Story Path History

After a reader finishes a story, the frontend will display a visual recap of the choices they made along the way, letting them see the full path they took and easily restart to try a different route.
[gif goes here] (COMING SOON)

The backend will save the choices a reader makes while moving through a story. This allows the app to show the path the reader took and makes it possible for users to replay the same story using different choices.

[gif goes here] 

### Admin Story Management
The backend will support admin-managed story content. Admins or developers will be able to add, update, or delete stories, passages, choices, and genres while readers focus on reading and choosing story paths.

[gif goes here] (COMING SOON)


### [ADDITIONAL FEATURES GO HERE - ADD ALL FEATURES HERE IN THE FORMAT ABOVE; you will check these off and add gifs as you complete them]

### ✅ Story Reader Interface
The frontend will display one passage at a time along with two clickable choice buttons (Option A and Option B). Selecting a choice loads the next passage instantly without navigating to a new page, letting readers move through the story in a smooth, uninterrupted way. 

Story metadata header showing title, genre, author, and description at the top of the reader

![Story Reader Interface demo](planning/gifs/QuestTwyst_Story-Reader-Interface.gif)

### Story Creator Interface
The frontend will provide a form-based editor where users can write a story title, add passages, and fill in the two choices that branch off each passage. Validation will prevent saving a passage until the title and both choices are filled in, and users can mark any passage as an ending.
[gif goes here] (COMING SOON)


## Installation Instructions

At this time website will be deployed through Render. 

# Entity Relationship Diagram
Reference the Creating an Entity Relationship Diagram final project guide in the course portal for more information about how to complete this deliverable.


## Create the List of Tables
- users
- stories
- genres
- story_genres (join table)
- passages
- choices
- reading_progress
- path_history


## Add the Entity Relationship Diagram

![Entity Relationship Diagram](entity_relationship_diagram.png)

### users
| Column Name | Type | Description |
|-------------|------|-------------|
| id | integer | primary key |
| name | text | user's display name |
| email | text | user's email, unique |
| password_hash | text | hashed password for login |
| created_at | timestamp | account creation date |

### stories
| Column Name | Type | Description |
|-------------|------|-------------|
| id | integer | primary key |
| title | text | title of the story |
| description | text | short summary of the story |
| creator_id | integer | foreign key → users.id (one-to-many: a user can create many stories) |
| created_at | timestamp | date story was created |

### genres
| Column Name | Type | Description |
|-------------|------|-------------|
| id | integer | primary key |
| name | text | genre name (e.g., mystery, sci-fi, comedy) |

### story_genres (join table — many-to-many)
| Column Name | Type | Description |
|-------------|------|-------------|
| id | integer | primary key |
| story_id | integer | foreign key → stories.id |
| genre_id | integer | foreign key → genres.id |

### passages
| Column Name | Type | Description |
|-------------|------|-------------|
| id | integer | primary key |
| story_id | integer | foreign key → stories.id (one-to-many: a story has many passages) |
| content | text | the passage text the reader sees |
| is_ending | boolean | true if this passage ends the story |

### choices
| Column Name | Type | Description |
|-------------|------|-------------|
| id | integer | primary key |
| passage_id | integer | foreign key → passages.id (one-to-many: a passage has two choices) |
| choice_text | text | label for the choice (e.g., "Ask the driver") |
| next_passage_id | integer | foreign key → passages.id (which passage this choice leads to) |

### reading_progress
| Column Name | Type | Description |
|-------------|------|-------------|
| id | integer | primary key |
| user_id | integer | foreign key → users.id |
| story_id | integer | foreign key → stories.id |
| current_passage_id | integer | foreign key → passages.id (where the reader left off) |

### path_history
| Column Name | Type | Description |
|-------------|------|-------------|
| id | integer | primary key |
| user_id | integer | foreign key → users.id |
| story_id | integer | foreign key → stories.id |
| passage_id | integer | foreign key → passages.id |
| choice_id | integer | foreign key → choices.id |
| timestamp | timestamp | when this choice was made |

### DIAGRAMS
<img src='https://github.com/Niama001/QuestTwyst/blob/4d71d274fc7c0c10a67b6b335c32d8c86de78d9a/planning/QuestTwyst_page-0001.jpg' width='' alt='Video Walkthrough' />


Users → Stories:
One-to-Many: one user can create many stories, but each story has only one creator. 
Example: 
user id=1, name=”Hailey” creates two stories like stories.id = 101 and stories.id = 102 (creater_id =1).

Stories ←→ Genres:
Many-to-Many: a story can have multiple genres, and a genre can apply multiple stories. 
Example: Story 101: "Obsession" is tagged as both psychological thriller and horror. Meaning story_genres has two rows:
story_id =101, genre_id =1(psychological thriller)
story_id =102, genre_id =2(horror)
On the other hand, genre 2(horror) might also apply to story 103 
story_id=103, genre_id=2

Stories → Passages:
One-to-Many:  one story contains many passages, each passage belongs to one story.
Example: Story 101 has passage 1,2,3,4 - all with story_id = 101.
Passage 2 can’t belong to two different stories at once. 

Passage → Choices:
One-to-Many:  one passage has multiple choices
Example: Passage 1(“which one would you like to drink”) has:
Choice 1: “Iced Tea” -> passage_id =1
Choice 2: “Coffee” -> passage_id =1
Both choices point back to passage 1 as their “owner”

Choices → Passage (“Destination” side):
One-to-Many:  one passage can be the destination of many choices, but each choice leads to only one next passage.
Example: 
Choice 1: (“Go upstairs”) has next_passage_id =2
Choice 2” (“Check the basement”) has  next_passage_id =3

Users → Reading_Progress:
One-to-Many:  one user can have many reading_progress rows, but each reading_progress row belongs to only one user.
Example: 
Reading_Progress 1: user_id = 1(“Hailey”), story_id =101, current_passage_id = 3
Reading_Progress 2: user_id = 1(“Hailey”), story_id =102, current_passage_id = 5

Stories → Reading_Progress: 
One-to-Many:  One story can have many reading_progress rows, but each reading_progress row belongs to one story. 
Example:
Reading_Progress 1: story_id = 101 (“Hailey’s progress”), current_passage_id = 3
Reading_Progress 2: story_id= 101 (“Declan’s progress”),  current_passage_id = 5

Passage → Reading_Progress:
One-to-Many: one passage can be the “current spot” for many reading_progress rows, but each reading_progress row points to only one current passage
Example:
Reading_Progress 1: current_passage_id = 3 (Hailey’s here)
Reading_Progress 2: current_passage_id = 3 (another reader is also here

Users → Path_History:
One-to-Many:  one user can have many path_history rows, but each path_history row belongs to only one user.
Example:
Path_History 1: user_id =1(“Hailey), story_id =101, passage_id = 1, choice_id = 1
Path_History 2: user_id =1(“Hailey), story_id =101, passage_id = 2, choice_id = 3
Stories → Path_History:
One-to-Many:  one story can have many path_history rows, but each path_history row belongs to only one story.
Example: 
Path_History 1: passage_id = 1 (Hailey passed through here)
Path_History 4: passage_id = 1 (Declan also passed through here)

Choices → Path_History:
One-to-Many: one choice can appear in many path_history rows, but each path_history row records only one choice.
Example:
Path_History 1: choice_id = 1 (“Go upstairs” - Hailey picked this)
Path_History 5: choice_id = 1  (“Go upstairs” - another reader also picked this)

Passage → Path_History:
One-to-Many: one passage can appear in many path_history rows, but each path_history row points to only one passage
Example: 
Path_History 1: passage_id = 1(Hailey passed through here)
Path_History 4: passage_id = 1(Declan also passed through here)


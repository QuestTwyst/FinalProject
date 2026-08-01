import "dotenv/config";
import pool from "./database.js";
import { storyGraph } from "../data/storyData.js";

//Drop tables
const dropAssignedTables = async () => {
  await pool.query(`
    DROP TABLE IF EXISTS story_history CASCADE;
    DROP TABLE IF EXISTS reading_progress CASCADE;
    DROP TABLE IF EXISTS story_genres CASCADE;
    DROP TABLE IF EXISTS genres CASCADE;

    DROP TABLE IF EXISTS choices CASCADE;
    DROP TABLE IF EXISTS passages CASCADE;
    DROP TABLE IF EXISTS stories CASCADE;
    
  `);

  console.log("✔️ Assigned tables dropped.");
};

//Create tables
const createUsersTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user',
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

      first_name TEXT,
      middle_name TEXT,
      last_name TEXT,
      favorite_genre TEXT,
      bio TEXT
    );
  `);

  // ADD MISSING COLUMNS IF THEY DON'T EXIST
  await pool.query(
    `ALTER TABLE users ADD COLUMN IF NOT EXISTS first_name TEXT;`,
  );
  await pool.query(
    `ALTER TABLE users ADD COLUMN IF NOT EXISTS middle_name TEXT;`,
  );
  await pool.query(
    `ALTER TABLE users ADD COLUMN IF NOT EXISTS last_name TEXT;`,
  );
  await pool.query(
    `ALTER TABLE users ADD COLUMN IF NOT EXISTS favorite_genre TEXT;`,
  );
  await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT;`);

  console.log("✔️ Users table created.");
};

const createStoriesTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS stories (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      creator_id INTEGER,
      start_passage_id INTEGER,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      published BOOLEAN NOT NULL DEFAULT FALSE,

      CONSTRAINT fk_stories_creator
        FOREIGN KEY (creator_id)
        REFERENCES users(id)
        ON DELETE SET NULL
    );
  `);

  await pool.query(
    `ALTER TABLE stories ADD COLUMN IF NOT EXISTS published BOOLEAN DEFAULT FALSE;`,
  );
  console.log("✔️ Stories table created.");
};

const addStoriesCreatorForeignKey = async () => {
  await pool.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'fk_stories_creator'
      ) THEN
        ALTER TABLE stories
          ADD CONSTRAINT fk_stories_creator
          FOREIGN KEY (creator_id)
          REFERENCES users(id)
          ON DELETE SET NULL;
      END IF;
    END $$;
  `);

  console.log("✔️ Stories.creator_id foreign key confirmed.");
};

const createPassagesTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS passages (
      id SERIAL PRIMARY KEY,
      story_id INTEGER NOT NULL,
      content TEXT NOT NULL,
      is_ending BOOLEAN NOT NULL DEFAULT FALSE,

      CONSTRAINT fk_passages_story
        FOREIGN KEY (story_id)
        REFERENCES stories(id)
        ON DELETE CASCADE
    );
  `);

  console.log("✔️ Passages table created.");
};

const createChoicesTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS choices (
      id SERIAL PRIMARY KEY,
      passage_id INTEGER NOT NULL,
      choice_text TEXT NOT NULL,
      next_passage_id INTEGER,

      CONSTRAINT fk_choices_passage
        FOREIGN KEY (passage_id)
        REFERENCES passages(id)
        ON DELETE CASCADE,

      CONSTRAINT fk_choices_next_passage
        FOREIGN KEY (next_passage_id)
        REFERENCES passages(id)
        ON DELETE SET NULL
    );
  `);

  console.log("✔️ Choices table created.");
};

const createGenresTable = async () => {
  await pool.query(`
    CREATE TABLE genres (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL UNIQUE
    );
  `);

  console.log("✔️ Genres table created.");
};

const createStoryGenresTable = async () => {
  await pool.query(`
    CREATE TABLE story_genres (
      id SERIAL PRIMARY KEY,
      story_id INTEGER NOT NULL,
      genre_id INTEGER NOT NULL,

      CONSTRAINT fk_story_genres_story
        FOREIGN KEY (story_id)
        REFERENCES stories(id)
        ON DELETE CASCADE,

      CONSTRAINT fk_story_genres_genre
        FOREIGN KEY (genre_id)
        REFERENCES genres(id)
        ON DELETE CASCADE,

      CONSTRAINT unique_story_genre
        UNIQUE (story_id, genre_id)
    );
  `);

  console.log("✔️ Story_genres table created.");
};

const createReadingProgressTable = async () => {
  await pool.query(`
    CREATE TABLE reading_progress (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL,
      story_id INTEGER NOT NULL,
      current_passage_id INTEGER NOT NULL,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

      CONSTRAINT fk_reading_progress_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

      CONSTRAINT fk_reading_progress_story
        FOREIGN KEY (story_id)
        REFERENCES stories(id)
        ON DELETE CASCADE,

      CONSTRAINT fk_reading_progress_passage
        FOREIGN KEY (current_passage_id)
        REFERENCES passages(id)
        ON DELETE RESTRICT,

      CONSTRAINT unique_user_story_progress
        UNIQUE (user_id, story_id)
    );
  `);

  console.log("✔️ Reading_progress table created.");
};

const createStoryHistoryTable = async () => {
  await pool.query(`
    CREATE TABLE story_history (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL,
      story_id INTEGER NOT NULL,
      passage_id INTEGER NOT NULL,
      choice_id INTEGER NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

      CONSTRAINT fk_story_history_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

      CONSTRAINT fk_story_history_story
        FOREIGN KEY (story_id)
        REFERENCES stories(id)
        ON DELETE CASCADE,

      CONSTRAINT fk_story_history_passage
        FOREIGN KEY (passage_id)
        REFERENCES passages(id)
        ON DELETE CASCADE,

      CONSTRAINT fk_story_history_choice
        FOREIGN KEY (choice_id)
        REFERENCES choices(id)
        ON DELETE CASCADE
    );
  `);

  console.log("✔️ Story_history table created.");
};

const seedUsers = async () => {
  await pool.query(`
    INSERT INTO users (name, email, password_hash)
    VALUES
      ('Hailey', 'hailey@example.com', 'hashed_pw_1'),
      ('Declan', 'declan@example.com', 'hashed_pw_2')
    ON CONFLICT (email) DO NOTHING;
  `);

  console.log("✔️ Sample users inserted.");
};

//Seed Stories (without start_passage_id)
const seedStoriesInitial = async () => {
  for (const story of Object.values(storyGraph)) {
    await pool.query(
      `
      INSERT INTO stories (id, title, description, creator_id)
      VALUES ($1, $2, $3, NULL)
      ON CONFLICT (id) DO UPDATE
        SET title = EXCLUDED.title,
            description = EXCLUDED.description;
    `,
      [story.id, story.title, story.description],
    );
  }

  console.log("✔️ StoryGraph stories inserted (initial).");
};

//Seed passages (build mapping)
const seedPassages = async () => {
  const passageIdMap = {};

  for (const story of Object.values(storyGraph)) {
    for (const passage of Object.values(story.passages)) {
      const result = await pool.query(
        `
        INSERT INTO passages (story_id, content, is_ending)
        VALUES ($1, $2, $3)
        RETURNING id;
      `,
        [story.id, passage.content, passage.isEnding],
      );

      const dbId = result.rows[0].id;
      passageIdMap[`${story.id}:${passage.id}`] = dbId;
    }
  }

  console.log("✔️ StoryGraph passages inserted.");
  return passageIdMap;
};

//Update stories with start_passage_id
const updateStoryStartPassageIds = async (passageIdMap) => {
  for (const story of Object.values(storyGraph)) {
    const dbStartPassageId =
      passageIdMap[`${story.id}:${story.startPassageId}`];

    await pool.query(
      `
      UPDATE stories
      SET start_passage_id = $2
      WHERE id = $1;
    `,
      [story.id, dbStartPassageId],
    );
  }

  console.log("✔️ Story start_passage_id updated.");
};

//Seed choices (using mapping)
const seedChoices = async (passageIdMap) => {
  let choiceId = 1;

  for (const story of Object.values(storyGraph)) {
    for (const passage of Object.values(story.passages)) {
      const fromDbPassageId = passageIdMap[`${story.id}:${passage.id}`];

      for (const choice of passage.choices) {
        const toDbPassageId =
          choice.next != null
            ? passageIdMap[`${story.id}:${choice.next}`]
            : null;

        await pool.query(
          `
          INSERT INTO choices (id, passage_id, choice_text, next_passage_id)
          VALUES ($1, $2, $3, $4)
          ON CONFLICT (id) DO UPDATE
            SET passage_id = EXCLUDED.passage_id,
                choice_text = EXCLUDED.choice_text,
                next_passage_id = EXCLUDED.next_passage_id;
        `,
          [choiceId, fromDbPassageId, choice.text, toDbPassageId],
        );

        choiceId += 1;
      }
    }
  }

  console.log("✔️ StoryGraph choices inserted.");
};

const seedGenres = async () => {
  const genreNames = new Set(
    Object.values(storyGraph).map((story) => story.genre),
  );

  for (const name of genreNames) {
    await pool.query(
      `
      INSERT INTO genres (name)
      VALUES ($1)
      ON CONFLICT (name) DO NOTHING;
    `,
      [name],
    );
  }

  console.log("✔️ StoryGraph genres inserted.");
};

const seedStoryGenres = async () => {
  for (const story of Object.values(storyGraph)) {
    await pool.query(
      `
      INSERT INTO story_genres (story_id, genre_id)
      SELECT s.id, g.id
      FROM stories s
      JOIN genres g ON g.name = $2
      WHERE s.id = $1
      ON CONFLICT (story_id, genre_id) DO NOTHING;
    `,
      [story.id, story.genre],
    );
  }

  console.log("✔️ StoryGraph story-genre relationships inserted.");
};

const seedReadingProgress = async () => {
  await pool.query(`
    INSERT INTO reading_progress (
      user_id,
      story_id,
      current_passage_id
    )
    SELECT
      users.id,
      stories.id,
      passages.id
    FROM users
    JOIN stories
      ON stories.title = 'The Lost Forest'
    JOIN passages
      ON passages.story_id = stories.id
    WHERE passages.content =
      'You wake up in a dark forest. Two paths lie ahead.'
    ORDER BY users.id
    LIMIT 1
    ON CONFLICT (user_id, story_id)
    DO UPDATE SET
      current_passage_id = EXCLUDED.current_passage_id,
      updated_at = CURRENT_TIMESTAMP;
  `);

  console.log("✔️ Reading-progress sample inserted.");
};

const seedStoryHistory = async () => {
  await pool.query(`
    INSERT INTO story_history (
      user_id,
      story_id,
      passage_id,
      choice_id
    )
    SELECT
      users.id,
      passages.story_id,
      passages.id,
      choices.id
    FROM users
    CROSS JOIN choices
    JOIN passages
      ON passages.id = choices.passage_id
    ORDER BY users.id, choices.id
    LIMIT 1;
  `);

  console.log("✔️ Story-history sample inserted.");
};

const resetAssignedTables = async () => {
  try {
    console.log("Resetting QuestTwyst database tables...");

    await dropAssignedTables();

    await createUsersTable();
    await createStoriesTable();
    await addStoriesCreatorForeignKey();
    await createPassagesTable();
    await createChoicesTable();

    //await dropAssignedTables();

    await createGenresTable();
    await createStoryGenresTable();
    await createReadingProgressTable();
    await createStoryHistoryTable();

    await seedUsers();

    // 1. Insert stories first
    await seedStoriesInitial();

    // 2. Insert passages and build mapping
    const passageIdMap = await seedPassages();

    // 3. Update stories with correct start_passage_id
    await updateStoryStartPassageIds(passageIdMap);

    // 4. Insert choices
    await seedChoices(passageIdMap);

    await seedGenres();
    await seedStoryGenres();
    await seedReadingProgress();
    await seedStoryHistory();

    console.log("🎉 Database tables reset successfully.");
  } catch (error) {
    console.error("❌ Error resetting database:", error);
    process.exitCode = 1;
  } finally {
    await pool.end();
    console.log("Database connection closed.");
  }
};

resetAssignedTables();

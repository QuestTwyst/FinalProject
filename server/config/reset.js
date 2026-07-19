import "dotenv/config";
import pool from "./database.js";

const dropAssignedTables = async () => {
  await pool.query(`
    DROP TABLE IF EXISTS story_history CASCADE;
    DROP TABLE IF EXISTS reading_progress CASCADE;
    DROP TABLE IF EXISTS story_genres CASCADE;
    DROP TABLE IF EXISTS genres CASCADE;
  `);

  console.log("✔️ Assigned tables dropped.");
};

const createUsersTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  console.log("✔️ Users table created.");
};

const createStoriesTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS stories (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      creator_id INTEGER,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  console.log("✔️ Stories table created.");
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

const seedStories = async () => {
  await pool.query(`
    INSERT INTO stories (
      title,
      description,
      creator_id
    )
    SELECT
      'The Lost Forest',
      'A magical forest full of secrets.',
      NULL
    WHERE NOT EXISTS (
      SELECT 1
      FROM stories
      WHERE title = 'The Lost Forest'
    );
  `);

  await pool.query(`
    INSERT INTO stories (
      title,
      description,
      creator_id
    )
    SELECT
      'Cyber City',
      'A neon world of hackers and androids.',
      NULL
    WHERE NOT EXISTS (
      SELECT 1
      FROM stories
      WHERE title = 'Cyber City'
    );
  `);

  await pool.query(`
    INSERT INTO stories (
      title,
      description,
      creator_id
    )
    SELECT
      'Midnight Train',
      'A mystery unfolding on a night train.',
      NULL
    WHERE NOT EXISTS (
      SELECT 1
      FROM stories
      WHERE title = 'Midnight Train'
    );
  `);

  console.log("✔️ Sample stories inserted.");
};

const seedPassages = async () => {
  await pool.query(`
    INSERT INTO passages (
      story_id,
      content,
      is_ending
    )
    SELECT
      stories.id,
      'You wake up in a dark forest. Two paths lie ahead.',
      FALSE
    FROM stories
    WHERE stories.title = 'The Lost Forest'
      AND NOT EXISTS (
        SELECT 1
        FROM passages
        WHERE content =
          'You wake up in a dark forest. Two paths lie ahead.'
      );
  `);

  await pool.query(`
    INSERT INTO passages (
      story_id,
      content,
      is_ending
    )
    SELECT
      stories.id,
      'You follow the left path and find a quiet river.',
      FALSE
    FROM stories
    WHERE stories.title = 'The Lost Forest'
      AND NOT EXISTS (
        SELECT 1
        FROM passages
        WHERE content =
          'You follow the left path and find a quiet river.'
      );
  `);

  await pool.query(`
    INSERT INTO passages (
      story_id,
      content,
      is_ending
    )
    SELECT
      stories.id,
      'You follow the right path and encounter a strange creature.',
      FALSE
    FROM stories
    WHERE stories.title = 'The Lost Forest'
      AND NOT EXISTS (
        SELECT 1
        FROM passages
        WHERE content =
          'You follow the right path and encounter a strange creature.'
      );
  `);

  await pool.query(`
    INSERT INTO passages (
      story_id,
      content,
      is_ending
    )
    SELECT
      stories.id,
      'You reach the end of your journey.',
      TRUE
    FROM stories
    WHERE stories.title = 'The Lost Forest'
      AND NOT EXISTS (
        SELECT 1
        FROM passages
        WHERE content =
          'You reach the end of your journey.'
      );
  `);

  console.log("✔️ Sample passages inserted.");
};

const seedGenres = async () => {
  await pool.query(`
    INSERT INTO genres (name)
    VALUES
      ('Adventure'),
      ('Science Fiction'),
      ('Mystery'),
      ('Horror')
    ON CONFLICT (name) DO NOTHING;
  `);

  console.log("✔️ Sample genres inserted.");
};

const seedStoryGenres = async () => {
  await pool.query(`
    INSERT INTO story_genres (
      story_id,
      genre_id
    )
    SELECT
      stories.id,
      genres.id
    FROM stories
    CROSS JOIN genres
    WHERE stories.title = 'The Lost Forest'
      AND genres.name = 'Adventure'
    ON CONFLICT (story_id, genre_id) DO NOTHING;
  `);

  await pool.query(`
    INSERT INTO story_genres (
      story_id,
      genre_id
    )
    SELECT
      stories.id,
      genres.id
    FROM stories
    CROSS JOIN genres
    WHERE stories.title = 'Cyber City'
      AND genres.name = 'Science Fiction'
    ON CONFLICT (story_id, genre_id) DO NOTHING;
  `);

  await pool.query(`
    INSERT INTO story_genres (
      story_id,
      genre_id
    )
    SELECT
      stories.id,
      genres.id
    FROM stories
    CROSS JOIN genres
    WHERE stories.title = 'Midnight Train'
      AND genres.name = 'Mystery'
    ON CONFLICT (story_id, genre_id) DO NOTHING;
  `);

  console.log("✔️ Sample story-genre relationships inserted.");
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

    await createUsersTable();
    await createStoriesTable();
    await createPassagesTable();
    await createChoicesTable();

    await dropAssignedTables();

    await createGenresTable();
    await createStoryGenresTable();
    await createReadingProgressTable();
    await createStoryHistoryTable();

    await seedUsers();
    await seedStories();
    await seedPassages();
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

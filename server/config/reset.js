import "dotenv/config";
import pool from "./database.js";

const dropTables = async () => {
  await pool.query(`
    DROP TABLE IF EXISTS story_history CASCADE;
    DROP TABLE IF EXISTS reading_progress CASCADE;
    DROP TABLE IF EXISTS story_genres CASCADE;
    DROP TABLE IF EXISTS genres CASCADE;
  `);

  console.log("✔️ Assigned tables dropped.");
};

const createGenresTable = async () => {
  await pool.query(`
    CREATE TABLE genres (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL UNIQUE
    );
  `);

  console.log("✔️ genres table created.");
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

  console.log("✔️ story_genres table created.");
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

  console.log("✔️ reading_progress table created.");
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

  console.log("✔️ story_history table created.");
};

const seedDatabase = async () => {
  await pool.query(`
    INSERT INTO genres (name)
    VALUES
      ('Adventure'),
      ('Science Fiction'),
      ('Mystery'),
      ('Horror')
    ON CONFLICT (name) DO NOTHING;
  `);

  console.log("✔️ Genre sample data inserted.");
};

const resetAssignedTables = async () => {
  try {
    console.log("Resetting assigned QuestTwyst tables...");

    await dropTables();
    await createGenresTable();
    await createStoryGenresTable();
    await createReadingProgressTable();
    await createStoryHistoryTable();
    await seedDatabase();

<<<<<<< Updated upstream
    // Create table for stories
    await pool.query(`
      CREATE TABLE stories (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        creator_id INTEGER,  -- nullable for now
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    console.log("✔️ Stories table created.");

    // Seed sample stories
    await pool.query(`
      INSERT INTO stories (title, description, creator_id)
      VALUES
        ('The Lost Forest', 'A magical forest full of secrets.', NULL),
        ('Cyber City', 'A neon world of hackers and androids.', NULL),
        ('Midnight Train', 'A mystery unfolding on a night train.', NULL);
    `);

    console.log("✔️ Sample stories inserted.");

    // Create table for passages
    await pool.query(`
     CREATE TABLE IF NOT EXISTS passages (
      id SERIAL PRIMARY KEY,
      story_id INTEGER REFERENCES stories(id) ON DELETE CASCADE,
      content TEXT NOT NULL,
      is_ending BOOLEAN DEFAULT FALSE
    );
  `);

    console.log("✔️ Passages table created.");

    // Seed sample passages
    await pool.query(`
     INSERT INTO passages (story_id, content, is_ending)
      VALUES
      (1, 'You wake up in a dark forest. Two paths lie ahead.', false),
      (1, 'You follow the left path and find a quiet river.', false),
      (1, 'You follow the right path and encounter a strange creature.', false),
      (1, 'You reach the end of your journey.', true);
`);

    console.log("✔️ Sample passages inserted.");
  } catch (error) {
    console.error("❌ Error resetting database:", error);
=======
    console.log("🎉 Assigned tables reset successfully.");
  } catch (error) {
    console.error("❌ Error resetting assigned tables:", error);
    process.exitCode = 1;
>>>>>>> Stashed changes
  } finally {
    await pool.end();
    console.log("Database connection closed.");
  }
};

resetAssignedTables();
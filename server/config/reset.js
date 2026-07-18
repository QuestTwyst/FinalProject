import dotenv from "dotenv";
import pool from "./database.js";

dotenv.config();

const resetStoriesTable = async () => {
  try {
    console.log("Resetting STORIES table...");

    // Drop table if exists
    await pool.query(`
      DROP TABLE IF EXISTS stories;
    `);

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
  } finally {
    pool.end();
    console.log("Database connection closed.");
  }
};

resetStoriesTable();

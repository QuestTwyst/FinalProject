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

    // Create table
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
  } catch (error) {
    console.error("❌ Error resetting stories table:", error);
  } finally {
    pool.end();
    console.log("Database connection closed.");
  }
};

resetStoriesTable();

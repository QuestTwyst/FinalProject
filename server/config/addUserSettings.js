import "dotenv/config";
import pool from "./database.js";

/**
 * Adds a genuine one-to-one relationship to the schema: user_settings,
 * one row per user, linked by user_id.
 *
 * What makes this 1:1 rather than 1:many (like most of the rest of
 * this schema) is that user_id is BOTH a foreign key AND has its own
 * individual UNIQUE constraint -- so each user can have at most one
 * settings row, and each settings row belongs to exactly one user.
 * (Contrast with reading_progress or story_genres, where the unique
 * constraint covers a PAIR of columns together, allowing many rows
 * per user/story -- that's many-to-many, not one-to-one.)
 *
 * Safe to run more than once.
 */
const createUserSettingsTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS user_settings (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL UNIQUE
        REFERENCES users(id) ON DELETE CASCADE,
      theme_preference TEXT NOT NULL DEFAULT 'light',
      email_notifications BOOLEAN NOT NULL DEFAULT true,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  console.log("✔️ user_settings table created (one-to-one with users).");
};

const run = async () => {
  try {
    console.log("Adding user_settings table...");
    await createUserSettingsTable();
    console.log("🎉 Migration complete.");
  } catch (error) {
    console.error("❌ Error running migration:", error);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
};

run();

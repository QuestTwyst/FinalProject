import "dotenv/config";
import pool from "./database.js";

/**
 * Adds the extra profile fields Profile.jsx needs (username, first/
 * middle/last name, favorite genre, bio) to the real users table.
 * Safe to run multiple times -- uses IF NOT EXISTS on every column,
 * and does not touch or drop any existing data.
 */
const addProfileColumns = async () => {
  await pool.query(`
    ALTER TABLE users
      ADD COLUMN IF NOT EXISTS username TEXT UNIQUE,
      ADD COLUMN IF NOT EXISTS first_name TEXT,
      ADD COLUMN IF NOT EXISTS middle_name TEXT,
      ADD COLUMN IF NOT EXISTS last_name TEXT,
      ADD COLUMN IF NOT EXISTS favorite_genre TEXT,
      ADD COLUMN IF NOT EXISTS bio TEXT;
  `);

  console.log("✔️ Profile columns added to users table.");
};

const run = async () => {
  try {
    console.log("Adding profile columns to users table...");
    await addProfileColumns();
    console.log("🎉 Migration complete.");
  } catch (error) {
    console.error("❌ Error running migration:", error);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
};

run();

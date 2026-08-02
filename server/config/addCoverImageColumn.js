import "dotenv/config";
import pool from "./database.js";

const run = async () => {
  try {
    console.log("Adding cover_image_url to stories...");
    await pool.query(`
      ALTER TABLE stories ADD COLUMN IF NOT EXISTS cover_image_url TEXT;
    `);
    console.log("Done.");
  } catch (error) {
    console.error("Error:", error);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
};

run();

import pool from "./database.js";

const addAdminRole = async () => {
  try {
    console.log("Adding user role support...");

    await pool.query(`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'user';
    `);

    console.log("User role migration completed.");
  } catch (error) {
    console.error("Unable to add admin role:", error);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
};

addAdminRole();
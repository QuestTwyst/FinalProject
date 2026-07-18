import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT || 5432),
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  ssl : {
    rejectUnauthorized: false
  }
});

pool.on("connect", () => {
  console.log("Connected to the QuestTwyst PostgreSQL database");
});

pool.on("error", (error) => {
  console.error("Unexpected PostgreSQL error:", error);
});

export default pool;
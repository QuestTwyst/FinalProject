import pool from "../config/database.js";
import bcrypt from "bcrypt";

export const login = async (req, res) => {
  try {
    const { email, password_hash } = req.body;

    if (!email || !password_hash) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const result = await pool.query(
      `SELECT id, name, email, password_hash, username, first_name, middle_name, last_name, favorite_genre, bio
       FROM users WHERE email = $1`,
      [email],
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = result.rows[0];
    const passwordMatches = await bcrypt.compare(
      password_hash,
      user.password_hash,
    );

    if (!passwordMatches) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const { password_hash: _omit, ...safeUser } = user;
    res.status(200).json({ user: safeUser });
  } catch (error) {
    res.status(500).json({ error: "Failed to log in" });
  }
};

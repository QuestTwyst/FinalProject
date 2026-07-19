import pool from "../config/database.js";

export const getUsers = async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM users ORDER BY id ASC`);
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [
      userId,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
};

export const createUser = async (req, res) => {
  try {
    const { name, email, password_hash } = req.body;

    if (!name || !email || !password_hash) {
      return res
        .status(400)
        .json({ error: "name, email, and password_hash are required" });
    }

    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [name, email, password_hash],
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to create user" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, email, password_hash } = req.body;

    const result = await pool.query(
      `UPDATE users
       SET name = $1,
           email = $2,
           password_hash = $3
       WHERE id = $4
       RETURNING *`,
      [name, email, password_hash, userId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to update user" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await pool.query(
      `DELETE FROM users WHERE id = $1 RETURNING *`,
      [userId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete user" });
  }
};

import pool from "../config/database.js";
import bcrypt from "bcrypt";
const SALT_ROUNDS = 10;

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

    if (Number(req.user.id) !== Number(userId)) {
      return res.status(403).json({
        error: "You can only view your own profile",
      });
    }

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
    const { first_name, middle_name, last_name, email, password_hash } =
      req.body;

    const fullName = [
      first_name?.trim(),
      middle_name?.trim(),
      last_name?.trim(),
    ]
      .filter(Boolean)
      .join(" ");

    if (!first_name || !last_name || !email || !password_hash) {
      return res.status(400).json({
        error: "first_name, last_name, email, and password_hash are required",
      });
    }

    const hashedPassword = await bcrypt.hash(password_hash, SALT_ROUNDS);

    const result = await pool.query(
      `INSERT INTO users (name, first_name, middle_name, last_name, email, password_hash)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, name, first_name, middle_name, last_name, email, created_at`,
      [fullName, first_name, middle_name, last_name, email, hashedPassword],
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({ error: "Email already in use" });
    }
    res.status(500).json({ error: "Failed to create user" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const isOwner = Number(req.user.id) === Number(req.params.userId);
        const isAdmin = req.user.role === "admin";

        if (!isOwner && !isAdmin) {
          return res.status(403).json({
            error: "You can only update your own account",
          });
        }

    const {
      //name,
      email,
      password_hash,
      //username,
      first_name,
      middle_name,
      last_name,
      favorite_genre,
      bio,
    } = req.body;

    // Only update fields that were actually sent in the request --
    // this fixes a real bug in the previous version, which always
    // overwrote name/email/password_hash unconditionally, even with
    // undefined values (which would have nulled out a user's real
    // password_hash if this endpoint were ever called with just
    // profile fields, like from the Profile page).
    const fields = [];
    const values = [];
    let paramIndex = 1;

    const maybeAdd = (column, value) => {
      if (value !== undefined) {
        fields.push(`${column} = $${paramIndex}`);
        values.push(value);
        paramIndex += 1;
      }
    };

    // Auto-update name if any name fields were provided
    if (
      first_name !== undefined ||
      middle_name !== undefined ||
      last_name !== undefined
    ) {
      const fullName = [
        first_name?.trim(),
        middle_name?.trim(),
        last_name?.trim(),
      ]
        .filter(Boolean)
        .join(" ");

      maybeAdd("name", fullName);
    }

    maybeAdd("email", email);

    if (password_hash !== undefined) {
      const hashedPassword = await bcrypt.hash(password_hash, SALT_ROUNDS);
      maybeAdd("password_hash", hashedPassword);
    }

    //maybeAdd("username", username);
    maybeAdd("first_name", first_name);
    maybeAdd("middle_name", middle_name);
    maybeAdd("last_name", last_name);
    maybeAdd("favorite_genre", favorite_genre);
    maybeAdd("bio", bio);

    if (fields.length === 0) {
      return res.status(400).json({ error: "No fields provided to update" });
    }

    values.push(userId);

    //took out username
    const result = await pool.query(
      `UPDATE users
       SET ${fields.join(", ")}
       WHERE id = $${paramIndex}
       RETURNING id, email, first_name, middle_name, last_name, favorite_genre, bio, created_at`,
      values,
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({ error: "That username is already taken" });
    }
    res
      .status(500)
      .json({ error: "Failed to update user", details: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const isOwner = Number(req.user.id) === Number(req.params.userId);
        const isAdmin = req.user.role === "admin";

        if (!isOwner && !isAdmin) {
          return res.status(403).json({
            error: "You can only delete your own account",
          });
        }

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

import pool from "../config/database.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
export const login = async (req, res) => {
  try {
    const { email, password, password_hash } = req.body;
    const submittedPassword = password || password_hash;
    if (!email?.trim() || !submittedPassword) {
      return res.status(400).json({
        error: "Email and password are required",
      });
    }
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not configured");
      return res.status(500).json({
        error: "Authentication is not configured",
      });
    }
    const result = await pool.query(
      `
        SELECT
          id,
          name,
          email,
          password_hash,
          role,
          username,
          first_name,
          middle_name,
          last_name,
          favorite_genre,
          bio
        FROM users
        WHERE LOWER(email) = LOWER($1)
      `,
      [email.trim()],
    );
    if (result.rows.length === 0) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }
    const user = result.rows[0];
    const passwordMatches = await bcrypt.compare(
      submittedPassword,
      user.password_hash,
    );
    if (!passwordMatches) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }
    const token = jwt.sign(
      {
        sub: String(user.id),
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "2h",
      },
    );
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        username: user.username,
        first_name: user.first_name,
        middle_name: user.middle_name,
        last_name: user.last_name,
        favorite_genre: user.favorite_genre,
        bio: user.bio,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      error: "Failed to log in",
    });
  }
};

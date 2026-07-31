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

    //jsonb is used just encase the instance from the data does not have 
    // certain values which will be placed as null at this time but will 
    // be allowed to be used such as the admin and user email. 
    const result = await pool.query(
      `
        SELECT
          u.id,
          u.name,
          u.email,
          u.password_hash,
          u.role,
          to_jsonb(u)->>'username' AS username,
          to_jsonb(u)->>'first_name' AS first_name,
          to_jsonb(u)->>'middle_name' AS middle_name,
          to_jsonb(u)->>'last_name' AS last_name,
          to_jsonb(u)->>'favorite_genre' AS favorite_genre,
          to_jsonb(u)->>'bio' AS bio
        FROM users AS u
        WHERE LOWER(u.email) = LOWER($1)
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

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,

        // Original database-style names
        username: user.username || "",
        first_name: user.first_name || "",
        middle_name: user.middle_name || "",
        last_name: user.last_name || "",
        favorite_genre: user.favorite_genre || "",
        bio: user.bio || "",

        // Names currently expected by Profile.jsx
        firstName: user.first_name || "",
        middleName: user.middle_name || "",
        lastName: user.last_name || "",
        favoriteGenre: user.favorite_genre || "",
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      error: "Failed to log in",
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email?.trim() || !newPassword) {
      return res.status(400).json({
        error: "Email and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        error: "Password must be at least 6 characters",
      });
    }

    const userResult = await pool.query(
      "SELECT id FROM users WHERE LOWER(email) = LOWER($1)",
      [email.trim()],
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        error: "No account found with that email",
      });
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    await pool.query(
      "UPDATE users SET password_hash = $1 WHERE LOWER(email) = LOWER($2)",
      [newPasswordHash, email.trim()],
    );

    return res.status(200).json({
      message: "Password reset successful",
    });
  } catch (error) {
    console.error("Password reset error:", error);

    return res.status(500).json({
      error: "Failed to reset password",
    });
  }
};
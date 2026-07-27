import jwt from "jsonwebtoken";
import pool from "../config/database.js";

export const requireAuth = async (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader?.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Authentication required",
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not configured");

      return res.status(500).json({
        error: "Authentication is not configured",
      });
    }

    const token = authorizationHeader.slice(7);

    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET,
    );

    const result = await pool.query(
      `
        SELECT id, name, email, role
        FROM users
        WHERE id = $1
      `,
      [payload.sub],
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        error: "User account no longer exists",
      });
    }

    req.user = result.rows[0];

    next();
  } catch (error) {
    console.error("Authentication error:", error.message);

    return res.status(401).json({
      error: "Invalid or expired authentication token",
    });
  }
};

export const requireAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({
      error: "Administrator access required",
    });
  }

  next();
};
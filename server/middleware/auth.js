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

/**
 * Allows the request through only if the logged-in user is either an
 * admin, or the creator of the story this request affects. Works
 * across all the passage/choice management routes by figuring out
 * which story is actually involved from whichever route param is
 * present -- a direct story id, a passage id (traced back to its
 * story), or a choice id (traced back through its passage to the
 * story).
 */
export const requireStoryOwnerOrAdmin = async (req, res, next) => {
  try {
    let storyId = null;

    if (req.params.id) {
      storyId = req.params.id;
    } else if (req.params.passageId) {
      const passageResult = await pool.query(
        "SELECT story_id FROM passages WHERE id = $1",
        [req.params.passageId],
      );
      if (passageResult.rows.length === 0) {
        return res.status(404).json({ error: "Passage not found" });
      }
      storyId = passageResult.rows[0].story_id;
    } else if (req.params.choiceId) {
      const choiceResult = await pool.query(
        `
          SELECT p.story_id
          FROM choices c
          JOIN passages p ON p.id = c.passage_id
          WHERE c.id = $1
        `,
        [req.params.choiceId],
      );
      if (choiceResult.rows.length === 0) {
        return res.status(404).json({ error: "Choice not found" });
      }
      storyId = choiceResult.rows[0].story_id;
    } else {
      return res.status(400).json({
        error: "Unable to determine which story this request affects",
      });
    }

    const storyResult = await pool.query(
      "SELECT creator_id FROM stories WHERE id = $1",
      [storyId],
    );
    if (storyResult.rows.length === 0) {
      return res.status(404).json({ error: "Story not found" });
    }

    const creatorId = storyResult.rows[0].creator_id;
    const isOwner =
      creatorId !== null && Number(creatorId) === Number(req.user.id);
    const isAdmin = req.user?.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        error: "You do not have permission to modify this story",
      });
    }

    next();
  } catch (error) {
    console.error("Story authorization error:", error.message);
    return res.status(500).json({
      error: "Unable to verify permissions",
    });
  }
};

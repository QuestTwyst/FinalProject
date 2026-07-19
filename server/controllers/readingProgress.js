import pool from "../config/database.js";

export const getReadingProgress = async (req, res) => {
  try {
    const { userId, storyId } = req.params;

    const result = await pool.query(
      `
        SELECT *
        FROM reading_progress
        WHERE user_id = $1
          AND story_id = $2;
      `,
      [userId, storyId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Reading progress not found",
      });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error retrieving reading progress:", error);

    res.status(500).json({
      error: "Unable to retrieve reading progress",
    });
  }
};

export const createReadingProgress = async (req, res) => {
  try {
    const { user_id, story_id, current_passage_id } = req.body;

    if (!user_id || !story_id || !current_passage_id) {
      return res.status(400).json({
        error:
          "user_id, story_id, and current_passage_id are required",
      });
    }

    const result = await pool.query(
      `
        INSERT INTO reading_progress (
          user_id,
          story_id,
          current_passage_id
        )
        VALUES ($1, $2, $3)
        RETURNING *;
      `,
      [user_id, story_id, current_passage_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating reading progress:", error);

    res.status(500).json({
      error: "Unable to create reading progress",
    });
  }
};

export const updateReadingProgress = async (req, res) => {
  try {
    const { userId, storyId } = req.params;
    const { current_passage_id } = req.body;

    if (!current_passage_id) {
      return res.status(400).json({
        error: "current_passage_id is required",
      });
    }

    const result = await pool.query(
      `
        UPDATE reading_progress
        SET
          current_passage_id = $1,
          updated_at = CURRENT_TIMESTAMP
        WHERE user_id = $2
          AND story_id = $3
        RETURNING *;
      `,
      [current_passage_id, userId, storyId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Reading progress not found",
      });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error updating reading progress:", error);

    res.status(500).json({
      error: "Unable to update reading progress",
    });
  }
};

export const deleteReadingProgress = async (req, res) => {
  try {
    const { userId, storyId } = req.params;

    const result = await pool.query(
      `
        DELETE FROM reading_progress
        WHERE user_id = $1
          AND story_id = $2
        RETURNING *;
      `,
      [userId, storyId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Reading progress not found",
      });
    }

    res.status(200).json({
      message: "Reading progress deleted",
      progress: result.rows[0],
    });
  } catch (error) {
    console.error("Error deleting reading progress:", error);

    res.status(500).json({
      error: "Unable to delete reading progress",
    });
  }
};
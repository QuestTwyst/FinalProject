import pool from "../config/database.js";

export const getStoryHistory = async (req, res) => {
  try {
    const { userId, storyId } = req.params;

    const result = await pool.query(
      `
        SELECT *
        FROM story_history
        WHERE user_id = $1
          AND story_id = $2
        ORDER BY created_at;
      `,
      [userId, storyId]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error retrieving story history:", error);

    res.status(500).json({
      error: "Unable to retrieve story history",
    });
  }
};

export const createStoryHistory = async (req, res) => {
  try {
    const {
      user_id,
      story_id,
      passage_id,
      choice_id,
    } = req.body;

    if (
      !user_id ||
      !story_id ||
      !passage_id ||
      !choice_id
    ) {
      return res.status(400).json({
        error:
          "user_id, story_id, passage_id, and choice_id are required",
      });
    }

    const result = await pool.query(
      `
        INSERT INTO story_history (
          user_id,
          story_id,
          passage_id,
          choice_id
        )
        VALUES ($1, $2, $3, $4)
        RETURNING *;
      `,
      [user_id, story_id, passage_id, choice_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating story history:", error);

    res.status(500).json({
      error: "Unable to create story history",
    });
  }
};

export const deleteStoryHistory = async (req, res) => {
  try {
    const { userId, storyId } = req.params;

    const result = await pool.query(
      `
        DELETE FROM story_history
        WHERE user_id = $1
          AND story_id = $2
        RETURNING *;
      `,
      [userId, storyId]
    );

    res.status(200).json({
      message: "Story history deleted",
      deletedRecords: result.rows,
    });
  } catch (error) {
    console.error("Error deleting story history:", error);

    res.status(500).json({
      error: "Unable to delete story history",
    });
  }
};
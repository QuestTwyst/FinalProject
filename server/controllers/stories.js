import pool from "../config/database.js";

export const getStories = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM stories ORDER BY id ASC;");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching stories:", error);
    res.status(500).json({ error: "Failed to fetch stories" });
  }
};

export const getStoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM stories WHERE id = $1;",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Story not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching story:", error);
    res.status(500).json({ error: "Failed to fetch story" });
  }
};

export const createStory = async (req, res) => {
  try {
    const { title, description, creator_id } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: "Title and description are required" });
    }

    const result = await pool.query(
      `INSERT INTO stories (title, description, creator_id)
       VALUES ($1, $2, $3)
       RETURNING *;`,
      [title, description, creator_id || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating story:", error);
    res.status(500).json({ error: "Failed to create story" });
  }
};

export const deleteStory = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM stories WHERE id = $1 RETURNING *;",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Story not found" });
    }

    res.status(200).json({ message: "Story deleted", story: result.rows[0] });
  } catch (error) {
    console.error("Error deleting story:", error);
    res.status(500).json({ error: "Failed to delete story" });
  }
};



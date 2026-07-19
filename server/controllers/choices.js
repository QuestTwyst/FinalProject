import pool from "../config/database.js";

export const getChoicesByPassage = async (req, res) => {
  try {
    const { passageId } = req.params;

    const result = await pool.query(
      `SELECT * FROM choices WHERE passage_id = $1 ORDER BY id ASC`,
      [passageId],
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching choices:", error);
    res.status(500).json({ error: "Failed to fetch choices" });
  }
};

export const createChoice = async (req, res) => {
  try {
    const { passageId } = req.params;
    const { choice_text, next_passage_id } = req.body;

    if (!choice_text) {
      return res.status(400).json({ error: "choice_text is required" });
    }

    const result = await pool.query(
      `INSERT INTO choices (passage_id, choice_text, next_passage_id)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [passageId, choice_text, next_passage_id || null],
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating choice:", error);
    res.status(500).json({ error: "Failed to create choice" });
  }
};

import pool from "../config/database.js";

export const getChoicesByPassage = async (req, res) => {
  try {
    const { passageId } = req.params;

    const result = await pool.query(
      `SELECT *
       FROM choices
       WHERE passage_id = $1
       ORDER BY id ASC`,
      [passageId],
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching choices:", error);

    res.status(500).json({
      error: "Failed to fetch choices",
    });
  }
};

export const createChoice = async (req, res) => {
  try {
    const { passageId } = req.params;
    const { choice_text, next_passage_id } = req.body;

    if (!choice_text?.trim()) {
      return res.status(400).json({
        error: "choice_text is required",
      });
    }

    const result = await pool.query(
      `INSERT INTO choices (
         passage_id,
         choice_text,
         next_passage_id
       )
       VALUES ($1, $2, $3)
       RETURNING *`,
      [
        passageId,
        choice_text.trim(),
        next_passage_id ?? null,
      ],
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating choice:", error);

    res.status(500).json({
      error: "Failed to create choice",
    });
  }
};

export const updateChoice = async (req, res) => {
  try {
    const { choiceId } = req.params;
    const { choice_text, next_passage_id } = req.body;

    if (!choice_text?.trim()) {
      return res.status(400).json({
        error: "choice_text is required",
      });
    }

    const result = await pool.query(
      `UPDATE choices
       SET
         choice_text = $1,
         next_passage_id = $2
       WHERE id = $3
       RETURNING *`,
      [
        choice_text.trim(),
        next_passage_id ?? null,
        choiceId,
      ],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Choice not found",
      });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error updating choice:", error);

    res.status(500).json({
      error: "Failed to update choice",
    });
  }
};

export const deleteChoice = async (req, res) => {
  try {
    const { choiceId } = req.params;

    const result = await pool.query(
      `DELETE FROM choices
       WHERE id = $1
       RETURNING *`,
      [choiceId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Choice not found",
      });
    }

    res.status(200).json({
      message: "Choice deleted",
      choice: result.rows[0],
    });
  } catch (error) {
    console.error("Error deleting choice:", error);

    res.status(500).json({
      error: "Failed to delete choice",
    });
  }
};
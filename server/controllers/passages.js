import pool from "../config/database.js";

export const getPassagesByStory = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT * FROM passages WHERE story_id = $1 ORDER BY id ASC;`,
      [id],
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching passages:", error);
    res.status(500).json({ error: "Failed to fetch passages" });
  }
};

export const createPassage = async (req, res) => {
  try {
    const { id } = req.params; // story_id
    const { content, is_ending } = req.body;

    if (!content) {
      return res.status(400).json({ error: "Content is required" });
    }

    const result = await pool.query(
      `INSERT INTO passages (story_id, content, is_ending)
       VALUES ($1, $2, $3)
       RETURNING *;`,
      [id, content, is_ending || false],
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating passage:", error);
    res.status(500).json({ error: "Failed to create passage" });
  }
};

export const deletePassage = async (req, res) => {
  try {
    const { passageId } = req.params;

    const result = await pool.query(
      "DELETE FROM passages WHERE id = $1 RETURNING *;",
      [passageId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Passage not found" });
    }

    res.status(200).json({
      message: "Passage deleted",
      passage: result.rows[0],
    });
  } catch (error) {
    console.error("Error deleting passage:", error);
    res.status(500).json({ error: "Failed to delete passage" });
  }
};

export const updatePassage = async (req, res) => {
  try {
    const { passageId } = req.params;
    const { content, is_ending } = req.body;

    const result = await pool.query(
      `UPDATE passages
       SET content = $1, is_ending = $2
       WHERE id = $3
       RETURNING *`,
      [content, is_ending, passageId],
    );

    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(409).json({ error: error.message });
  }
};

export const getPassageById = async (req, res) => {
  try {
    const { passageId } = req.params;

    const passageResult = await pool.query(
      `SELECT *
       FROM passages
       WHERE id = $1;`,
      [passageId],
    );

    if (passageResult.rows.length === 0) {
      return res.status(404).json({
        error: "Passage not found",
      });
    }

    const choicesResult = await pool.query(
      `SELECT
         id,
         passage_id,
         choice_text,
         next_passage_id
       FROM choices
       WHERE passage_id = $1
       ORDER BY id ASC;`,
      [passageId],
    );

    res.status(200).json({
      ...passageResult.rows[0],
      choices: choicesResult.rows,
    });
  } catch (error) {
    console.error("Error fetching passage:", error);

    res.status(500).json({
      error: "Failed to fetch passage",
    });
  }
};

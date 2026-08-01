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

    // Find the passage and the owner of its story.
    const passageResult = await pool.query(
      `SELECT
         passages.id,
         passages.story_id,
         stories.creator_id
       FROM passages
       JOIN stories
         ON stories.id = passages.story_id
       WHERE passages.id = $1;`,
      [passageId],
    );

    if (passageResult.rows.length === 0) {
      return res.status(404).json({
        error: "Passage not found",
      });
    }

    const passage = passageResult.rows[0];

    // Admins can add choices to any story.
    const isAdmin = req.user.role === "admin";

    // Regular users can add choices only to stories they created.
    const isOwner =
      passage.creator_id !== null &&
      Number(passage.creator_id) === Number(req.user.id);

    if (!isAdmin && !isOwner) {
      return res.status(403).json({
        error: "You may only add choices to your own stories",
      });
    }

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

    // Find the choice and the owner of its story.
    const choiceResult = await pool.query(
      `SELECT
         choices.id,
         choices.passage_id,
         passages.story_id,
         stories.creator_id
       FROM choices
       JOIN passages
         ON passages.id = choices.passage_id
       JOIN stories
         ON stories.id = passages.story_id
       WHERE choices.id = $1;`,
      [choiceId],
    );

    if (choiceResult.rows.length === 0) {
      return res.status(404).json({
        error: "Choice not found",
      });
    }

    const choice = choiceResult.rows[0];

    // Admins can edit choices in any story.
    const isAdmin = req.user.role === "admin";

    // Regular users can edit choices only in stories they created.
    const isOwner =
      choice.creator_id !== null &&
      Number(choice.creator_id) === Number(req.user.id);

    if (!isAdmin && !isOwner) {
      return res.status(403).json({
        error: "You may only edit choices in your own stories",
      });
    }

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

    // Find the choice and the owner of its story.
    const choiceResult = await pool.query(
      `SELECT
         choices.id,
         choices.passage_id,
         passages.story_id,
         stories.creator_id
       FROM choices
       JOIN passages
         ON passages.id = choices.passage_id
       JOIN stories
         ON stories.id = passages.story_id
       WHERE choices.id = $1;`,
      [choiceId],
    );

    if (choiceResult.rows.length === 0) {
      return res.status(404).json({
        error: "Choice not found",
      });
    }

    const choice = choiceResult.rows[0];

    // Admins can delete choices from any story.
    const isAdmin = req.user.role === "admin";

    // Regular users can delete choices only from stories they created.
    const isOwner =
      choice.creator_id !== null &&
      Number(choice.creator_id) === Number(req.user.id);

    if (!isAdmin && !isOwner) {
      return res.status(403).json({
        error: "You may only delete choices from your own stories",
      });
    }

    const result = await pool.query(
      `DELETE FROM choices
       WHERE id = $1
       RETURNING *`,
      [choiceId],
    );

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
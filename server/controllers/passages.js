import pool from "../config/database.js";

export const getPassagesByStory = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("id:", id);

    const result = await pool.query(
      `SELECT * FROM passages WHERE story_id = $1 ORDER BY id ASC;`,
      [id],
    );

    console.log("rows length", result.rows.length);

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

    // Find the story so we can check who owns it.
    const storyResult = await pool.query(
      `SELECT id, creator_id
       FROM stories
       WHERE id = $1;`,
      [id],
    );

    if (storyResult.rows.length === 0) {
      return res.status(404).json({
        error: "Story not found",
      });
    }

    const story = storyResult.rows[0];

    // Admins can add passages to any story.
    const isAdmin = req.user.role === "admin";

    // Regular users can add passages only to stories they created.
    const isOwner =
      story.creator_id !== null &&
      Number(story.creator_id) === Number(req.user.id);

    if (!isAdmin && !isOwner) {
      return res.status(403).json({
        error: "You may only add passages to your own stories",
      });
    }

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

    // Admins can delete passages from any story.
    const isAdmin = req.user.role === "admin";

    // Regular users can delete passages only from their own stories.
    const isOwner =
      passage.creator_id !== null &&
      Number(passage.creator_id) === Number(req.user.id);

    if (!isAdmin && !isOwner) {
      return res.status(403).json({
        error: "You may only delete passages from your own stories",
      });
    }

    const result = await pool.query(
      `DELETE FROM passages
       WHERE id = $1
       RETURNING *;`,
      [passageId],
    );

    res.status(200).json({
      message: "Passage deleted",
      passage: result.rows[0],
    });
  } catch (error) {
    console.error("Error deleting passage:", error);

    res.status(500).json({
      error: "Failed to delete passage",
    });
  }
};

export const updatePassage = async (req, res) => {
  try {
    const { passageId } = req.params;
    const { content, is_ending } = req.body;

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

    // Admins can edit passages from any story.
    const isAdmin = req.user.role === "admin";

    // Regular users can edit passages only from their own stories.
    const isOwner =
      passage.creator_id !== null &&
      Number(passage.creator_id) === Number(req.user.id);

    if (!isAdmin && !isOwner) {
      return res.status(403).json({
        error: "You may only edit passages from your own stories",
      });
    }

    const fields = [];
    const values = [];
    let paramIndex = 1;

    if (content !== undefined) {
      fields.push(`content = $${paramIndex}`);
      values.push(content);
      paramIndex += 1;
    }
    if (is_ending !== undefined) {
      fields.push(`is_ending = $${paramIndex}`);
      values.push(is_ending);
      paramIndex += 1;
    }

    if (fields.length === 0) {
      return res.status(400).json({
        error: "No fields provided to update",
      });
    }

    values.push(passageId);

    const result = await pool.query(
      `UPDATE passages
       SET ${fields.join(", ")}
       WHERE id = $${paramIndex}
       RETURNING *;`,
      values,
    );

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error updating passage:", error);

    res.status(500).json({
      error: "Failed to update passage",
    });
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

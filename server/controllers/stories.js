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

    const result = await pool.query("SELECT * FROM stories WHERE id = $1;", [
      id,
    ]);

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
    const { title, description, cover_image_url } = req.body;
    const creatorId = req.user.id;

    if (!title || !description) {
      return res
        .status(400)
        .json({ error: "Title and description are required" });
    }

    const result = await pool.query(
      `INSERT INTO stories (title, description, creator_id, cover_image_url)
       VALUES ($1, $2, $3, $4)
       RETURNING *;`,
      [title, description, creatorId, cover_image_url || null],
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

    const isAdmin = req.user.role === "admin";

    const isOwner =
      story.creator_id !== null &&
      Number(story.creator_id) === Number(req.user.id);

    if (!isAdmin && !isOwner) {
      return res.status(403).json({
        error: "You may only delete your own stories",
      });
    }

    const result = await pool.query(
      `DELETE FROM stories
       WHERE id = $1
       RETURNING *;`,
      [id],
    );

    res.status(200).json({
      message: "Story deleted",
      story: result.rows[0],
    });
  } catch (error) {
    console.error("Error deleting story:", error);
    res.status(500).json({
      error: "Failed to delete story",
    });
  }
};

export const updateStory = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    // Find the story before updating it so we can verify ownership.
    const storyResult = await pool.query(
      `SELECT id, creator_id
       FROM stories
       WHERE id = $1;`,
      [id],
    );

    if (storyResult.rows.length === 0) {
      return res.status(404).json({ error: "Story not found" });
    }

    const story = storyResult.rows[0];

    // Admins can edit any story.
    const isAdmin = req.user.role === "admin";

    // Regular users can edit only stories they created.
    const isOwner =
      story.creator_id !== null &&
      Number(story.creator_id) === Number(req.user.id);

    if (!isAdmin && !isOwner) {
      return res.status(403).json({
        error: "You may only edit your own stories",
      });
    }

    // creator_id is intentionally excluded so users cannot change
    // the ownership of a story through an update request.
    const { title, description, start_passage_id, cover_image_url } = req.body;

    // Only update fields that were actually sent -- the previous
    // version always overwrote all three, which meant omitting
    // Story ownership is handled separately and cannot be changed here.
    const fields = [];
    const values = [];
    let paramIndex = 1;

    const maybeAdd = (column, value) => {
      if (value !== undefined) {
        fields.push(`${column} = $${paramIndex}`);
        values.push(value);
        paramIndex += 1;
      }
    };

    maybeAdd("title", title);
    maybeAdd("description", description);
    maybeAdd("start_passage_id", start_passage_id);
    maybeAdd("cover_image_url", cover_image_url);

    if (fields.length === 0) {
      return res.status(400).json({
        error: "No fields provided to update",
      });
    }

    values.push(id);

    const result = await pool.query(
      `UPDATE stories
       SET ${fields.join(", ")}
       WHERE id = $${paramIndex}
       RETURNING *;`,
      values,
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Story not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error updating story:", error);
    res.status(500).json({ error: "Failed to update story" });
  }
};

const canModifyStory = (story, user) => {
  // Permission check: admin OR owner
  const isAdmin = user.role === "admin";
  const isOwner =
    story.creator_id !== null &&
    Number(story.creator_id) === Number(user.id);
  return isAdmin || isOwner;
};

export const publishStory = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch story first
    const storyResult = await pool.query(
      `SELECT * FROM stories WHERE id = $1`,
      [id],
    );

    if (storyResult.rows.length === 0) {
      return res.status(404).json({ error: "Story not found" });
    }

    const story = storyResult.rows[0];

    // Permission check
    if (!canModifyStory(story, req.user)) {
      return res
        .status(403)
        .json({ error: "Not authorized to publish this story" });
    }

    const result = await pool.query(
      `UPDATE stories
       SET published = TRUE
       WHERE id = $1
       RETURNING *`,
      [id],
    );

    res.status(200).json({
      message: "Story published",
      story: result.rows[0],
    });
  } catch (error) {
    console.error("Error publishing story:", error);
    res.status(500).json({ error: "Failed to publish story" });
  }
};

export const unpublishStory = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch story first
    const storyResult = await pool.query(
      `SELECT * FROM stories WHERE id = $1`,
      [id],
    );

    if (storyResult.rows.length === 0) {
      return res.status(404).json({ error: "Story not found" });
    }

    const story = storyResult.rows[0];

    if (!canModifyStory(story, req.user)) {
      return res.status(403).json({
        error: "Not authorized to unpublish this story",
      });
    }

    // Update published state
    const result = await pool.query(
      `UPDATE stories
       SET published = FALSE
       WHERE id = $1
       RETURNING *`,
      [id],
    );

    res.status(200).json({
      message: "Story unpublished",
      story: result.rows[0],
    });
  } catch (error) {
    console.error("Error unpublishing story:", error);
    res.status(500).json({ error: "Failed to unpublish story" });
  }
};

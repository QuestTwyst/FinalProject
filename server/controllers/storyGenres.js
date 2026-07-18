import pool from "../config/database.js";

export const getGenresForStory = async (req, res) => {
  try {
    const { storyId } = req.params;

    const result = await pool.query(
      `
        SELECT
          genres.id,
          genres.name
        FROM story_genres
        JOIN genres
          ON story_genres.genre_id = genres.id
        WHERE story_genres.story_id = $1
        ORDER BY genres.name;
      `,
      [storyId]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error retrieving story genres:", error);

    res.status(500).json({
      error: "Unable to retrieve story genres",
    });
  }
};

export const addGenreToStory = async (req, res) => {
  try {
    const { storyId } = req.params;
    const { genre_id } = req.body;

    if (!genre_id) {
      return res.status(400).json({
        error: "genre_id is required",
      });
    }

    const result = await pool.query(
      `
        INSERT INTO story_genres (
          story_id,
          genre_id
        )
        VALUES ($1, $2)
        RETURNING *;
      `,
      [storyId, genre_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error assigning genre to story:", error);

    res.status(500).json({
      error: "Unable to assign genre to story",
    });
  }
};

export const removeGenreFromStory = async (req, res) => {
  try {
    const { storyId, genreId } = req.params;

    const result = await pool.query(
      `
        DELETE FROM story_genres
        WHERE story_id = $1
          AND genre_id = $2
        RETURNING *;
      `,
      [storyId, genreId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Story genre relationship not found",
      });
    }

    res.status(200).json({
      message: "Genre removed from story",
      relationship: result.rows[0],
    });
  } catch (error) {
    console.error("Error removing genre from story:", error);

    res.status(500).json({
      error: "Unable to remove genre from story",
    });
  }
};
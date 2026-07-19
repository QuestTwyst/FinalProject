import pool from "../config/database.js";

export const getGenres = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM genres
      ORDER BY name;
    `);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error retrieving genres:", error);

    res.status(500).json({
      error: "Unable to retrieve genres",
    });
  }
};

export const createGenre = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        error: "Genre name is required",
      });
    }

    const result = await pool.query(
      `
        INSERT INTO genres (name)
        VALUES ($1)
        RETURNING *;
      `,
      [name]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating genre:", error);

    res.status(500).json({
      error: "Unable to create genre",
    });
  }
};

export const deleteGenre = async (req, res) => {
  try {
    const { genreId } = req.params;

    const result = await pool.query(
      `
        DELETE FROM genres
        WHERE id = $1
        RETURNING *;
      `,
      [genreId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Genre not found",
      });
    }

    res.status(200).json({
      message: "Genre deleted successfully",
      genre: result.rows[0],
    });
  } catch (error) {
    console.error("Error deleting genre:", error);

    res.status(500).json({
      error: "Unable to delete genre",
    });
  }
};
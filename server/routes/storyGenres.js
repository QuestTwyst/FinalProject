import express from "express";
import {
  getGenresForStory,
  addGenreToStory,
  removeGenreFromStory,
} from "../controllers/storyGenres.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// Public: anyone can view a story's genres
router.get("/:storyId/genres", getGenresForStory);

// Admin only: add a genre to a story
router.post(
  "/:storyId/genres",
  requireAuth,
  requireAdmin,
  addGenreToStory,
);

// Admin only: remove a genre from a story
router.delete(
  "/:storyId/genres/:genreId",
  requireAuth,
  requireAdmin,
  removeGenreFromStory,
);

export default router;
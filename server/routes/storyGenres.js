import express from "express";
import {
  getGenresForStory,
  addGenreToStory,
  removeGenreFromStory,
} from "../controllers/storyGenres.js";

const router = express.Router();

router.get("/:storyId/genres", getGenresForStory);
router.post("/:storyId/genres", addGenreToStory);
router.delete(
  "/:storyId/genres/:genreId",
  removeGenreFromStory
);

export default router;
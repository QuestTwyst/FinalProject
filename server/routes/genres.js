import express from "express";
import {
  getGenres,
  createGenre,
  deleteGenre,
} from "../controllers/genres.js";

const router = express.Router();

router.get("/", getGenres);
router.post("/", createGenre);
router.delete("/:genreId", deleteGenre);

export default router;
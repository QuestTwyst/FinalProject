import express from "express";
import {
  getGenres,
  createGenre,
  deleteGenre,
} from "../controllers/genres.js";
import {
  requireAuth,
  requireAdmin,
} from "../middleware/auth.js";

const router = express.Router();

router.get("/", getGenres);
router.post(
  "/",
  requireAuth,
  requireAdmin,
  createGenre,
);

router.delete(
  "/:genreId",
  requireAuth,
  requireAdmin,
  deleteGenre,
);

export default router;
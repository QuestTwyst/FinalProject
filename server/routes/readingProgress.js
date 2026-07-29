import express from "express";
import {
  getReadingProgress,
  getAllReadingProgressForUser,
  createReadingProgress,
  updateReadingProgress,
  deleteReadingProgress,
} from "../controllers/readingProgress.js";

const router = express.Router();

router.get("/:userId/:storyId", getReadingProgress);
router.get("/:userId", getAllReadingProgressForUser);
router.post("/", createReadingProgress);
router.put("/:userId/:storyId", updateReadingProgress);
router.delete("/:userId/:storyId", deleteReadingProgress);

export default router;
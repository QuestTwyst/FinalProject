import express from "express";
import {
  getStoryHistory,
  createStoryHistory,
  deleteStoryHistory,
} from "../controllers/storyHistory.js";

const router = express.Router();

router.get("/:userId/:storyId", getStoryHistory);
router.post("/", createStoryHistory);
router.delete("/:userId/:storyId", deleteStoryHistory);

export default router;
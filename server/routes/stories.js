import express from "express";
import {
  getStories,
  getStoryById,
  createStory,
  deleteStory,
  updateStory,
  publishStory,
  unpublishStory,
} from "../controllers/stories.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// Public reading routes
router.get("/", getStories);
router.get("/:id", getStoryById);

// Admin-only management routes

router.post("/", requireAuth, createStory);

router.patch("/:id", requireAuth, updateStory);

router.delete("/:id", requireAuth, deleteStory);

// Custom action routes
router.post("/:id/publish", requireAuth, publishStory);
router.post("/:id/unpublish", requireAuth, unpublishStory);

export default router;

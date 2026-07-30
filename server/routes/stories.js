import express from "express";
import {
  getStories,
  getStoryById,
  createStory,
  deleteStory,
  updateStory,
} from "../controllers/stories.js";
import {
  requireAuth,
  requireAdmin,
} from "../middleware/auth.js";

const router = express.Router();

// Public reading routes
router.get("/", getStories);
router.get("/:id", getStoryById);



// Admin-only management routes
//removed: requireAdmin,
router.post(
  "/",
  requireAuth,
  createStory,
);

router.patch(
  "/:id",
  requireAuth,
  requireStoryOwnerOrAdmin,
  updateStory,
);

router.delete(
  "/:id",
  requireAuth,
  requireStoryOwnerOrAdmin,
  deleteStory,
);

export default router;
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

router.post(
  "/",
  requireAuth,
  createStory,
);

router.patch(
  "/:id",
  requireAuth,
   requireAdmin,
  updateStory,
);

router.delete(
  "/:id",
  requireAuth,
   requireAdmin,
  deleteStory,
);

export default router;
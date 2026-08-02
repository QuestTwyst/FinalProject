import express from "express";
import {
  getChoicesByPassage,
  createChoice,
  updateChoice,
  deleteChoice,
} from "../controllers/choices.js";
import {
  requireAuth,
  requireStoryOwnerOrAdmin,
} from "../middleware/auth.js";

const router = express.Router();

// Public reading route
router.get("/:passageId/choices", getChoicesByPassage);

// Authenticated story owner or admin management routes
router.post(
  "/:passageId/choices",
  requireAuth,
  requireStoryOwnerOrAdmin,
  createChoice,
);

router.patch(
  "/choices/:choiceId",
  requireAuth,
  requireStoryOwnerOrAdmin,
  updateChoice,
);

router.delete(
  "/choices/:choiceId",
  requireAuth,
  requireStoryOwnerOrAdmin,
  deleteChoice,
);

export default router;
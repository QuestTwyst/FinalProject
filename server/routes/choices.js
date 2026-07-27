import express from "express";
import {
  getChoicesByPassage,
  createChoice,
  updateChoice,
  deleteChoice,
} from "../controllers/choices.js";
import {
  requireAuth,
  requireAdmin,
} from "../middleware/auth.js";

const router = express.Router();

// Public reading route
router.get("/:passageId/choices", getChoicesByPassage);

// Admin-only management routes
router.post(
  "/:passageId/choices",
  requireAuth,
  requireAdmin,
  createChoice,
);

router.patch(
  "/choices/:choiceId",
  requireAuth,
  requireAdmin,
  updateChoice,
);

router.delete(
  "/choices/:choiceId",
  requireAuth,
  requireAdmin,
  deleteChoice,
);

export default router;
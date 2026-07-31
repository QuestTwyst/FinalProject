import express from "express";
import {
  getChoicesByPassage,
  createChoice,
  updateChoice,
  deleteChoice,
} from "../controllers/choices.js";
import {
  requireAuth,
} from "../middleware/auth.js";

const router = express.Router();

// Public reading route
router.get("/:passageId/choices", getChoicesByPassage);

// Authenticated story owner or admin management routes
router.post(
  "/:passageId/choices",
  requireAuth,
  createChoice,
);

router.patch(
  "/choices/:choiceId",
  requireAuth,
  updateChoice,
);

router.delete(
  "/choices/:choiceId",
  requireAuth,
  deleteChoice,
);

export default router;
import express from "express";
import {
  getPassagesByStory,
  getPassageById,
  createPassage,
  deletePassage,
  updatePassage,
} from "../controllers/passages.js";
import {
  requireAuth,
  requireAdmin,
} from "../middleware/auth.js";

const router = express.Router();

// Public reading routes
router.get("/:id/passages", getPassagesByStory);
router.get("/passages/:passageId", getPassageById);

// Admin-only management routes
router.post(
  "/:id/passages",
  requireAuth,
  requireAdmin,
  createPassage,
);

router.delete(
  "/passages/:passageId",
  requireAuth,
  requireAdmin,
  deletePassage,
);

router.patch(
  "/passages/:passageId",
  requireAuth,
  requireAdmin,
  updatePassage,
);

export default router;
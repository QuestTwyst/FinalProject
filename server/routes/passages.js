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
} from "../middleware/auth.js";

const router = express.Router();

// Public reading routes
router.get("/:id/passages", getPassagesByStory);
router.get("/passages/:passageId", getPassageById);

// Admin-only management routes
router.post(
  "/:id/passages",
  requireAuth,
  createPassage,
);

router.delete(
  "/passages/:passageId",
  requireAuth,
  deletePassage,
);

router.patch(
  "/passages/:passageId",
  requireAuth,
  updatePassage,
);

export default router;
import express from "express";
import {
  getPassagesByStory,
  getPassageById,
  createPassage,
  deletePassage,
  updatePassage,
} from "../controllers/passages.js";

const router = express.Router();

router.get("/:id/passages", getPassagesByStory);
router.post("/:id/passages", createPassage);
router.get("/passages/:passageId", getPassageById);
router.delete("/passages/:passageId", deletePassage);
router.patch("/passages/:passageId", updatePassage);

export default router;

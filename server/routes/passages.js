import express from "express";
import {
  getPassagesByStory,
  createPassage,
  deletePassage,
} from "../controllers/passages.js";

const router = express.Router();

router.get("/:id/passages", getPassagesByStory);
router.post("/:id/passages", createPassage);
router.delete("/passages/:passageId", deletePassage);

export default router;

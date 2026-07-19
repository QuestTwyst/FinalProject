import express from "express";
import { getPassagesByStory, createPassage } from "../controllers/passages.js";

const router = express.Router();

router.get("/:id/passages", getPassagesByStory);
router.post("/:id/passages", createPassage);

export default router;

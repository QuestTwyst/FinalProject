import express from "express";
import { getChoicesByPassage, createChoice } from "../controllers/choices.js";

const router = express.Router();

router.get("/:passageId/choices", getChoicesByPassage);
router.post("/:passageId/choices", createChoice);

export default router;

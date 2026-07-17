import express from "express";
import { getStories, getStoryById, createStory } from "../controllers/stories.js";

const router = express.Router();

router.get("/", getStories);
router.get("/:id", getStoryById);
router.post("/", createStory);

export default router;
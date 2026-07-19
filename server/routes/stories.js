import express from "express";
import { getStories, getStoryById, createStory, deleteStory } from "../controllers/stories.js";

const router = express.Router();

router.get("/", getStories);
router.get("/:id", getStoryById);
router.post("/", createStory);
router.delete("/:id", deleteStory);

export default router;
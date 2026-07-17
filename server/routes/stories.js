import express from "express";
import { getStories, getStoryById } from "../controllers/stories.js";

const router = express.Router();

router.get("/", getStories);
router.get("/:id", getStoryById);

export default router;
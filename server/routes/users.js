import express from "express";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/users.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// Only admins should list all users
router.get("/", requireAuth, requireAdmin, getUsers);

// Any logged-in user can view their own profile
router.get("/:userId", requireAuth, getUserById);

// Creating users is public (signup)
router.post("/", createUser);

// Only logged-in users can update their own profile
router.patch("/:userId", requireAuth, updateUser);

// Only logged-in users can delete their own profile
router.delete("/:userId", requireAuth, deleteUser);

export default router;

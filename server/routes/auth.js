import express from "express";
import { login, resetPassword } from "../controllers/auth.js";

const router = express.Router();

router.post("/login", login);
router.post("/password-reset", resetPassword);

export default router;
import express from "express";
import {
  register,
  login,
  refresh,
  logout,
} from "../controllers/authController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", verifyToken, logout);

export default router;

import express from "express";
import {
  getAllCourses,
  getCourseById,
  createCourse,
  deleteCourse,
} from "../controllers/courseController.js";
import { verifyToken, isAdmin } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getAllCourses);
router.get("/:id", getCourseById);
router.post("/", verifyToken, isAdmin, createCourse);
router.delete("/:id", verifyToken, isAdmin, deleteCourse);

export default router;

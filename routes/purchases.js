import express from "express";
import {
  purchaseCourse,
  getMyPurchases,
} from "../controllers/purchaseController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/", verifyToken, purchaseCourse);
router.get("/", verifyToken, getMyPurchases);

export default router;

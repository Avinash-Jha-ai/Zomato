import express from "express";
import {
  getDashboardStats,
  getAllOrders,
  updateOrderStatus
} from "../controllers/admin.controller.js";

import { isAdmin, authenticateUser } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/stats", authenticateUser, isAdmin, getDashboardStats);
router.get("/orders", authenticateUser, isAdmin, getAllOrders);
router.put("/order/:id", authenticateUser, isAdmin, updateOrderStatus);

export default router;
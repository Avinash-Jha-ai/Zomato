import express from "express";
import {
  getDashboardStats,
  getAllOrders,
  updateOrderStatus
} from "../controllers/admin.controller.js";

import { isAdmin } from "../middlewares/admin.middleware.js";

const router = express.Router();

router.get("/stats", isAdmin, getDashboardStats);
router.get("/orders", isAdmin, getAllOrders);
router.put("/order/:id", isAdmin, updateOrderStatus);

export default router;
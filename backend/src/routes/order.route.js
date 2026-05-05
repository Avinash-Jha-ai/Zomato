import { Router } from "express";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import {
  createOrder,
  verifyPayment,
  getUserOrders,
} from "../controllers/order.controller.js";

const router = Router();

router.post("/create-order",authenticateUser, createOrder);
router.post("/verify-payment",authenticateUser, verifyPayment);
router.get("/my-orders", authenticateUser, getUserOrders);

export default router;
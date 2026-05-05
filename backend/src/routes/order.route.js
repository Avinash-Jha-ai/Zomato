import { Router } from "express";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import {
  createOrder,
  verifyPayment,
} from "../controllers/order.controller.js";

const router = Router();

router.post("/create-order",authenticateUser, createOrder);
router.post("/verify-payment",authenticateUser, verifyPayment);

export default router;
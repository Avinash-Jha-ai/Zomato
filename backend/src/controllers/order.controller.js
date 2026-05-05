import Order from "../models/order.model.js";
import { createRazorpayOrder } from "../services/payment.service.js";
import { verifyPaymentSignature } from "../utils/verifySignature.js";

export const createOrder = async (req, res) => {
  try {
    const { items, totalAmount } = req.body;

    const razorpayOrder = await createRazorpayOrder(totalAmount);

    const order = await Order.create({
      user: req.user._id,
      items,
      totalAmount,
      razorpayOrderId: razorpayOrder.id,
    });

    res.json({
      success: true,
      order,
      razorpayOrder,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const isValid = verifyPaymentSignature({
      order_id: razorpay_order_id,
      payment_id: razorpay_payment_id,
      signature: razorpay_signature,
    });

    if (!isValid) {
      return res.status(400).json({ success: false });
    }

    await Order.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      {
        status: "confirmed",
        razorpayPaymentId: razorpay_payment_id,
      }
    );

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
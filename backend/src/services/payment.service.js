import { razorpayInstance } from "../configs/razorpay.js";

export const createRazorpayOrder = async (amount) => {
  const options = {
    amount: amount * 100,
    currency: "INR",
    receipt: "receipt_" + Date.now(),
  };

  const order = await razorpayInstance.orders.create(options);
  return order;
};
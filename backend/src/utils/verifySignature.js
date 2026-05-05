import crypto from "crypto";

export const verifyPaymentSignature = ({
  order_id,
  payment_id,
  signature,
}) => {
  const body = order_id + "|" + payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body)
    .digest("hex");

  return expectedSignature === signature;
};
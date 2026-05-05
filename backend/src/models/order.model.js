import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  items: [
    {
      name: String,
      price: Number,
      quantity: Number
    }
  ],

  totalAmount: Number,

  status: {
    type: String,
    enum: [
      "pending",
      "confirmed",
      "preparing",
      "out_for_delivery",
      "delivered",
      "cancelled"
    ],
    default: "pending"
  }

}, { timestamps: true });

const orderModel =mongoose.model("order",orderSchema);

export default orderModel
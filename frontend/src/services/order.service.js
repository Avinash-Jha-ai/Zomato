import API from "../utils/axios.js";

export const createOrder = async ({ items, totalAmount }) => {
  const response = await API.post("/create-order", {
    items,
    totalAmount,
  });
  return response.data;
};

export const verifyPayment = async (data) => {
  const response = await API.post("/verify-payment", data);
  return response.data;
};
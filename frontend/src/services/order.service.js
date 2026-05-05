import API from "../utils/axios.js";

export const createOrder = async ({ items, totalAmount }) => {
  const response = await API.post("/order/create-order", {
    items,
    totalAmount,
  });
  return response.data;
};

export const verifyPayment = async (data) => {
  const response = await API.post("/order/verify-payment", data);
  return response.data;
};

export const getMyOrders = async () => {
  const response = await API.get("/order/my-orders");
  return response.data;
};
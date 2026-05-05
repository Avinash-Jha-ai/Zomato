import API from "../utils/axios.js";

export const addToCart = async (productId) => {
  const response = await API.post(`/cart/add/${productId}`);
  return response.data;
};

export const getCart = async () => {
  const response = await API.get("/cart/");
  return response.data;
};

export const deleteProductFromCart = async (productId) => {
  const response = await API.delete(`/cart/delete/${productId}`);
  return response.data;
};

export const clearCart = async () => {
  const response = await API.delete("/cart/clear");
  return response.data;
};

export const updateQuantity = async (productId, change) => {
  const response = await API.put(`/cart/update/${productId}`, { change });
  return response.data;
};
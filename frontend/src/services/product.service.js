import API from "../utils/axios.js";

export const getAllProducts = async () => {
  const response = await API.get("/product/");
  return response.data;
};

export const getProduct = async (productId) => {
  const response = await API.get(`/product/${productId}`);
  return response.data;
};

export const getVegProducts = async () => {
  const response = await API.get("/product/veg");
  return response.data;
};

export const getNonVegProducts = async () => {
  const response = await API.get("/product/nonVeg");
  return response.data;
};
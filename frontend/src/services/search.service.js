import API from "../utils/axios.js";

export const searchProducts = async (filters) => {
  const response = await API.get("/search", {
    params: filters,
  });
  return response.data;
};
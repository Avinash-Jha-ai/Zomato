import { useDispatch } from "react-redux";
import {
  setProducts,
  setProduct,
  setLoading,
  setError,
} from "../states/product.slice";

// services
import {
  getAllProducts,
  getProduct,
  getVegProducts,
  getNonVegProducts,
} from "../services/product.service";

import { searchProducts } from "../services/search.service";

export const useProduct = () => {
  const dispatch = useDispatch();

  const handleGetProducts = async () => {
    try {
      dispatch(setLoading(true));

      const data = await getAllProducts();
      dispatch(setProducts(data.products));

    } catch (error) {
      dispatch(setError(error.response?.data?.message || error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleGetProduct = async (productId) => {
    try {
      dispatch(setLoading(true));

      const data = await getProduct(productId);
      dispatch(setProduct(data.product));

    } catch (error) {
      dispatch(setError(error.response?.data?.message || error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleGetVeg = async () => {
    try {
      dispatch(setLoading(true));

      const data = await getVegProducts();
      dispatch(setProducts(data.products));

    } catch (error) {
      dispatch(setError(error.response?.data?.message || error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleGetNonVeg = async () => {
    try {
      dispatch(setLoading(true));

      const data = await getNonVegProducts();
      dispatch(setProducts(data.products));

    } catch (error) {
      dispatch(setError(error.response?.data?.message || error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return {
    handleGetProducts,
    handleGetProduct,
    handleGetVeg,
    handleGetNonVeg,
  };
};
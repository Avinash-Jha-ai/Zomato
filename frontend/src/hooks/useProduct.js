import { useDispatch, useSelector } from "react-redux";
import {
  setProducts,
  setAllProducts,
  setVegProducts,
  setNonVegProducts,
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
  const { allProducts, vegProducts, nonVegProducts } = useSelector(s => s.product);

  const handleGetProducts = async (isSilent = false) => {
    try {
      if (!isSilent) dispatch(setLoading(true));
      const data = await getAllProducts();
      dispatch(setAllProducts(data.products));
      dispatch(setProducts(data.products));
    } catch (error) {
      if (!isSilent) dispatch(setError(error.response?.data?.message || error.message));
    } finally {
      if (!isSilent) dispatch(setLoading(false));
    }
  };

  const handleGetVeg = async (isSilent = false) => {
    try {
      if (!isSilent) dispatch(setLoading(true));
      const data = await getVegProducts();
      dispatch(setVegProducts(data.products));
      dispatch(setProducts(data.products));
    } catch (error) {
      if (!isSilent) dispatch(setError(error.response?.data?.message || error.message));
    } finally {
      if (!isSilent) dispatch(setLoading(false));
    }
  };

  const handleGetNonVeg = async (isSilent = false) => {
    try {
      if (!isSilent) dispatch(setLoading(true));
      const data = await getNonVegProducts();
      dispatch(setNonVegProducts(data.products));
      dispatch(setProducts(data.products));
    } catch (error) {
      if (!isSilent) dispatch(setError(error.response?.data?.message || error.message));
    } finally {
      if (!isSilent) dispatch(setLoading(false));
    }
  };

  const handlePrefetch = async () => {
    // Silently load all categories in background
    getAllProducts().then(d => dispatch(setAllProducts(d.products))).catch(() => {});
    getVegProducts().then(d => dispatch(setVegProducts(d.products))).catch(() => {});
    getNonVegProducts().then(d => dispatch(setNonVegProducts(d.products))).catch(() => {});
  };

  return {
    handleGetProducts,
    handleGetProduct: async (id) => {
      try {
        dispatch(setLoading(true));
        const data = await getProduct(id);
        dispatch(setProduct(data.product));
      } catch (e) {
        dispatch(setError(e.response?.data?.message || e.message));
      } finally {
        dispatch(setLoading(false));
      }
    },
    handleGetVeg,
    handleGetNonVeg,
    handlePrefetch,
  };
};
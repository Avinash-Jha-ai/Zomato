import { useDispatch } from "react-redux";
import {
  setSearchResult,
  setLoading,
  setError,
  clearSearch,
} from "../states/search.slice.js";

import { searchProducts } from "../services/search.service.js";

export const useSearch = () => {
  const dispatch = useDispatch();

  const handleSearch = async (filters) => {
    try {
      dispatch(setLoading(true));

      const data = await searchProducts(filters);

      dispatch(setSearchResult(data));

    } catch (error) {
      dispatch(setError(error.response?.data?.message || error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleClearSearch = () => {
    dispatch(clearSearch());
  };

  return {
    handleSearch,
    handleClearSearch,
  };
};
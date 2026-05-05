import { createSlice } from "@reduxjs/toolkit";

const searchSlice = createSlice({
  name: "search",

  initialState: {
    results: [],        // 🔥 rename (clear meaning)
    loading: false,
    error: null,
    total: 0,
  },

  reducers: {
    // 🔹 SET SEARCH RESULT
    setSearchResult: (state, action) => {
      state.results = action.payload.products;
      state.total = action.payload.totalProducts;
      state.error = null;
    },

    // 🔹 LOADING
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    // 🔹 ERROR
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    // 🔹 CLEAR SEARCH
    clearSearch: (state) => {
      state.results = [];
      state.total = 0;
      state.error = null;
    },
  },
});

export const {
  setSearchResult,
  setLoading,
  setError,
  clearSearch,
} = searchSlice.actions;

export default searchSlice.reducer;
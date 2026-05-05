import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name: "product",
  initialState: {
    products: [],
    allProducts: [],
    vegProducts: [],
    nonVegProducts: [],
    product: null,
    loading: true,
    error: null
  },
  reducers: {
    setProducts: (state, action) => { state.products = action.payload; },
    setAllProducts: (state, action) => { state.allProducts = action.payload; },
    setVegProducts: (state, action) => { state.vegProducts = action.payload; },
    setNonVegProducts: (state, action) => { state.nonVegProducts = action.payload; },
    setProduct: (state, action) => { state.product = action.payload; },
    setLoading: (state, action) => { state.loading = action.payload; },
    setError: (state, action) => { state.error = action.payload; },
  }
});

export const { 
  setProducts, setAllProducts, setVegProducts, 
  setNonVegProducts, setProduct, setLoading, setError 
} = productSlice.actions;
export default productSlice.reducer;
import { createSlice } from "@reduxjs/toolkit";

const orderSlice = createSlice({
  name: "order",
  initialState: {
    currentOrder: null,    
    razorpayOrder: null,    
    loading: false,
    error: null,
    success: false,
    orders: [],
  },
  reducers: {
    setOrders: (state, action) => {
      state.orders = action.payload;
    },
    setOrder: (state, action) => {
      state.currentOrder = action.payload.order;
      state.razorpayOrder = action.payload.razorpayOrder;
    },
    setSuccess: (state, action) => {
      state.success = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    resetOrderState: (state) => {
      state.currentOrder = null;
      state.razorpayOrder = null;
      state.success = false;
      state.error = null;
    },
  },
});

export const {
  setOrders,
  setOrder,
  setSuccess,
  setLoading,
  setError,
  resetOrderState,
} = orderSlice.actions;

export default orderSlice.reducer;
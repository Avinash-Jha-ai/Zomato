import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",

  initialState: {
    cartItems: [],
    loading: false,
    error: null,
  },

  reducers: {
    setCart: (state, action) => {
      state.cartItems = action.payload;
    },
    addItem: (state, action) => {
      const existing = state.cartItems.find(
        (item) => item.product._id === action.payload.product._id
      );

      if (existing) {
        existing.quantity += 1;
      } else {
        state.cartItems.push(action.payload);
      }
    },

    removeItem: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (item) => item.product._id !== action.payload
      );
    },

    clearCartState: (state) => {
      state.cartItems = [];
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setCart,
  addItem,
  removeItem,
  clearCartState,
  setLoading,
  setError,
} = cartSlice.actions;

export default cartSlice.reducer;
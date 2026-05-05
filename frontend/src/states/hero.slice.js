import { createSlice } from "@reduxjs/toolkit";

const heroSlice = createSlice({
  name: "hero",
  initialState: {
    hero: [],
    loading: false,
    error: null
  },
  reducers: {
    setHero: (state, action) => { state.hero = action.payload; },
    setLoading: (state, action) => { state.loading = action.payload; },
    setError: (state, action) => { state.error = action.payload; }
  }
});

export const { setHero, setLoading, setError } = heroSlice.actions;
export default heroSlice.reducer;
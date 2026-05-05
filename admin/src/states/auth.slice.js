import { createSlice } from '@reduxjs/toolkit';
const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, isAuthenticated: false, loading: true, error: null },
  reducers: {
    setUser: (s, a) => { s.user = a.payload; s.isAuthenticated = true; },
    logoutUser: (s) => { s.user = null; s.isAuthenticated = false; },
    setLoading: (s, a) => { s.loading = a.payload; },
    setError: (s, a) => { s.error = a.payload; },
  }
});
export const { setUser, logoutUser, setLoading, setError } = authSlice.actions;
export default authSlice.reducer;

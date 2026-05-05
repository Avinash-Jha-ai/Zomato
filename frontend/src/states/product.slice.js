import { createSlice } from "@reduxjs/toolkit";

const productSlice =createSlice({
    name:"product",
    initialState:{
        products:[],
        product:null,
        loading:true,
        error:null
    },
    reducers:{
        setProducts :(state,action)=>{
            state.products=action.payload
        },

        setProduct:(state,action)=>{
            state.products=action.payload
        },

        setLoading: (state, action) => {
            state.loading = action.payload;
        },

        setError: (state, action) => {
            state.error = action.payload;
        },
    }
})

export const {
  setProducts,
  setProduct,
  setLoading,
  setError,
} = productSlice.actions;

export default productSlice.reducer;
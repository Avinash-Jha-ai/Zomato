import API from "../utils/axios.js";

export const addToCart =async (product)=>{
    const response=await API.get(`/cart/add/${product}`);
    return response.data
}

export const getCart =async ()=>{
    const response =await API.get("/cart/");
    return response.data
}

export const deleteProductFromCart =async (product)=>{
    const response=await API.get(`/cart/delete/${product}`);
    return response.data
}

export const clearCart =async ()=>{
    const response =await API.get("/cart/clear");
    return response.data
}
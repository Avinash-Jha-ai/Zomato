import API from "../utils/axios.js";

export const getHeroSection =async ()=>{
    const response =await API.get("/hero/");
    return response.data
}
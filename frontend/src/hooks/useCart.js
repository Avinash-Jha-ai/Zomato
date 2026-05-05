import  {setCart,addItem,removeItem,clearCartState,setLoading,setError} from "../states/cart.slice.js"
import {addToCart,getCart,deleteProductFromCart,clearCart} from "../services/cart.service.js"
import { useDispatch } from "react-redux"
export const useCart =()=>{
    const dispatch=useDispatch();

    const handleAddToCart =async (product)=>{
        const data =await addToCart(product);
        dispatch(addItem(data.cartItem));
    }

    const handleGetCart =async ()=>{
        try{
            dispatch(setLoading(true));
            const data =await getCart();
            dispatch(setCart(data.cartItem));
        }catch(error){
            console.log(error)
        }finally{
            dispatch(setLoading(false));
        }
    }

    const handleDeleteProductFromCart =async (product)=>{
        await deleteProductFromCart(product);
        dispatch(removeItem(product));
    }

    const handleClearCart = async ()=>{
        await clearCart();
        dispatch(clearCartState());
    }


    return {handleAddToCart,handleClearCart,handleDeleteProductFromCart,handleGetCart};
}
import  {setCart,addItem,removeItem,clearCartState,setLoading,setError} from "../states/cart.slice.js"
import {addToCart,getCart,deleteProductFromCart,clearCart, updateQuantity} from "../services/cart.service.js"
import { useDispatch } from "react-redux"

export const useCart = () => {
    const dispatch=useDispatch();

    const handleAddToCart =async (product)=>{
        const data =await addToCart(product);
        dispatch(addItem(data.cartItem));
    }

    const handleGetCart =async ()=>{
        try{
            dispatch(setLoading(true));
            const data =await getCart();
            dispatch(setCart(data.cartItems));

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

    const handleUpdateQuantity = async (productId, change) => {
        try {
            await updateQuantity(productId, change);
            const data = await getCart(); // Refresh cart
            dispatch(setCart(data.cartItems));
        } catch (error) {
            console.log(error);
        }
    }

    return {handleAddToCart,handleClearCart,handleDeleteProductFromCart,handleGetCart, handleUpdateQuantity};
}
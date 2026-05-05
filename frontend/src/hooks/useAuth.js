import {setUser,setError,setLoading} from "../states/auth.slice.js"
import { register,login,logout,getMe } from "../services/auth.service.js"
import { useDispatch } from "react-redux"

export const useAuth =()=>{
    const dispatch =useDispatch();

    const handleRegister =async ({email,username,password})=>{
        const data =await register({username,email,password});
        dispatch(setUser(data.user));

        return data.user;

    }

    const handleLogin =async ({email,password})=>{
        const data =await login({email,password});
        dispatch(setUser(data.user));
        return data.user
    }

    const handleGetMe =async ()=>{
        try{
            dispatch(setLoading(true));
            const data=await getMe();
            dispatch(setUser(data.user));
        }catch(error){
            console.log(error)
        }finally{
            dispatch(setLoading(false));
        }
    }

    const handleLogout = async () => {
        try {
            dispatch(setLoading(true));

            await logout();

            dispatch(logoutUser());

        } catch (error) {
            dispatch(setError(error.message));
        } finally {
            dispatch(setLoading(false));
        }
    };

    return {handleGetMe,handleLogin,handleRegister,handleLogout}
}
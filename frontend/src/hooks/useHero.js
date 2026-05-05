import {getHeroSection} from "../services/hero.service.js";
import {setHero,setLoading,setError} from "../states/hero.slice.js";
import { useDispatch } from "react-redux";

const useHero =()=>{
    const dispatch =useDispatch();

    const handleGetHero=async ()=>{
        try{
            dispatch(setLoading(true));
            const data =await getHeroSection();
            dispatch(setHero(data.hero));
        }catch(error){
            console.log(error);
        }finally{
            dispatch(setLoading(false))
        }
    }

    return{handleGetHero}
}
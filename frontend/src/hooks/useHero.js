import { getHeroSection } from "../services/hero.service.js";
import { setHero, setLoading, setError } from "../states/hero.slice.js";
import { useDispatch } from "react-redux";

export const useHero = () => {
  const dispatch = useDispatch();

  const handleGetHero = async () => {
    try {
      dispatch(setLoading(true));
      const data = await getHeroSection();
      dispatch(setHero(data.hero));
    } catch (error) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return { handleGetHero };
};
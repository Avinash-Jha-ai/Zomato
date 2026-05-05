import { RouterProvider } from 'react-router-dom';
import router from './app.route';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUser, setLoading } from '../states/auth.slice';
import API from '../utils/axios';

function AppInner() {
  const dispatch = useDispatch();

  useEffect(() => {
    const init = async () => {
      try {
        const { data } = await API.get('/auth/me');
        if (data.user && data.user.role === 'admin') {
          dispatch(setUser(data.user));
        }
      } catch (err) {
        // Silent fail
      } finally {
        dispatch(setLoading(false));
      }
    };
    init();
  }, [dispatch]);

  return <RouterProvider router={router} />;
}

export default function App() {
  return <AppInner />;
}

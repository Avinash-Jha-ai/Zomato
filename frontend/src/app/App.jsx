import { RouterProvider } from 'react-router-dom';
import router from './app.route';
import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

function AppInner() {
  const { handleGetMe } = useAuth();
  useEffect(() => { handleGetMe(); }, []);
  return <RouterProvider router={router} />;
}

export default function App() {
  return <AppInner />;
}
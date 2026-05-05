import { createBrowserRouter, Navigate } from 'react-router-dom';
import AdminLogin from '../pages/Login';
import AdminLayout from '../components/AdminLayout';
import Dashboard from '../pages/Dashboard';
import Products from '../pages/Products';
import Orders from '../pages/Orders';
import HeroManager from '../pages/HeroManager';
import AdminRegister from '../pages/AdminRegister';

const router = createBrowserRouter([
  { path: '/login', element: <AdminLogin /> },
  {
    element: <AdminLayout />,
    children: [
      { path: '/', element: <Dashboard /> },
      { path: '/products', element: <Products /> },
      { path: '/orders', element: <Orders /> },
      { path: '/hero', element: <HeroManager /> },
      { path: '/register-admin', element: <AdminRegister /> },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
]);

export default router;

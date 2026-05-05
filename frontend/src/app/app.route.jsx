import { createBrowserRouter } from 'react-router-dom';
import Home from '../pages/Home';
import AboutUs from '../pages/AboutUs';
import PrivacyPolicy from '../pages/PrivacyPolicy';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ProductDetail from '../pages/ProductDetail';
import Profile from '../pages/Profile';
import Cart from '../pages/Cart';
import OrderHistory from '../pages/OrderHistory';
import ErrorPage from '../pages/ErrorPage';
import ProtectedRoute from '../components/ProtectedRoute';

const router = createBrowserRouter([
  {
    path: '/',
    errorElement: <ErrorPage />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/about', element: <AboutUs /> },
      { path: '/privacy', element: <PrivacyPolicy /> },
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> },
      { path: '/product/:id', element: <ProductDetail /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: '/profile', element: <Profile /> },
          { path: '/cart', element: <Cart /> },
          { path: '/orders', element: <OrderHistory /> },
        ],
      },
    ],
  },
]);

export default router;
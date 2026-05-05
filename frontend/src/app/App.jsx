import { RouterProvider } from 'react-router-dom';
import router from './app.route';
import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import ErrorBoundary from '../components/ErrorBoundary';

function AppInner() {
  const { handleGetMe } = useAuth();
  useEffect(() => { handleGetMe(); }, []);
  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
}

export default function App() {
  return <AppInner />;
}
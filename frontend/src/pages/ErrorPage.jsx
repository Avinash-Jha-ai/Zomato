import { useRouteError, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function ErrorPage() {
  const error = useRouteError();
  const navigate = useNavigate();
  console.error(error);

  return (
    <div className="page">
      <Navbar />
      <main className="container section" style={{ textAlign: 'center', padding: '100px 20px' }}>
        <div style={{ fontSize: 64, marginBottom: 24 }}>🥘</div>
        <h1 style={{ marginBottom: 16 }}>Oops!</h1>
        <p style={{ color: 'var(--text-2)', marginBottom: 32, maxWidth: 500, margin: '0 auto 32px' }}>
          {error.statusText || error.message || "An unexpected error occurred while loading this page."}
        </p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
          <button className="btn btn-primary" onClick={() => navigate('/')}>Go to Home</button>
          <button className="btn btn-outline" onClick={() => window.location.reload()}>Try Again</button>
        </div>
      </main>
      <Footer />
    </div>
  );
}

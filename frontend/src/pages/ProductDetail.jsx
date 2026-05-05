import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useProduct } from '../hooks/useProduct';
import { useCart } from '../hooks/useCart';
import { useToast } from '../contexts/ToastContext';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { handleGetProduct } = useProduct();
  const { handleAddToCart } = useCart();
  const toast = useToast();
  const { isAuthenticated } = useSelector(s => s.auth);
  const { product, loading } = useSelector(s => s.product);
  const [selImg, setSelImg] = useState(0);
  const [adding, setAdding] = useState(false);

  useEffect(() => { if (id) handleGetProduct(id); }, [id]);

  const onAdd = async () => {
    if (!isAuthenticated) { toast.error('Login to add to cart'); navigate('/login'); return; }
    try { setAdding(true); await handleAddToCart(id); toast.success('Added to cart! 🛒'); }
    catch { toast.error('Failed to add to cart'); }
    finally { setAdding(false); }
  };

  if (loading) return (
    <div className="page"><Navbar />
      <div className="container section">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
          <div className="skeleton" style={{ height: 400, borderRadius: 'var(--r-xl)' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[80, 40, 120, 60].map((w, i) => <div key={i} className="skeleton" style={{ height: 24, width: `${w}%` }} />)}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );

  if (!product) return (
    <div className="page"><Navbar />
      <div className="empty-state container">
        <div className="empty-icon">🍽️</div>
        <div className="empty-title">Product not found</div>
        <button className="btn btn-primary" onClick={() => navigate('/')}>Back to Menu</button>
      </div>
      <Footer />
    </div>
  );

  return (
    <div className="page">
      <Navbar />
      <main className="container section">
        <button onClick={() => navigate(-1)} className="btn btn-ghost btn-sm" style={{ marginBottom: 24 }}>← Back</button>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start' }}>

          {/* Images */}
          <div>
            <div style={{ borderRadius: 'var(--r-xl)', overflow: 'hidden', background: 'var(--bg-2)', aspectRatio: '4/3', marginBottom: 12 }}>
              {product.images?.[selImg]?.url
                ? <img src={product.images[selImg].url} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 100 }}>🍽️</div>
              }
            </div>
            {product.images?.length > 1 && (
              <div style={{ display: 'flex', gap: 8 }}>
                {product.images.map((img, i) => (
                  <button key={i} onClick={() => setSelImg(i)} style={{
                    width: 72, height: 72, borderRadius: 'var(--r-md)', overflow: 'hidden',
                    border: `2px solid ${selImg === i ? 'var(--primary)' : 'var(--border)'}`,
                    cursor: 'pointer', background: 'var(--bg-2)', padding: 0,
                  }}>
                    <img src={img.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="fade-in">
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              <span className={`badge badge-${product.veg ? 'veg' : 'nonveg'}`}><span style={{ fontSize: 8 }}>●</span>{product.veg ? 'VEG' : 'NON-VEG'}</span>
              {!product.available && <span className="badge" style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--danger)' }}>UNAVAILABLE</span>}
            </div>
            <h1 style={{ fontSize: 'clamp(24px, 4vw, 36px)', marginBottom: 12 }}>{product.title}</h1>
            <p style={{ color: 'var(--text-2)', fontSize: 16, lineHeight: 1.7, marginBottom: 28 }}>{product.description}</p>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 32 }}>
              <span style={{ fontSize: 40, fontWeight: 800, color: 'var(--primary)' }}>₹{product.price}</span>
              <span style={{ color: 'var(--text-3)', fontSize: 14 }}>inclusive of all taxes</span>
            </div>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button onClick={onAdd} disabled={adding || !product.available} className="btn btn-primary btn-lg" style={{ opacity: !product.available ? 0.5 : 1 }}>
                {adding ? '...' : '🛒 Add to Cart'}
              </button>
              <button className="btn btn-outline btn-lg">❤️ Wishlist</button>
            </div>

            {/* Info boxes */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginTop: 32 }}>
              {[['⚡', '30 min', 'Delivery'], ['🔒', 'Secure', 'Payment'], ['⭐', '4.8/5', 'Rating']].map(([icon, v, l]) => (
                <div key={l} style={{ background: 'var(--bg-2)', borderRadius: 'var(--r-md)', padding: '14px 12px', textAlign: 'center', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 22 }}>{icon}</div>
                  <div style={{ fontWeight: 700, fontSize: 14, marginTop: 4 }}>{v}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />

      <style>{`@media(max-width:768px){div[style*="gridTemplateColumns: '1fr 1fr'"]{grid-template-columns:1fr!important;}}`}</style>
    </div>
  );
}

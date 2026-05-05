import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useProduct } from '../hooks/useProduct';
import { useCart } from '../hooks/useCart';
import { useToast } from '../contexts/ToastContext';
import { ProductCard } from '../components/ProductCard';

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
  const [qty, setQty] = useState(1);
  const { allProducts } = useSelector(s => s.product);

  useEffect(() => { if (id) handleGetProduct(id); }, [id]);

  const onAdd = async () => {
    if (!isAuthenticated) { toast.error('Login to add to cart'); navigate('/login'); return; }
    try { 
      setAdding(true); 
      await handleAddToCart(id, qty); 
      toast.success(`${qty} ${product.title} added to cart! 🛒`); 
    }
    catch { toast.error('Failed to add to cart'); }
    finally { setAdding(false); }
  };

  const relatedProducts = allProducts
    .filter(p => p._id !== id && p.available)
    .slice(0, 4);

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
        <button onClick={() => navigate(-1)} className="btn btn-ghost btn-sm" style={{ marginBottom: 24, paddingLeft: 0 }}>
          <span style={{ fontSize: 18, marginRight: 8 }}>←</span> Back to Menu
        </button>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 64, alignItems: 'start' }}>

          {/* Images */}
          <div className="fade-in">
            <div style={{ 
              borderRadius: 'var(--r-xl)', overflow: 'hidden', background: 'var(--bg-2)', 
              aspectRatio: '1/1', marginBottom: 16, border: '1px solid var(--border)',
              boxShadow: 'var(--sh-md)'
            }}>
              {product.images?.[selImg]?.url
                ? <img src={product.images[selImg].url} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 100 }}>🍽️</div>
              }
            </div>
            {product.images?.length > 1 && (
              <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8 }}>
                {product.images.map((img, i) => (
                  <button key={i} onClick={() => setSelImg(i)} style={{
                    width: 80, height: 80, borderRadius: 'var(--r-md)', overflow: 'hidden',
                    border: `3px solid ${selImg === i ? 'var(--primary)' : 'transparent'}`,
                    cursor: 'pointer', background: 'var(--bg-2)', padding: 0, flexShrink: 0,
                    transition: 'var(--t-fast)',
                    boxShadow: selImg === i ? 'var(--sh-primary)' : 'none',
                  }}>
                    <img src={img.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="fade-up">
            <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
              <span className={`badge badge-${product.veg ? 'veg' : 'nonveg'}`} style={{ padding: '4px 12px' }}>
                <span style={{ fontSize: 8, marginRight: 6 }}>●</span>{product.veg ? 'VEG' : 'NON-VEG'}
              </span>
              {!product.available && <span className="badge" style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--danger)', padding: '4px 12px' }}>UNAVAILABLE</span>}
              <span className="badge badge-primary">⭐ 4.8 Rating</span>
            </div>
            
            <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', marginBottom: 16, color: 'var(--text)' }}>{product.title}</h1>
            <p style={{ color: 'var(--text-2)', fontSize: 17, lineHeight: 1.8, marginBottom: 32 }}>{product.description}</p>

            <div style={{ background: 'var(--bg-2)', borderRadius: 'var(--r-lg)', padding: '24px', border: '1px solid var(--border)', marginBottom: 32 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div>
                  <div style={{ color: 'var(--text-3)', fontSize: 13, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700, marginBottom: 4 }}>Price per unit</div>
                  <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--primary)' }}>₹{product.price}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: 'var(--text-3)', fontSize: 13, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700, marginBottom: 4 }}>Quantity</div>
                  <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-card)', borderRadius: 'var(--r-full)', padding: 4, border: '1px solid var(--border)' }}>
                    <button onClick={() => setQty(Math.max(1, qty - 1))} className="btn-icon" style={{ width: 32, height: 32, fontSize: 14 }}>-</button>
                    <span style={{ width: 40, textAlign: 'center', fontWeight: 700, fontSize: 16 }}>{qty}</span>
                    <button onClick={() => setQty(qty + 1)} className="btn-icon" style={{ width: 32, height: 32, fontSize: 14 }}>+</button>
                  </div>
                </div>
              </div>
              
              <div style={{ height: 1, background: 'var(--border)', marginBottom: 20 }} />
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: 18, fontWeight: 700 }}>Total Amount</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--text)' }}>₹{product.price * qty}</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <button 
                onClick={onAdd} 
                disabled={adding || !product.available} 
                className="btn btn-primary btn-lg" 
                style={{ flex: 1, height: 60, fontSize: 18, opacity: !product.available ? 0.5 : 1 }}
              >
                {adding ? 'Adding...' : '🛒 Add to Cart'}
              </button>
              <button className="btn btn-outline btn-lg" style={{ width: 60, padding: 0 }}>❤️</button>
            </div>

            {/* Features */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginTop: 48 }}>
              {[['⚡', '30 min', 'Fast Delivery'], ['🛡️', 'Secure', 'Safe Checkout'], ['👨‍🍳', 'Top Rated', 'Expert Chef']].map(([icon, v, l]) => (
                <div key={l} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 24, marginBottom: 8 }}>{icon}</div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{v}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div style={{ marginTop: 80 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
              <h2 style={{ fontSize: 32 }}>Other dishes you might like</h2>
              <button onClick={() => navigate('/')} className="btn btn-ghost">View All Menu →</button>
            </div>
            <div className="product-grid">
              {relatedProducts.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          </div>
        )}
      </main>
      <Footer />

      <style>{`
        @media(max-width:992px){
          div[style*="gridTemplateColumns: '1.2fr 1fr'"] { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
        .fade-in { animation: fadeIn 0.6s ease-out forwards; }
        .fade-up { animation: fadeUp 0.6s ease-out 0.2s forwards; opacity: 0; }
      `}</style>
    </div>
  );
}

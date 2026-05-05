import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../hooks/useCart';
import { useOrder } from '../hooks/useOrder';
import { useToast } from '../contexts/ToastContext';

export default function Cart() {
  const { handleGetCart, handleDeleteProductFromCart, handleClearCart, handleUpdateQuantity } = useCart();
  const { handleCreateOrder } = useOrder();
  const toast = useToast();
  const navigate = useNavigate();
  const cartItems = useSelector(s => s.cart.cartItems);
  const { user } = useSelector(s => s.auth);
  const { loading: orderLoading } = useSelector(s => s.order);
  const [checkingOut, setCheckingOut] = useState(false);

  useEffect(() => { handleGetCart(); }, []);

  const total = cartItems.reduce((acc, i) => acc + (i.product?.price || 0) * (i.quantity || 1), 0);

  const onCheckout = async () => {
    if (!cartItems.length) return;
    try {
      setCheckingOut(true);
      const items = cartItems
        .filter(i => i.product)
        .map(i => ({ name: i.product.title, price: i.product.price, quantity: i.quantity || 1 }));
      const finalTotal = Math.round(total * 1.05);
      await handleCreateOrder({ items, totalAmount: finalTotal, user });
    } catch (err) {
      toast.error('Checkout failed. Please try again.');
    } finally {
      setCheckingOut(false);
    }
  };

  return (
    <div className="page">
      <Navbar />
      <main className="container section">
        <h1 style={{ marginBottom: 8, fontSize: 'clamp(24px,4vw,36px)' }}>Your Cart 🛒</h1>
        <p style={{ color: 'var(--text-2)', marginBottom: 32 }}>{cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart</p>

        {cartItems.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🛒</div>
            <div className="empty-title">Your cart is empty</div>
            <div className="empty-text">Looks like you haven't added anything yet</div>
            <Link to="/" className="btn btn-primary">Browse Menu</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 32, alignItems: 'start' }}>
            {/* Cart items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button className="btn btn-ghost btn-sm" onClick={handleClearCart} style={{ color: 'var(--danger)' }}>🗑️ Clear Cart</button>
              </div>
              {cartItems.map(item => {
                const p = item.product;
                if (!p) return null;
                return (
                  <div key={item._id} className="card" style={{ padding: 20, display: 'flex', gap: 16, alignItems: 'center' }}>
                    <div style={{ width: 90, height: 90, borderRadius: 'var(--r-md)', overflow: 'hidden', background: 'var(--bg-2)', flexShrink: 0 }}>
                      {p.images?.[0]?.url ? <img src={p.images[0].url} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36 }}>🍽️</div>}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{p.title}</div>
                      <div style={{ color: 'var(--text-2)', fontSize: 13, marginBottom: 8 }}>{p.description?.slice(0, 60)}...</div>
                      <span className={`badge badge-${p.veg ? 'veg' : 'nonveg'}`}>{p.veg ? 'VEG' : 'NON-VEG'}</span>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--primary)', marginBottom: 4 }}>₹{(p.price * (item.quantity || 1)).toFixed(0)}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, justifyContent: 'flex-end' }}>
                        <button 
                          onClick={() => handleUpdateQuantity(p._id, -1)}
                          style={{ 
                            width: 28, height: 28, borderRadius: '8px', 
                            border: '1px solid var(--border)', background: 'var(--bg-2)', 
                            cursor: 'pointer', fontSize: 16, fontWeight: 700,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'var(--text)', transition: 'all 0.2s',
                          }}
                          onMouseOver={e => e.currentTarget.style.borderColor = 'var(--primary)'}
                          onMouseOut={e => e.currentTarget.style.borderColor = 'var(--border)'}
                        >−</button>
                        <span style={{ fontWeight: 800, fontSize: 15, minWidth: 20, textAlign: 'center' }}>{item.quantity || 1}</span>
                        <button 
                          onClick={() => handleUpdateQuantity(p._id, 1)}
                          style={{ 
                            width: 28, height: 28, borderRadius: '8px', 
                            border: '1px solid var(--primary)', background: 'var(--primary)', 
                            cursor: 'pointer', fontSize: 16, fontWeight: 700,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#fff', transition: 'all 0.2s',
                          }}
                          onMouseOver={e => e.currentTarget.style.opacity = '0.9'}
                          onMouseOut={e => e.currentTarget.style.opacity = '1'}
                        >+</button>
                      </div>
                      <button onClick={() => { handleDeleteProductFromCart(p._id); toast.info('Item removed'); }}
                        className="btn btn-sm" style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--danger)', border: 'none' }}>Remove</button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary */}
            <div className="card" style={{ padding: 24, position: 'sticky', top: 90 }}>
              <h3 style={{ marginBottom: 20, fontSize: 20 }}>Order Summary</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--text-2)' }}>
                  <span>Subtotal ({cartItems.length} items)</span><span>₹{total.toFixed(0)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--text-2)' }}>
                  <span>Delivery fee</span><span style={{ color: 'var(--success)', fontWeight: 600 }}>FREE</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--text-2)' }}>
                  <span>Taxes (5%)</span><span>₹{(total * 0.05).toFixed(0)}</span>
                </div>
                <div className="divider" />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 18 }}>
                  <span>Total</span><span style={{ color: 'var(--primary)' }}>₹{(total * 1.05).toFixed(0)}</span>
                </div>
              </div>

              <button onClick={onCheckout} disabled={checkingOut || orderLoading} className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 20 }}>
                {checkingOut ? 'Processing...' : '💳 Proceed to Pay'}
              </button>

              <div style={{ marginTop: 16, display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
                {['UPI', 'Card', 'Wallet', 'COD'].map(m => (
                  <span key={m} style={{ fontSize: 12, background: 'var(--bg-2)', padding: '4px 10px', borderRadius: 'var(--r-sm)', color: 'var(--text-2)' }}>{m}</span>
                ))}
              </div>

              <div style={{ marginTop: 16, textAlign: 'center', fontSize: 12, color: 'var(--text-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                🔒 100% secure checkout powered by Razorpay
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
      <style>{`@media(max-width:768px){div[style*="gridTemplateColumns: '1fr 360px'"]{grid-template-columns:1fr!important;}}`}</style>
    </div>
  );
}

import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useToast } from '../contexts/ToastContext';

export default function CartDrawer({ open, onClose }) {
  const cartItems = useSelector(s => s.cart.cartItems);
  const { isAuthenticated } = useSelector(s => s.auth);
  const { handleDeleteProductFromCart, handleClearCart, handleGetCart, handleUpdateQuantity } = useCart();
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (open && isAuthenticated) handleGetCart();
  }, [open, isAuthenticated]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const total = cartItems.reduce((acc, item) => acc + (item.product?.price || 0) * (item.quantity || 1), 0);

  const onRemove = async (productId) => {
    await handleDeleteProductFromCart(productId);
    toast.info('Item removed from cart');
  };

  const onUpdateQty = async (productId, change) => {
    await handleUpdateQuantity(productId, change);
  };

  const onClear = async () => {
    await handleClearCart();
    toast.info('Cart cleared');
  };

  return (
    <>
      {open && <div className="overlay" onClick={onClose} />}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: 380,
        background: 'var(--bg-card)', zIndex: 1000,
        boxShadow: '-8px 0 40px rgba(0,0,0,0.15)',
        transform: open ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: 20, margin: 0 }}>Your Cart 🛒</h3>
            <p style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 2 }}>{cartItems.length} item{cartItems.length !== 1 ? 's' : ''}</p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {cartItems.length > 0 && (
              <button className="btn btn-ghost btn-sm" onClick={onClear} style={{ fontSize: 12, color: 'var(--danger)' }}>Clear All</button>
            )}
            <button className="btn-icon" onClick={onClose}>✕</button>
          </div>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {!isAuthenticated ? (
            <div className="empty-state">
              <div className="empty-icon">🔐</div>
              <div className="empty-title">Sign in to view cart</div>
              <Link to="/login" className="btn btn-primary" onClick={onClose}>Sign In</Link>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🛒</div>
              <div className="empty-title">Cart is empty</div>
              <div className="empty-text">Add some delicious food to get started!</div>
              <button className="btn btn-primary" onClick={onClose}>Explore Menu</button>
            </div>
          ) : (
            cartItems.map((item) => {
              const product = item.product;
              if (!product) return null;
              return (
                <div key={item._id} className="card" style={{ padding: 12, display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div style={{ width: 64, height: 64, borderRadius: 'var(--r-md)', overflow: 'hidden', background: 'var(--bg-2)', flexShrink: 0 }}>
                    {product.images?.[0]?.url
                      ? <img src={product.images[0].url} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>🍽️</div>
                    }
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.title}</div>
                    <div style={{ color: 'var(--primary)', fontWeight: 700, fontSize: 14, marginTop: 2 }}>₹{product.price}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
                      <button 
                        onClick={() => onUpdateQty(product._id, -1)}
                        style={{ 
                          width: 24, height: 24, borderRadius: '6px', 
                          border: '1px solid var(--border)', background: 'var(--bg)', 
                          cursor: 'pointer', fontSize: 14, fontWeight: 700,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: 'var(--text)', transition: 'all 0.2s',
                        }}
                        onMouseOver={e => e.currentTarget.style.borderColor = 'var(--primary)'}
                        onMouseOut={e => e.currentTarget.style.borderColor = 'var(--border)'}
                      >−</button>
                      <span style={{ fontWeight: 800, fontSize: 13, minWidth: 16, textAlign: 'center' }}>{item.quantity || 1}</span>
                      <button 
                        onClick={() => onUpdateQty(product._id, 1)}
                        style={{ 
                          width: 24, height: 24, borderRadius: '6px', 
                          border: '1px solid var(--primary)', background: 'var(--primary)', 
                          cursor: 'pointer', fontSize: 14, fontWeight: 700,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: '#fff', transition: 'all 0.2s',
                        }}
                      >+</button>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>₹{(product.price * (item.quantity || 1)).toFixed(0)}</div>
                    <button onClick={() => onRemove(product._id)} style={{
                      background: 'rgba(239,68,68,0.1)', color: 'var(--danger)', border: 'none',
                      padding: '3px 8px', borderRadius: 'var(--r-sm)', fontSize: 11, cursor: 'pointer',
                    }}>Remove</button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && isAuthenticated && (
          <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ color: 'var(--text-2)', fontSize: 14 }}>Subtotal</span>
              <span style={{ fontWeight: 600 }}>₹{total.toFixed(0)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ color: 'var(--text-2)', fontSize: 14 }}>Delivery</span>
              <span style={{ color: 'var(--success)', fontWeight: 600 }}>FREE</span>
            </div>
            <div className="divider" style={{ margin: '12px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <span style={{ fontWeight: 700, fontSize: 16 }}>Total</span>
              <span style={{ fontWeight: 800, fontSize: 18, color: 'var(--primary)' }}>₹{total.toFixed(0)}</span>
            </div>
            <button className="btn btn-primary" style={{ width: '100%', fontSize: 15 }}
              onClick={() => { onClose(); navigate('/cart'); }}>
              Proceed to Checkout →
            </button>
          </div>
        )}
      </div>

      <style>{`@media(max-width:420px){div[style*="width: 380px"]{width:100vw!important;}}`}</style>
    </>
  );
}

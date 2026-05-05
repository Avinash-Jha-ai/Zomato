import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useCart } from '../hooks/useCart';
import { useToast } from '../contexts/ToastContext';

export default function ProductCard({ product }) {
  const { isAuthenticated } = useSelector(s => s.auth);
  const { handleAddToCart } = useCart();
  const toast = useToast();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const onAdd = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) { toast.error('Please login to add to cart'); return; }
    if (!product.available) { toast.error('This item is unavailable'); return; }
    try {
      setAdding(true);
      await handleAddToCart(product._id);
      setAdded(true);
      toast.success(`${product.title} added to cart!`);
      setTimeout(() => setAdded(false), 2000);
    } catch {
      toast.error('Failed to add to cart');
    } finally {
      setAdding(false);
    }
  };

  const imgUrl = product.images?.[0]?.url;
  const isVeg = product.veg === true || product.veg === 'true';

  return (
    <Link 
      to={product.available ? `/product/${product._id}` : '#'} 
      className="card" 
      onClick={e => !product.available && e.preventDefault()}
      style={{ 
        display: 'block', 
        cursor: product.available ? 'pointer' : 'default',
        filter: product.available ? 'none' : 'grayscale(1)',
        opacity: product.available ? 1 : 0.75,
        transition: 'all 0.3s ease'
      }}
    >
      {/* Image */}
      <div style={{ position: 'relative', paddingBottom: '65%', overflow: 'hidden', background: 'var(--bg-2)' }}>
        {imgUrl ? (
          <img 
            src={imgUrl} 
            alt={product.title} 
            loading="lazy"
            style={{
              position: 'absolute', inset: 0, width: '100%', height: '100%',
              objectFit: 'cover', transition: 'transform 0.4s ease',
            }}
            onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
            onMouseLeave={e => e.target.style.transform = 'scale(1)'}
          />
        ) : (
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: 56,
          }}>🍽️</div>
        )}

        {/* Unavailable overlay */}
        {!product.available && (
          <div style={{
            position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 2
          }}>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 13, background: 'rgba(0,0,0,0.6)', padding: '6px 14px', borderRadius: 'var(--r-full)' }}>
              Currently Unavailable
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '14px 16px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
          <div style={{ 
            width: 14, height: 14, border: `1.5px solid ${isVeg ? '#15bd33' : '#e43b3b'}`, 
            display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2 
          }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: isVeg ? '#15bd33' : '#e43b3b' }} />
          </div>
          <span style={{ fontSize: 10, fontWeight: 700, color: isVeg ? '#15bd33' : '#e43b3b', letterSpacing: '0.02em' }}>
            {isVeg ? 'VEG' : 'NON-VEG'}
          </span>
        </div>

        <h4 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {product.title}
        </h4>
        <p style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: 1.5 }}>
          {product.description}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--primary)' }}>
              ₹{product.price}
            </span>
          </div>
          <button
            onClick={onAdd}
            disabled={adding || !product.available}
            className="btn btn-primary btn-sm"
            style={{
              padding: '8px 16px', fontSize: 13,
              background: added ? 'var(--success)' : undefined,
              opacity: !product.available ? 0.5 : 1,
            }}
          >
            {adding ? '...' : added ? '✓ Added' : '+ Add'}
          </button>
        </div>
      </div>
    </Link>
  );
}

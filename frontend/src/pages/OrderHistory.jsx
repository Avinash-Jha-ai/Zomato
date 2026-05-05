import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useOrder } from '../hooks/useOrder';

const statusSteps = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered'];
const statusEmoji = { pending: '⏳', confirmed: '✅', preparing: '👨‍🍳', out_for_delivery: '🛵', delivered: '🎉', cancelled: '❌' };
const statusColor = { pending: '#F59E0B', confirmed: '#3B82F6', preparing: '#8B5CF6', out_for_delivery: '#F59E0B', delivered: '#22C55E', cancelled: '#EF4444' };

export default function OrderHistory() {
  const { handleGetMyOrders } = useOrder();
  const { orders, loading } = useSelector(s => s.order);

  useEffect(() => {
    handleGetMyOrders();
  }, []);

  if (loading && orders.length === 0) {
    return (
      <div className="page">
        <Navbar />
        <main className="container section">
          <h1>My Orders 📦</h1>
          <div style={{ marginTop: 40 }}>
            {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 150, marginBottom: 20, borderRadius: 'var(--r-lg)' }} />)}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="page">
      <Navbar />
      <main className="container section">
        <h1 style={{ marginBottom: 8 }}>My Orders 📦</h1>
        <p style={{ color: 'var(--text-2)', marginBottom: 32 }}>Track all your past and current orders</p>

        {orders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <div className="empty-title">No orders yet</div>
            <div className="empty-text">Your order history will appear here after your first purchase</div>
            <Link to="/" className="btn btn-primary">Order Now</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {orders.map(order => {
              const stepIdx = statusSteps.indexOf(order.status);
              return (
                <div key={order._id} className="card" style={{ padding: 24 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
                    <div>
                      <div style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 4 }}>Order #{order._id?.slice(-8).toUpperCase()}</div>
                      <div style={{ fontWeight: 700, fontSize: 18 }}>₹{order.totalAmount}</div>
                    </div>
                    <span style={{
                      padding: '6px 16px', borderRadius: 'var(--r-full)',
                      background: `${statusColor[order.status]}20`,
                      color: statusColor[order.status],
                      fontWeight: 700, fontSize: 13, textTransform: 'capitalize'
                    }}>{statusEmoji[order.status]} {order.status?.replace('_', ' ')}</span>
                  </div>

                  {/* Progress bar */}
                  {order.status !== 'cancelled' && (
                    <div style={{ marginBottom: 20 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, position: 'relative' }}>
                        <div style={{ position: 'absolute', top: 10, left: '5%', right: '5%', height: 2, background: 'var(--border)' }} />
                        <div style={{ position: 'absolute', top: 10, left: '5%', height: 2, background: 'var(--primary)', transition: 'width 0.5s ease', width: `${(stepIdx / (statusSteps.length - 1)) * 90}%` }} />
                        {statusSteps.map((s, i) => (
                          <div key={s} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 1 }}>
                            <div style={{
                              width: 22, height: 22, borderRadius: '50%',
                              background: i <= stepIdx ? 'var(--primary)' : 'var(--bg-2)',
                              border: `2px solid ${i <= stepIdx ? 'var(--primary)' : 'var(--border)'}`,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: 11, color: i <= stepIdx ? '#fff' : 'var(--text-3)',
                            }}>{i < stepIdx ? '✓' : statusEmoji[s]}</div>
                            <span style={{ fontSize: 10, marginTop: 4, color: i <= stepIdx ? 'var(--text)' : 'var(--text-3)', textAlign: 'center', maxWidth: 60, textTransform: 'capitalize' }}>
                              {s.replace('_', ' ')}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Items */}
                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
                    {order.items?.map((item, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 14 }}>
                        <span>{item.name} × {item.quantity}</span>
                        <span style={{ fontWeight: 600 }}>₹{(item.price * item.quantity).toFixed(0)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

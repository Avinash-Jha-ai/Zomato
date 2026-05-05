import { useEffect, useState } from 'react';
import { getStats, getAllOrders } from '../services/admin.service';

const StatCard = ({ icon, label, value, color, trend }) => (
  <div className="card fade-in" style={{ padding: 24 }}>
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
      <div>
        <p style={{ fontSize: 13, color: 'var(--text-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>{label}</p>
        <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--text)' }}>{value}</div>
        {trend && <div style={{ fontSize: 12, color: 'var(--success)', marginTop: 4, fontWeight: 600 }}>↑ {trend}</div>}
      </div>
      <div style={{ width: 48, height: 48, borderRadius: 12, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{icon}</div>
    </div>
  </div>
);

const statusColor = { pending: '#F59E0B', confirmed: '#3B82F6', preparing: '#8B5CF6', out_for_delivery: '#F59E0B', delivered: '#22C55E', cancelled: '#EF4444' };
const statusClass = { pending: 'badge-warning', confirmed: 'badge-info', preparing: 'badge-info', out_for_delivery: 'badge-warning', delivered: 'badge-success', cancelled: 'badge-danger' };

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getStats(), getAllOrders()])
      .then(([s, o]) => { setStats(s); setOrders(o.slice(0, 8)); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const statCards = stats ? [
    { icon: '👥', label: 'Total Users', value: stats.totalUsers?.toLocaleString(), color: '#3B82F6', trend: 'Growing' },
    { icon: '📦', label: 'Total Orders', value: stats.totalOrders?.toLocaleString(), color: '#8B5CF6', trend: 'This month' },
    { icon: '💰', label: 'Total Revenue', value: `₹${stats.totalRevenue?.toLocaleString()}`, color: '#22C55E', trend: 'Delivered orders' },
  ] : [];

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, fontFamily: 'Inter', marginBottom: 6 }}>Dashboard</h1>
        <p style={{ color: 'var(--text-2)', fontSize: 14 }}>Real-time overview of your food store performance</p>
      </div>

      {/* Stats */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 20, marginBottom: 32 }}>
          {[1,2,3].map(i => <div key={i} className="card skeleton" style={{ height: 120 }} />)}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 20, marginBottom: 32 }}>
          {statCards.map(s => <StatCard key={s.label} {...s} />)}
        </div>
      )}

      {/* Recent Orders */}
      <div className="card">
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 16 }}>Recent Orders</h3>
          <a href="/orders" style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 600 }}>View All →</a>
        </div>
        {loading ? (
          <div style={{ padding: 24 }}>
            {[1,2,3,4,5].map(i => <div key={i} className="skeleton" style={{ height: 20, marginBottom: 16 }} />)}
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order._id}>
                    <td><span style={{ fontFamily: 'monospace', fontSize: 12, background: 'var(--bg)', padding: '3px 8px', borderRadius: 'var(--r-sm)', color: 'var(--text-2)' }}>#{order._id?.slice(-6).toUpperCase()}</span></td>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{order.user?.name || order.user?.username || 'Guest'}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{order.user?.email}</div>
                    </td>
                    <td><span style={{ color: 'var(--text-2)', fontSize: 13 }}>{order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}</span></td>
                    <td><span style={{ fontWeight: 700, color: 'var(--primary)' }}>₹{order.totalAmount}</span></td>
                    <td><span className={`badge ${statusClass[order.status]}`} style={{ textTransform: 'capitalize', fontSize: 11 }}>{order.status?.replace('_', ' ')}</span></td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr><td colSpan={5} style={{ textAlign: 'center', padding: 40, color: 'var(--text-3)' }}>No orders yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

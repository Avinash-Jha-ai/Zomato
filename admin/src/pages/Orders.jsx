import { useEffect, useState } from 'react';
import { getAllOrders, updateOrderStatus } from '../services/admin.service';

const statusOptions = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];
const statusClass = { pending: 'badge-warning', confirmed: 'badge-info', preparing: 'badge-info', out_for_delivery: 'badge-warning', delivered: 'badge-success', cancelled: 'badge-danger' };

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [filter, setFilter] = useState('all');

  const load = () => getAllOrders().then(o => setOrders(o)).catch(console.error).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const onStatusChange = async (orderId, status) => {
    setUpdating(orderId);
    try { await updateOrderStatus(orderId, status); setOrders(o => o.map(x => x._id === orderId ? { ...x, status } : x)); }
    catch { alert('Failed to update status'); }
    finally { setUpdating(null); }
  };

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, fontFamily: 'Inter', marginBottom: 4 }}>Orders</h1>
        <p style={{ color: 'var(--text-2)', fontSize: 14 }}>{orders.length} total orders</p>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {['all', ...statusOptions].map(s => (
          <button key={s} onClick={() => setFilter(s)} className="btn btn-sm" style={{
            background: filter === s ? 'var(--primary)' : 'var(--bg-card)',
            color: filter === s ? '#fff' : 'var(--text-2)',
            border: `1px solid ${filter === s ? 'var(--primary)' : 'var(--border)'}`,
            textTransform: 'capitalize',
          }}>{s.replace('_', ' ')}</button>
        ))}
      </div>

      <div className="card">
        {loading ? (
          <div style={{ padding: 24 }}>
            {[1,2,3,4,5].map(i => <div key={i} className="skeleton" style={{ height: 60, marginBottom: 12 }} />)}
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr><th>Order</th><th>Customer</th><th>Items</th><th>Amount</th><th>Date</th><th>Status</th></tr>
              </thead>
              <tbody>
                {filtered.map(order => (
                  <tr key={order._id}>
                    <td><span style={{ fontFamily: 'monospace', fontSize: 12, background: 'var(--bg)', padding: '3px 8px', borderRadius: 'var(--r-sm)', color: 'var(--text-2)' }}>#{order._id?.slice(-6).toUpperCase()}</span></td>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{order.user?.username || order.user?.name || 'Guest'}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{order.user?.email}</div>
                    </td>
                    <td>
                      <div style={{ fontSize: 13 }}>
                        {order.items?.slice(0,2).map((it, i) => <div key={i}>{it.name} ×{it.quantity}</div>)}
                        {order.items?.length > 2 && <div style={{ color: 'var(--text-3)', fontSize: 12 }}>+{order.items.length - 2} more</div>}
                      </div>
                    </td>
                    <td><span style={{ fontWeight: 700, color: 'var(--primary)' }}>₹{order.totalAmount}</span></td>
                    <td><span style={{ fontSize: 12, color: 'var(--text-3)' }}>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span></td>
                    <td>
                      <select value={order.status} disabled={updating === order._id}
                        onChange={e => onStatusChange(order._id, e.target.value)}
                        className={`badge ${statusClass[order.status]}`}
                        style={{ border: 'none', cursor: 'pointer', fontWeight: 700, textTransform: 'capitalize', background: 'transparent', fontSize: 11, outline: 'none' }}>
                        {statusOptions.map(s => <option key={s} value={s} style={{ textTransform: 'capitalize' }}>{s.replace('_', ' ')}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40, color: 'var(--text-3)' }}>No orders found</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

import { useState } from 'react';
import API from '../utils/axios';

export default function AdminRegister() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });
    try {
      setLoading(true);
      await API.post('/auth/admin/register', form);
      setStatus({ type: 'success', message: 'New administrator registered successfully!' });
      setForm({ username: '', email: '', password: '' });
    } catch (err) {
      setStatus({ type: 'error', message: err?.response?.data?.message || 'Failed to register admin' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600 }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Register New Admin</h1>
        <p style={{ color: 'var(--text-2)' }}>Create a new administrator account with full access to the portal.</p>
      </div>

      <div className="card fade-in" style={{ padding: 40 }}>
        {status.message && (
          <div style={{
            background: status.type === 'success' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
            border: `1px solid ${status.type === 'success' ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
            borderRadius: 'var(--r-md)', padding: '16px',
            color: status.type === 'success' ? 'var(--success)' : 'var(--danger)',
            fontSize: 14, marginBottom: 24, display: 'flex', gap: 10
          }}>
            {status.type === 'success' ? '✅' : '⚠️'} {status.message}
          </div>
        )}

        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="input-group">
            <label style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-2)', marginBottom: 4 }}>Full Name</label>
            <input className="input" type="text" placeholder="e.g. John Doe" required
              value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} />
          </div>

          <div className="input-group">
            <label style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-2)', marginBottom: 4 }}>Email Address</label>
            <input className="input" type="email" placeholder="admin@example.com" required
              value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
          </div>

          <div className="input-group">
            <label style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-2)', marginBottom: 4 }}>Password</label>
            <input className="input" type="password" placeholder="••••••••" required
              value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
            <p style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 4 }}>Must be at least 8 characters long.</p>
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary btn-lg" style={{ marginTop: 12 }}>
            {loading ? 'Registering...' : '👤 Create Admin Account'}
          </button>
        </form>
      </div>

      <div style={{ marginTop: 32, padding: 24, background: 'rgba(245,158,11,0.05)', borderRadius: 'var(--r-lg)', border: '1px solid rgba(245,158,11,0.2)' }}>
        <h4 style={{ color: '#D97706', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>🛡️</span> Security Warning
        </h4>
        <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6 }}>
          New administrators will have full permissions to manage products, orders, and site settings. Ensure you only provide access to trusted individuals.
        </p>
      </div>
    </div>
  );
}

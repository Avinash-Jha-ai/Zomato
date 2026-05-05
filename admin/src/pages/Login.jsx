import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../states/auth.slice';
import { adminLogin } from '../services/admin.service';
import { useTheme } from '../contexts/ThemeContext';

export default function AdminLogin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPw, setShowPw] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      setLoading(true);
      const data = await adminLogin(form);
      if (data.user?.role !== 'admin') { setError('Access denied. Admin accounts only.'); return; }
      dispatch(setUser(data.user));
      navigate('/');
    } catch (err) {
      setError(err?.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', padding: 24 }}>
      <button onClick={toggleTheme} style={{ position: 'fixed', top: 20, right: 20, width: 36, height: 36, borderRadius: '50%', border: '1px solid var(--border)', background: 'var(--bg-card)', cursor: 'pointer', fontSize: 16 }}>{theme === 'light' ? '🌙' : '☀️'}</button>

      <div className="card fade-in" style={{ width: '100%', maxWidth: 400, padding: 40 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg, #FF6B35, #FF8E53)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, margin: '0 auto 16px' }}>👑</div>
          <h1 style={{ fontSize: 24, marginBottom: 6, fontFamily: 'Inter, sans-serif', fontWeight: 800 }}>Admin Portal</h1>
          <p style={{ color: 'var(--text-2)', fontSize: 14 }}>Sign in with your admin credentials</p>
        </div>

        {error && (
          <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--r-md)', padding: '12px 14px', color: 'var(--danger)', fontSize: 13, marginBottom: 20, display: 'flex', gap: 8 }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)' }}>Email</label>
            <input className="input" type="email" placeholder="admin@darkstore.com" required
              value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input className="input" type={showPw ? 'text' : 'password'} placeholder="••••••••" required
                style={{ paddingRight: 44 }}
                value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
              <button type="button" onClick={() => setShowPw(p => !p)}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 15 }}>
                {showPw ? '🙈' : '👁️'}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn btn-primary" style={{ marginTop: 8, padding: '13px', fontSize: 15 }}>
            {loading ? <><span className="spinner" style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#fff' }} /> Signing in...</> : '🔐 Sign In to Admin'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-3)', marginTop: 24 }}>
          🛡️ This portal is restricted to authorized administrators only
        </p>
      </div>
    </div>
  );
}

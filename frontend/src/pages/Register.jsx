import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../contexts/ToastContext';
import { useTheme } from '../contexts/ThemeContext';

export default function Register() {
  const { handleRegister } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const { toggleTheme, theme } = useTheme();

  const [form, setForm] = useState({ username: '', email: '', password: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState({});

  const pwStrength = (pw) => {
    if (!pw) return 0;
    let s = 0;
    if (pw.length >= 8) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/[0-9]/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    return s;
  };
  const strength = pwStrength(form.password);
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][strength];
  const strengthColor = ['', '#EF4444', '#F59E0B', '#3B82F6', '#22C55E'][strength];

  const validate = () => {
    const e = {};
    if (!form.username.trim()) e.username = 'Name is required';
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
    if (!form.phone) e.phone = 'Phone is required';
    else if (!/^\d{10}$/.test(form.phone)) e.phone = 'Enter valid 10-digit number';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 8) e.password = 'Min 8 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      setLoading(true);
      await handleRegister({ username: form.username, email: form.email, password: form.password, phone: form.phone });
      toast.success('Account created! Welcome to DarkStore 🎉');
      navigate('/');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Registration failed');
      setErrors({ submit: err?.response?.data?.message || 'Registration failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr', background: 'var(--bg)' }}>
      {/* Left */}
      <div style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #FF6B35 100%)',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        alignItems: 'center', padding: 60, position: 'relative', overflow: 'hidden',
      }} className="auth-left">
        <div style={{ position: 'absolute', inset: 0, opacity: 0.06, backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '28px 28px' }} />
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: 80, marginBottom: 24 }}>🚀</div>
          <h1 style={{ color: '#fff', fontSize: 36, marginBottom: 16 }}>Join DarkStore</h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 16, lineHeight: 1.7, maxWidth: 320 }}>
            Create your account and start ordering from hundreds of premium restaurants near you.
          </p>
          <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 12, textAlign: 'left' }}>
            {['🍕 500+ restaurants on the platform', '⚡ Average 30-min delivery time', '🔒 100% secure payment', '📦 Real-time order tracking'].map(f => (
              <div key={f} style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14 }}>{f}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Right */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px 64px', position: 'relative', overflowY: 'auto' }}>
        <button className="btn-icon" onClick={toggleTheme} style={{ position: 'absolute', top: 24, right: 24 }}>{theme === 'light' ? '🌙' : '☀️'}</button>

        <div style={{ maxWidth: 400, width: '100%', margin: '0 auto' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 40 }}>
            <div style={{ width: 32, height: 32, borderRadius: 'var(--r-md)', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🍽️</div>
            <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 16 }}>DarkStore</span>
          </Link>

          <h2 style={{ fontSize: 28, marginBottom: 8 }}>Create account</h2>
          <p style={{ color: 'var(--text-2)', marginBottom: 28, fontSize: 15 }}>
            Already have one? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign in →</Link>
          </p>

          {errors.submit && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--r-md)', padding: '12px 16px', color: 'var(--danger)', fontSize: 14, marginBottom: 20 }}>
              {errors.submit}
            </div>
          )}

          <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="input-group">
              <label>Full Name</label>
              <input className={`input${errors.username ? ' input-error' : ''}`} placeholder="Avinash Jha"
                value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} />
              {errors.username && <span className="input-hint error">{errors.username}</span>}
            </div>

            <div className="input-group">
              <label>Email</label>
              <input className={`input${errors.email ? ' input-error' : ''}`} type="email" placeholder="you@example.com"
                value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
              {errors.email && <span className="input-hint error">{errors.email}</span>}
            </div>

            <div className="input-group">
              <label>Phone Number</label>
              <input className={`input${errors.phone ? ' input-error' : ''}`} type="tel" placeholder="9876543210"
                value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
              {errors.phone && <span className="input-hint error">{errors.phone}</span>}
            </div>

            <div className="input-group">
              <label>Password</label>
              <div style={{ position: 'relative' }}>
                <input className={`input${errors.password ? ' input-error' : ''}`} type={showPw ? 'text' : 'password'}
                  placeholder="Min 8 characters" style={{ paddingRight: 44 }}
                  value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
                <button type="button" onClick={() => setShowPw(p => !p)}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 16 }}>
                  {showPw ? '🙈' : '👁️'}
                </button>
              </div>
              {form.password && (
                <div>
                  <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
                    {[1,2,3,4].map(i => <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i <= strength ? strengthColor : 'var(--border)', transition: 'background 0.3s' }} />)}
                  </div>
                  <span style={{ fontSize: 11, color: strengthColor, fontWeight: 600 }}>{strengthLabel}</span>
                </div>
              )}
              {errors.password && <span className="input-hint error">{errors.password}</span>}
            </div>

            <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ marginTop: 8 }}>
              {loading ? <><span className="spinner" style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#fff' }} /> Creating Account...</> : 'Create Account →'}
            </button>
          </form>
        </div>
      </div>

      <style>{`@media(max-width:768px){.auth-left{display:none!important;}div[style*="padding: '60px 64px'"]{padding:40px 24px!important;}div[style*="gridTemplateColumns"]{grid-template-columns:1fr!important;}}`}</style>
    </div>
  );
}

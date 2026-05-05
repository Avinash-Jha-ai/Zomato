import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../contexts/ToastContext';
import { useTheme } from '../contexts/ThemeContext';

export default function Login() {
  const { handleLogin } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const { toggleTheme, theme } = useTheme();

  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      setLoading(true);
      await handleLogin({ email: form.email, password: form.password });
      toast.success('Welcome back! 🎉');
      navigate('/');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Invalid credentials');
      setErrors({ submit: 'Invalid email or password' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr', background: 'var(--bg)' }}>
      {/* Left panel */}
      <div style={{
        background: 'linear-gradient(135deg, #FF6B35 0%, #FF8E53 50%, #FFC371 100%)',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        alignItems: 'center', padding: 60, position: 'relative', overflow: 'hidden',
      }} className="auth-left">
        <div style={{ position: 'absolute', inset: 0, opacity: 0.08, backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '28px 28px' }} />
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: 80, marginBottom: 24 }}>🍽️</div>
          <h1 style={{ color: '#fff', fontSize: 36, marginBottom: 16 }}>Welcome Back!</h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 16, lineHeight: 1.7, maxWidth: 320 }}>
            Sign in to enjoy premium food delivery. Your favorite meals are just a few clicks away.
          </p>
          <div style={{ display: 'flex', gap: 16, marginTop: 40, justifyContent: 'center' }}>
            {['30 min delivery', '500+ dishes', 'Live tracking'].map(f => (
              <div key={f} style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', borderRadius: 'var(--r-md)', padding: '8px 14px', color: '#fff', fontSize: 12, fontWeight: 600 }}>✓ {f}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px 64px', position: 'relative' }}>
        {/* Theme toggle */}
        <button className="btn-icon" onClick={toggleTheme} style={{ position: 'absolute', top: 24, right: 24 }}>{theme === 'light' ? '🌙' : '☀️'}</button>

        <div style={{ maxWidth: 400, width: '100%', margin: '0 auto' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 40 }}>
            <div style={{ width: 32, height: 32, borderRadius: 'var(--r-md)', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🍽️</div>
            <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 16 }}>DarkStore</span>
          </Link>

          <h2 style={{ fontSize: 28, marginBottom: 8 }}>Sign in</h2>
          <p style={{ color: 'var(--text-2)', marginBottom: 32, fontSize: 15 }}>
            New here? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>Create an account →</Link>
          </p>

          {errors.submit && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--r-md)', padding: '12px 16px', color: 'var(--danger)', fontSize: 14, marginBottom: 20 }}>
              {errors.submit}
            </div>
          )}

          <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div className="input-group">
              <label>Email</label>
              <input className={`input${errors.email ? ' input-error' : ''}`} type="email" placeholder="you@example.com"
                value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
              {errors.email && <span className="input-hint error">{errors.email}</span>}
            </div>

            <div className="input-group">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <label>Password</label>
                <a href="#" style={{ fontSize: 12, color: 'var(--primary)' }}>Forgot password?</a>
              </div>
              <div style={{ position: 'relative' }}>
                <input className={`input${errors.password ? ' input-error' : ''}`} type={showPw ? 'text' : 'password'}
                  placeholder="••••••••" style={{ paddingRight: 44 }}
                  value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
                <button type="button" onClick={() => setShowPw(p => !p)}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 16 }}>
                  {showPw ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.password && <span className="input-hint error">{errors.password}</span>}
            </div>

            <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ marginTop: 8 }}>
              {loading ? <><span className="spinner" style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#fff' }} /> Signing in...</> : 'Sign In →'}
            </button>
          </form>
        </div>
      </div>

      <style>{`@media(max-width:768px){.auth-left{display:none!important;}div[style*="padding: '60px 64px'"]{padding:40px 24px!important;}div[style*="gridTemplateColumns"]{grid-template-columns:1fr!important;}}`}</style>
    </div>
  );
}

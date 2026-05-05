import { useState } from 'react';
import { Navigate, Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTheme } from '../contexts/ThemeContext';
import { setUser, logoutUser } from '../states/auth.slice';
import { useDispatch } from 'react-redux';
import API from '../utils/axios';

const navItems = [
  { to: '/', icon: '📊', label: 'Dashboard' },
  { to: '/products', icon: '🍽️', label: 'Products' },
  { to: '/orders', icon: '📦', label: 'Orders' },
  { to: '/hero', icon: '🖼️', label: 'Hero Banners' },
  { to: '/register-admin', icon: '🛡️', label: 'Manage Admins' },
];

export default function AdminLayout() {
  const { isAuthenticated, user, loading } = useSelector(s => s.auth);
  const { theme, toggleTheme } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <div className="spinner" style={{ width: 40, height: 40, borderWidth: 3 }} />
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const handleLogout = async () => {
    await API.get('/auth/logout');
    dispatch(logoutUser());
    navigate('/login');
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside style={{
        position: 'fixed', top: 0, left: 0, bottom: 0, width: 'var(--sidebar-w)',
        background: 'var(--bg-sidebar)', borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column', zIndex: 100,
        boxShadow: 'var(--sh-sm)',
      }}>
        {/* Logo */}
        <div style={{ padding: '20px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: '10px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>👑</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>DarkStore</div>
            <div style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 600 }}>Admin Panel</div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 4, overflowY: 'auto' }}>
          {navItems.map(item => (
            <NavLink key={item.to} to={item.to} end={item.to === '/'} style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 14px', borderRadius: 'var(--r-md)',
              fontSize: 14, fontWeight: 500, textDecoration: 'none',
              background: isActive ? 'rgba(255,107,53,0.1)' : 'transparent',
              color: isActive ? 'var(--primary)' : 'var(--text-2)',
              transition: 'all var(--t)',
            })}>
              <span style={{ fontSize: 18 }}>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div style={{ padding: '16px 12px', borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, padding: '8px 12px', background: 'var(--bg)', borderRadius: 'var(--r-md)' }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 13, fontWeight: 700 }}>
              {user?.username?.[0]?.toUpperCase() || 'A'}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.username}</div>
              <div style={{ fontSize: 11, color: 'var(--text-3)' }}>Admin</div>
            </div>
          </div>
          <button onClick={handleLogout} className="btn btn-ghost btn-sm" style={{ width: '100%', color: 'var(--danger)', justifyContent: 'flex-start', gap: 8 }}>
            🚪 Sign Out
          </button>
        </div>
      </aside>

      <div className="admin-main">
        {/* Topbar */}
        <header style={{
          position: 'fixed', top: 0, left: 'var(--sidebar-w)', right: 0,
          height: 'var(--topbar-h)', background: 'var(--bg-card)',
          borderBottom: '1px solid var(--border)', display: 'flex',
          alignItems: 'center', justifyContent: 'space-between',
          padding: '0 24px', zIndex: 99,
        }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)' }}>
            Welcome back, {user?.username?.split(' ')[0]} 👋
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 12, color: 'var(--text-3)', background: 'var(--bg)', padding: '4px 10px', borderRadius: 'var(--r-full)', border: '1px solid var(--border)' }}>
              🟢 Live
            </span>
            <button onClick={toggleTheme} style={{
              width: 36, height: 36, borderRadius: '50%', border: '1px solid var(--border)',
              background: 'var(--bg)', cursor: 'pointer', fontSize: 16,
            }}>
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
          </div>
        </header>

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

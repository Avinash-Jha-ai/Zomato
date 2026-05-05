import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../hooks/useAuth';
import CartDrawer from './CartDrawer';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { handleLogout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useSelector(s => s.auth);
  const cartItems = useSelector(s => s.cart.cartItems);
  const cartCount = cartItems.reduce((acc, i) => acc + (i.quantity || 1), 0);

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [search, setSearch] = useState('');
  const menuRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setUserMenuOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/?search=${encodeURIComponent(search.trim())}`);
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/?filter=veg', label: '🌿 Veg' },
    { to: '/?filter=nonveg', label: '🍗 Non-Veg' },
  ];

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 900,
        height: 'var(--nav-h)',
        background: scrolled ? 'var(--bg-glass)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
        transition: 'all 0.3s ease',
        boxShadow: scrolled ? 'var(--sh-sm)' : 'none',
      }}>
        <div className="container" style={{ height: '100%', display: 'flex', alignItems: 'center', gap: 24 }}>

          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 'var(--r-md)',
              background: 'var(--primary)', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: 20, boxShadow: 'var(--sh-primary)'
            }}>🍽️</div>
            <div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 18, color: 'var(--text)', lineHeight: 1.1 }}>
                DarkStore
              </div>
              <div style={{ fontSize: 10, color: 'var(--primary)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Food Delivery
              </div>
            </div>
          </Link>

          {/* Desktop nav links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginLeft: 8 }} className="nav-links-desktop">
            {navLinks.map(l => (
              <Link key={l.to} to={l.to} style={{
                padding: '6px 14px', borderRadius: 'var(--r-full)',
                fontSize: 14, fontWeight: 500,
                color: location.pathname === '/' && l.to === '/' ? 'var(--primary)' : 'var(--text-2)',
                background: location.pathname === '/' && l.to === '/' ? 'var(--primary-soft)' : 'transparent',
                transition: 'all var(--t)',
              }}>{l.label}</Link>
            ))}
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: 360, marginLeft: 'auto' }} className="search-form-desktop">
            <div style={{ position: 'relative' }}>
              <input
                className="input"
                style={{ paddingLeft: 40, paddingRight: 16, height: 40, borderRadius: 'var(--r-full)' }}
                placeholder="Search food, cuisine..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16, color: 'var(--text-3)' }}>🔍</span>
            </div>
          </form>

          {/* Right controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 8 }}>

            {/* Theme toggle */}
            <button className="btn-icon" onClick={toggleTheme} title="Toggle theme">
              {theme === 'light' ? '🌙' : '☀️'}
            </button>

            {/* Cart */}
            <button className="btn-icon" onClick={() => setCartOpen(true)} style={{ position: 'relative' }}>
              🛒
              {cartCount > 0 && (
                <span style={{
                  position: 'absolute', top: -4, right: -4,
                  background: 'var(--primary)', color: '#fff',
                  borderRadius: '50%', width: 18, height: 18,
                  fontSize: 11, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  animation: 'bounce-cart 0.3s ease'
                }}>{cartCount}</span>
              )}
            </button>

            {/* User */}
            {isAuthenticated ? (
              <div ref={menuRef} style={{ position: 'relative' }}>
                <button onClick={() => setUserMenuOpen(o => !o)} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '6px 14px 6px 8px', borderRadius: 'var(--r-full)',
                  background: 'var(--bg-2)', border: '1px solid var(--border)',
                  cursor: 'pointer', transition: 'all var(--t)',
                }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: '50%',
                    background: 'var(--primary)', color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, fontWeight: 700
                  }}>
                    {user?.avatar ? <img src={user.avatar} style={{ width: 30, height: 30, borderRadius: '50%', objectFit: 'cover' }} alt="avatar" /> : user?.username?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{user?.username?.split(' ')[0]}</span>
                  <span style={{ fontSize: 10, color: 'var(--text-3)' }}>▼</span>
                </button>
                {userMenuOpen && (
                  <div style={{
                    position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                    background: 'var(--bg-card)', border: '1px solid var(--border)',
                    borderRadius: 'var(--r-lg)', boxShadow: 'var(--sh-lg)',
                    minWidth: 180, padding: 8, animation: 'slideDown 0.2s ease',
                    zIndex: 999
                  }}>
                    {[
                      { to: '/profile', icon: '👤', label: 'Profile' },
                      { to: '/orders', icon: '📦', label: 'My Orders' },
                      { to: '/cart', icon: '🛒', label: 'Cart' },
                    ].map(item => (
                      <Link key={item.to} to={item.to} onClick={() => setUserMenuOpen(false)} style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '10px 12px', borderRadius: 'var(--r-md)',
                        fontSize: 14, color: 'var(--text)', transition: 'background var(--t)',
                      }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-2)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >{item.icon} {item.label}</Link>
                    ))}
                    <div style={{ height: 1, background: 'var(--border)', margin: '8px 0' }} />
                    <button onClick={() => { handleLogout(); setUserMenuOpen(false); }} style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                      padding: '10px 12px', borderRadius: 'var(--r-md)',
                      fontSize: 14, color: 'var(--danger)', border: 'none',
                      background: 'transparent', cursor: 'pointer', transition: 'background var(--t)',
                      textAlign: 'left',
                    }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >🚪 Sign Out</button>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 8 }}>
                <Link to="/login" className="btn btn-ghost btn-sm">Sign In</Link>
                <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
              </div>
            )}

            {/* Mobile hamburger */}
            <button className="btn-icon mobile-menu-btn" onClick={() => setMobileOpen(o => !o)} style={{ display: 'none' }}>
              {mobileOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div style={{
            position: 'absolute', top: '100%', left: 0, right: 0,
            background: 'var(--bg-card)', borderBottom: '1px solid var(--border)',
            padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 8,
            animation: 'slideDown 0.2s ease', boxShadow: 'var(--sh-md)',
          }}>
            <form onSubmit={handleSearch}>
              <div style={{ position: 'relative', marginBottom: 12 }}>
                <input className="input" style={{ paddingLeft: 40 }} placeholder="Search food..." value={search} onChange={e => setSearch(e.target.value)} />
                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16 }}>🔍</span>
              </div>
            </form>
            {navLinks.map(l => <Link key={l.to} to={l.to} style={{ padding: '10px 0', color: 'var(--text)', fontSize: 15, borderBottom: '1px solid var(--border-2)' }}>{l.label}</Link>)}
            {!isAuthenticated && (
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <Link to="/login" className="btn btn-outline" style={{ flex: 1 }}>Sign In</Link>
                <Link to="/register" className="btn btn-primary" style={{ flex: 1 }}>Register</Link>
              </div>
            )}
          </div>
        )}
      </nav>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

      <style>{`
        @media (max-width: 768px) {
          .nav-links-desktop { display: none !important; }
          .search-form-desktop { display: none !important; }
          .mobile-menu-btn { display: inline-flex !important; }
        }
      `}</style>
    </>
  );
}
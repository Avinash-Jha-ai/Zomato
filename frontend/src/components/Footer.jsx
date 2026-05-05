import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{
      background: 'var(--bg-2)', borderTop: '1px solid var(--border)',
      padding: '48px 0 24px',
    }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40, marginBottom: 40 }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ width: 36, height: 36, borderRadius: 'var(--r-md)', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🍽️</div>
              <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 18 }}>DarkStore</span>
            </div>
            <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.7 }}>
              Premium food delivery at your doorstep. Fresh, fast, and unforgettable every time.
            </p>
          </div>

          {/* Links */}
          {[
            { title: 'Explore', links: [{ label: 'All Dishes', to: '/' }, { label: 'Veg Menu', to: '/?filter=veg' }, { label: 'Non-Veg', to: '/?filter=nonveg' }] },
            { title: 'Account', links: [{ label: 'Profile', to: '/profile' }, { label: 'My Orders', to: '/orders' }, { label: 'Cart', to: '/cart' }] },
            { title: 'Company', links: [{ label: 'About Us', to: '/about' }, { label: 'Contact', to: '#' }, { label: 'Privacy Policy', to: '/privacy' }] },
          ].map(col => (
            <div key={col.title}>
              <h6 style={{ fontWeight: 700, marginBottom: 16, color: 'var(--text)', fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{col.title}</h6>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {col.links.map(l => (
                  <Link key={l.label} to={l.to} style={{ fontSize: 14, color: 'var(--text-2)', transition: 'color var(--t)' }}
                    onMouseEnter={e => e.target.style.color = 'var(--primary)'}
                    onMouseLeave={e => e.target.style.color = 'var(--text-2)'}
                  >{l.label}</Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="divider" />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ fontSize: 13, color: 'var(--text-3)' }}>© {new Date().getFullYear()} DarkStore. All rights reserved.</p>
          <div style={{ display: 'flex', gap: 8 }}>
            {['🐦', '📸', '💼'].map((icon, i) => (
              <button key={i} className="btn-icon" style={{ width: 36, height: 36, fontSize: 16 }}>{icon}</button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

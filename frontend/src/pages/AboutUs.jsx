import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function AboutUs() {
  return (
    <div className="page">
      <Navbar />
      <main className="container" style={{ padding: '60px 24px', maxWidth: 800 }}>
        <h1 className="font-serif" style={{ fontSize: '3rem', marginBottom: 24, color: 'var(--primary)' }}>Our Story</h1>
        <p style={{ fontSize: 18, color: 'var(--text-2)', lineHeight: 1.8, marginBottom: 32 }}>
          Welcome to <strong style={{ color: 'var(--text)' }}>The Dark Store</strong>. We aren't just another food delivery service; we are a culinary movement dedicated to the midnight cravers, the early birds, and everyone in between.
        </p>

        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 24, marginBottom: 16 }}>The Philosophy</h2>
          <p style={{ color: 'var(--text-2)', lineHeight: 1.7 }}>
            In a world that never sleeps, hunger shouldn't have to wait. We believe in premium ingredients, lightning-fast delivery, and a seamless digital experience. Our "Dark Store" model allows us to focus entirely on the quality of your food and the speed of its journey to your doorstep.
          </p>
        </section>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24, marginBottom: 48 }}>
          <div style={{ background: 'var(--bg-2)', padding: 24, borderRadius: 'var(--r-lg)' }}>
            <h3 style={{ color: 'var(--primary)', marginBottom: 8 }}>Freshness</h3>
            <p style={{ fontSize: 14, color: 'var(--text-2)' }}>Sourced daily from local vendors to ensure peak quality.</p>
          </div>
          <div style={{ background: 'var(--bg-2)', padding: 24, borderRadius: 'var(--r-lg)' }}>
            <h3 style={{ color: 'var(--primary)', marginBottom: 8 }}>Speed</h3>
            <p style={{ fontSize: 14, color: 'var(--text-2)' }}>Our logistics network is optimized for 30-minute delivery.</p>
          </div>
          <div style={{ background: 'var(--bg-2)', padding: 24, borderRadius: 'var(--r-lg)' }}>
            <h3 style={{ color: 'var(--primary)', marginBottom: 8 }}>Passion</h3>
            <p style={{ fontSize: 14, color: 'var(--text-2)' }}>Every dish is crafted with love by our expert chefs.</p>
          </div>
        </div>

        <p style={{ textAlign: 'center', fontSize: 16, color: 'var(--text-3)', fontStyle: 'italic' }}>
          "Born in the dark, delivered to your light."
        </p>
      </main>
      <Footer />
    </div>
  );
}

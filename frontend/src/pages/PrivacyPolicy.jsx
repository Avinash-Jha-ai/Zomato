import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function PrivacyPolicy() {
  return (
    <div className="page">
      <Navbar />
      <main className="container" style={{ padding: '60px 24px', maxWidth: 800 }}>
        <h1 className="font-serif" style={{ fontSize: '2.5rem', marginBottom: 16 }}>Privacy Policy</h1>
        <p style={{ color: 'var(--text-3)', fontSize: 14, marginBottom: 40 }}>Last updated: May 2026</p>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, marginBottom: 12, color: 'var(--text)' }}>1. Information We Collect</h2>
          <p style={{ color: 'var(--text-2)', lineHeight: 1.6 }}>
            When you use The Dark Store, we collect information that you provide directly to us, such as your name, email address, delivery address, and payment information. We also collect data about your orders and browsing behavior to improve our services.
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, marginBottom: 12, color: 'var(--text)' }}>2. How We Use Your Information</h2>
          <p style={{ color: 'var(--text-2)', lineHeight: 1.6 }}>
            Your information is used to process your orders, provide customer support, and send you updates about your delivery. We also use data analytics to enhance our menu offerings and app performance.
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, marginBottom: 12, color: 'var(--text)' }}>3. Data Security</h2>
          <p style={{ color: 'var(--text-2)', lineHeight: 1.6 }}>
            We implement industry-standard security measures to protect your personal data. Your payment information is processed through secure, encrypted gateways (like Razorpay) and is never stored directly on our servers.
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, marginBottom: 12, color: 'var(--text)' }}>4. Third-Party Services</h2>
          <p style={{ color: 'var(--text-2)', lineHeight: 1.6 }}>
            We may share your information with trusted third-party partners, such as delivery personnel and payment processors, solely for the purpose of fulfilling your orders.
          </p>
        </section>

        <div style={{ padding: 24, background: 'var(--bg-2)', borderRadius: 'var(--r-md)', marginTop: 40 }}>
          <h3 style={{ fontSize: 16, marginBottom: 8 }}>Questions?</h3>
          <p style={{ fontSize: 14, color: 'var(--text-2)' }}>
            If you have any questions about this Privacy Policy, please contact our support team at <a href="mailto:support@darkstore.com" style={{ color: 'var(--primary)', fontWeight: 600 }}>support@darkstore.com</a>.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="page">
          <Navbar />
          <main className="container section" style={{ textAlign: 'center', padding: '100px 20px' }}>
            <div style={{ fontSize: 64, marginBottom: 24 }}>🥘</div>
            <h1 style={{ marginBottom: 16 }}>Something went wrong</h1>
            <p style={{ color: 'var(--text-2)', marginBottom: 32, maxWidth: 500, margin: '0 auto 32px' }}>
              We encountered an unexpected error. Don't worry, our chefs are on it!
              <br />
              <small style={{ color: 'var(--text-3)', fontSize: 12 }}>{this.state.error?.message}</small>
            </p>
            <button 
              className="btn btn-primary" 
              onClick={() => window.location.href = '/'}
            >
              Back to Home
            </button>
          </main>
          <Footer />
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

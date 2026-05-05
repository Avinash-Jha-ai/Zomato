import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HeroSlider from '../components/HeroSlider';
import ProductCard from '../components/ProductCard';
import { useProduct } from '../hooks/useProduct';
import { useHero } from '../hooks/useHero';
import { useSearch } from '../hooks/useSearch';

const categories = [
  { key: 'all', label: '🍽️ All', filter: {} },
  { key: 'veg', label: '🌿 Veg', filter: { veg: 'true' } },
  { key: 'nonveg', label: '🍗 Non-Veg', filter: { veg: 'false' } },
];

function ProductSkeleton() {
  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      <div className="skeleton" style={{ height: 170 }} />
      <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div className="skeleton" style={{ height: 16, width: '70%' }} />
        <div className="skeleton" style={{ height: 12, width: '90%' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
          <div className="skeleton" style={{ height: 20, width: 60 }} />
          <div className="skeleton" style={{ height: 32, width: 72, borderRadius: 'var(--r-full)' }} />
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const searchQ = searchParams.get('search');
  const filterQ = searchParams.get('filter');

  const { handleGetProducts, handleGetVeg, handleGetNonVeg, handlePrefetch } = useProduct();
  const { handleGetHero } = useHero();
  const { handleSearch, handleClearSearch } = useSearch();

  const { products, allProducts, vegProducts, nonVegProducts, loading: productLoading } = useSelector(s => s.product);
  const { hero } = useSelector(s => s.hero);
  const { results: searchResults, loading: searchLoading } = useSelector(s => s.search);

  const [activeCategory, setActiveCategory] = useState(filterQ || 'all');
  const [localSearch, setLocalSearch] = useState(searchQ || '');

  useEffect(() => {
    const init = async () => {
      await handleGetHero();
      handlePrefetch();
      
      if (searchQ) {
        handleSearch({ query: searchQ });
      } else if (filterQ === 'veg') {
        handleGetVeg();
      } else if (filterQ === 'nonveg') {
        handleGetNonVeg();
      } else {
        handleGetProducts();
      }
    };
    init();
  }, []);

  // Real-time search effect
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (localSearch.trim()) {
        handleSearch({ query: localSearch });
        setSearchParams({ search: localSearch });
      } else if (localSearch === '') {
        handleClearSearch();
        if (searchQ) setSearchParams({});
        if (!filterQ) handleGetProducts();
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [localSearch]);

  const displayProducts = localSearch.trim() ? searchResults : products;
  const isLoading = localSearch.trim() ? searchLoading : productLoading;

  const handleCategoryChange = (cat) => {
    if (activeCategory === cat.key) return;
    setActiveCategory(cat.key);
    setLocalSearch('');
    handleClearSearch();
    setSearchParams({ filter: cat.key });

    if (cat.key === 'all' && allProducts.length > 0) {
      dispatch({ type: 'product/setProducts', payload: allProducts });
    } else if (cat.key === 'veg' && vegProducts.length > 0) {
      dispatch({ type: 'product/setProducts', payload: vegProducts });
    } else if (cat.key === 'nonveg' && nonVegProducts.length > 0) {
      dispatch({ type: 'product/setProducts', payload: nonVegProducts });
    } else {
      if (cat.key === 'all') handleGetProducts();
      else if (cat.key === 'veg') handleGetVeg();
      else handleGetNonVeg();
    }
  };

  return (
    <div className="page">
      <Navbar />

      <main className="container">
        {/* Hero */}
        <HeroSlider heroData={hero} />

        {/* Search */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ position: 'relative', maxWidth: 800, margin: '0 auto' }}>
            <input
              className="input search-input" style={{ 
                paddingLeft: 48, height: 56, borderRadius: '16px', 
                fontSize: 16, background: 'var(--bg-card)',
                border: '2px solid var(--border)',
                transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                boxShadow: 'var(--sh-sm)',
              }}
              placeholder="Search for biryani, pizza, burgers..."
              value={localSearch} onChange={e => setLocalSearch(e.target.value)}
            />
            <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', fontSize: 20, color: 'var(--text-3)' }}>🔍</span>
            {localSearch && (
              <button type="button" onClick={() => { setLocalSearch(''); handleClearSearch(); handleGetProducts(); setSearchParams({}); }}
                style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: 'var(--text-3)' }}>✕</button>
            )}
          </div>
        </div>

        {/* Categories */}
        {!searchQ && (
          <div style={{ display: 'flex', gap: 10, marginBottom: 32, flexWrap: 'wrap' }}>
            {categories.map(cat => (
              <button key={cat.key} onClick={() => handleCategoryChange(cat)} className="btn" style={{
                background: activeCategory === cat.key ? 'var(--primary)' : 'var(--bg-2)',
                color: activeCategory === cat.key ? '#fff' : 'var(--text-2)',
                border: `1.5px solid ${activeCategory === cat.key ? 'var(--primary)' : 'var(--border)'}`,
                boxShadow: activeCategory === cat.key ? 'var(--sh-primary)' : 'none',
              }}>{cat.label}</button>
            ))}
          </div>
        )}

        {/* Section heading */}
        <div style={{ marginBottom: 24 }} id="products-section">
          <h2 className="section-title">
            {searchQ ? `Results for "${searchQ}"` : activeCategory === 'veg' ? '🌿 Vegetarian Dishes' : activeCategory === 'nonveg' ? '🍗 Non-Veg Specials' : 'Our Menu'}
          </h2>
          <p className="section-subtitle">
            {isLoading ? 'Loading...' : `${displayProducts.length} dishes available`}
          </p>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="product-grid">
            {Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)}
          </div>
        ) : displayProducts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🍽️</div>
            <div className="empty-title">No dishes found</div>
            <div className="empty-text">Try a different search or browse our full menu</div>
            <button className="btn btn-primary" onClick={() => { handleGetProducts(); setActiveCategory('all'); setLocalSearch(''); }}>View All</button>
          </div>
        ) : (
          <div className="product-grid fade-in">
            {displayProducts.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        )}

        <div style={{ height: 64 }} />
      </main>

      <Footer />
    </div>
  );
}

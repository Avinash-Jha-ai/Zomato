import { useEffect, useState, useRef } from 'react';
import { getAllProducts, deleteProduct, uploadProduct, updateProduct } from '../services/admin.service';

const INITIAL_FORM = { title: '', description: '', price: '', veg: true, available: true };

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [search, setSearch] = useState('');
  const filesRef = useRef();

  const load = () => getAllProducts().then(d => setProducts(d.products || [])).catch(console.error).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const openAdd = () => { setForm(INITIAL_FORM); setEditProduct(null); setShowModal(true); };
  const openEdit = (p) => { setForm({ title: p.title, description: p.description, price: p.price, veg: p.veg, available: p.available }); setEditProduct(p); setShowModal(true); };

  const onSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editProduct) {
        await updateProduct(editProduct._id, form);
      } else {
        const fd = new FormData();
        Object.entries(form).forEach(([k, v]) => fd.append(k, v));
        Array.from(filesRef.current?.files || []).forEach(f => fd.append('images', f));
        await uploadProduct(fd);
      }
      setShowModal(false);
      load();
    } catch (err) { alert(err?.response?.data?.message || 'Failed to save product'); }
    finally { setSaving(false); }
  };

  const onDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    setDeleting(id);
    try { await deleteProduct(id); setProducts(p => p.filter(x => x._id !== id)); }
    catch { alert('Failed to delete'); }
    finally { setDeleting(null); }
  };

  const [toggling, setToggling] = useState(null);
  const handleToggleAvailability = async (p) => {
    setToggling(p._id);
    try {
      await updateProduct(p._id, { available: !p.available });
      setProducts(prev => prev.map(x => x._id === p._id ? { ...x, available: !p.available } : x));
    } catch (err) {
      alert('Failed to update status');
    } finally {
      setToggling(null);
    }
  };

  const filtered = products.filter(p => p.title?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, fontFamily: 'Inter', marginBottom: 4 }}>Products</h1>
          <p style={{ color: 'var(--text-2)', fontSize: 14 }}>{products.length} total products</p>
        </div>
        <button onClick={openAdd} className="btn btn-primary">+ Add Product</button>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ padding: '16px 20px' }}>
          <input className="input" placeholder="🔍 Search products..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="card">
        {loading ? (
          <div style={{ padding: 24 }}>
            {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: 60, marginBottom: 12 }} />)}
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr><th>Product</th><th>Price</th><th>Type</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 44, height: 44, borderRadius: 'var(--r-md)', overflow: 'hidden', background: 'var(--bg)', flexShrink: 0 }}>
                          {p.images?.[0]?.url ? <img src={p.images[0].url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🍽️</div>}
                        </div>
                        <div><div style={{ fontWeight: 600, fontSize: 14 }}>{p.title}</div><div style={{ fontSize: 12, color: 'var(--text-3)', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.description}</div></div>
                      </div>
                    </td>
                    <td><span style={{ fontWeight: 700, color: 'var(--primary)' }}>₹{p.price}</span></td>
                    <td><span className={`badge ${p.veg ? 'badge-success' : 'badge-danger'}`}>{p.veg ? '🌿 VEG' : '🍗 NON-VEG'}</span></td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <label className="switch">
                          <input 
                            type="checkbox" 
                            checked={p.available} 
                            disabled={toggling === p._id}
                            onChange={() => handleToggleAvailability(p)}
                          />
                          <span className="slider"></span>
                        </label>
                        <span style={{ fontSize: 13, fontWeight: 500, color: p.available ? 'var(--success)' : 'var(--text-3)' }}>
                          {toggling === p._id ? '...' : p.available ? 'Active' : 'Hidden'}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={() => openEdit(p)} className="btn btn-ghost btn-sm">✏️ Edit</button>
                        <button onClick={() => onDelete(p._id)} disabled={deleting === p._id} className="btn btn-danger btn-sm">{deleting === p._id ? '...' : '🗑️'}</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && <tr><td colSpan={5} style={{ textAlign: 'center', padding: 40, color: 'var(--text-3)' }}>No products found</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <>
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 199 }} onClick={() => setShowModal(false)} />
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '90%', maxWidth: 520, background: 'var(--bg-card)', borderRadius: 'var(--r-lg)', boxShadow: '0 24px 80px rgba(0,0,0,0.25)', zIndex: 200, padding: 32, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
              <h3 style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: 20 }}>{editProduct ? 'Edit Product' : 'Add New Product'}</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: 'var(--text-3)' }}>✕</button>
            </div>
            <form onSubmit={onSave} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[['Title', 'title', 'text', 'Chicken Biryani'], ['Description', 'description', 'text', 'Fragrant basmati rice...'], ['Price (₹)', 'price', 'number', '299']].map(([label, key, type, ph]) => (
                <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)' }}>{label}</label>
                  <input className="input" type={type} placeholder={ph} required value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} />
                </div>
              ))}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)' }}>Type</label>
                  <select className="input" value={form.veg} onChange={e => setForm(f => ({ ...f, veg: e.target.value === 'true' }))}>
                    <option value="true">🌿 Vegetarian</option>
                    <option value="false">🍗 Non-Veg</option>
                  </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)' }}>Status</label>
                  <select className="input" value={form.available} onChange={e => setForm(f => ({ ...f, available: e.target.value === 'true' }))}>
                    <option value="true">✅ Available</option>
                    <option value="false">❌ Unavailable</option>
                  </select>
                </div>
              </div>
              {!editProduct && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)' }}>Images</label>
                  <input ref={filesRef} type="file" accept="image/*" multiple className="input" style={{ padding: '8px' }} />
                </div>
              )}
              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <button type="submit" disabled={saving} className="btn btn-primary" style={{ flex: 1 }}>{saving ? 'Saving...' : editProduct ? '💾 Update Product' : '➕ Add Product'}</button>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-ghost">Cancel</button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}

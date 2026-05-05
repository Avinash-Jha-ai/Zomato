import { useEffect, useRef, useState } from 'react';
import { getHeroSections, uploadHero, deleteHeroSection } from '../services/admin.service';

export default function HeroManager() {
  const [heroes, setHeroes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [form, setForm] = useState({ title: '', description: '' });
  const fileRef = useRef();

  const load = () => getHeroSections().then(d => setHeroes(d.hero || [])).catch(console.error).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const onUpload = async (e) => {
    e.preventDefault();
    if (!fileRef.current?.files?.[0]) { alert('Please select a file'); return; }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('title', form.title);
      fd.append('description', form.description);
      fd.append('hero', fileRef.current.files[0]);
      await uploadHero(fd);
      setForm({ title: '', description: '' });
      if (fileRef.current) fileRef.current.value = '';
      load();
    } catch (err) { alert(err?.response?.data?.message || 'Upload failed'); }
    finally { setUploading(false); }
  };

  const onDelete = async (id) => {
    if (!confirm('Delete this hero banner?')) return;
    setDeleting(id);
    try { await deleteHeroSection(id); setHeroes(h => h.filter(x => x._id !== id)); }
    catch { alert('Delete failed'); }
    finally { setDeleting(null); }
  };

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, fontFamily: 'Inter', marginBottom: 4 }}>Hero Banners</h1>
        <p style={{ color: 'var(--text-2)', fontSize: 14 }}>Manage homepage hero slider images</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }}>
        {/* Upload form */}
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ fontWeight: 700, marginBottom: 20, fontSize: 16 }}>➕ Upload New Banner</h3>
          <form onSubmit={onUpload} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)' }}>Title</label>
              <input className="input" placeholder="Fresh & Delicious" required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)' }}>Description</label>
              <input className="input" placeholder="Order in 30 minutes" required value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)' }}>Banner Image</label>
              <input ref={fileRef} type="file" accept="image/*" required className="input" style={{ padding: 8 }} />
            </div>
            <button type="submit" disabled={uploading} className="btn btn-primary" style={{ marginTop: 4 }}>
              {uploading ? '⏳ Uploading...' : '🖼️ Upload Banner'}
            </button>
          </form>
        </div>

        {/* List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontWeight: 700, fontSize: 16 }}>Active Banners ({heroes.length})</h3>
          </div>
          {loading ? (
            [1,2,3].map(i => <div key={i} className="card skeleton" style={{ height: 100 }} />)
          ) : heroes.length === 0 ? (
            <div className="card" style={{ padding: 40, textAlign: 'center', color: 'var(--text-3)' }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>🖼️</div>
              <div>No hero banners yet</div>
            </div>
          ) : (
            heroes.map(h => (
              <div key={h._id} className="card fade-in" style={{ overflow: 'hidden', display: 'flex', gap: 0 }}>
                <div style={{ width: 120, flexShrink: 0, background: 'var(--bg)' }}>
                  <img src={h.content} alt={h.title} style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: 90 }} />
                </div>
                <div style={{ padding: '14px 16px', flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{h.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{h.description}</div>
                  <button onClick={() => onDelete(h._id)} disabled={deleting === h._id} className="btn btn-danger btn-sm">
                    {deleting === h._id ? 'Deleting...' : '🗑️ Delete'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <style>{`@media(max-width:768px){div[style*="gridTemplateColumns: '1fr 1fr'"]{grid-template-columns:1fr!important;}}`}</style>
    </div>
  );
}

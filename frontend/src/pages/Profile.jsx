import { useEffect, useRef, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import Cropper from 'react-easy-crop';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useToast } from '../contexts/ToastContext';
import { setUser } from '../states/auth.slice';
import API from '../utils/axios';
import { getCroppedImgBlob } from '../utils/cropImage';

// Simple Modal Component for Cropping
const CropModal = ({ image, aspect, onCropComplete, onCancel }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropChange = useCallback((crop) => setCrop(crop), []);
  const onZoomChange = useCallback((zoom) => setZoom(zoom), []);
  const onCropAreaComplete = useCallback((_, pixels) => setCroppedAreaPixels(pixels), []);

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1000,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20
    }}>
      <div style={{ position: 'relative', width: '100%', maxWidth: 600, height: 400, background: '#000', borderRadius: 12, overflow: 'hidden' }}>
        <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          aspect={aspect}
          onCropChange={onCropChange}
          onZoomChange={onZoomChange}
          onCropComplete={onCropAreaComplete}
        />
      </div>
      <div style={{ marginTop: 24, width: '100%', maxWidth: 600, display: 'flex', gap: 12, alignItems: 'center' }}>
        <input type="range" value={zoom} min={1} max={3} step={0.1} onChange={(e) => setZoom(e.target.value)} style={{ flex: 1 }} />
        <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        <button className="btn btn-primary" onClick={() => onCropComplete(croppedAreaPixels)}>Apply Crop</button>
      </div>
    </div>
  );
};

export default function Profile() {
  const { user } = useSelector(s => s.auth);
  const dispatch = useDispatch();
  const toast = useToast();
  const [tab, setTab] = useState('info');
  const [form, setForm] = useState({ name: '', address: '', mobile: '' });
  const [saving, setSaving] = useState(false);
  const bannerRef = useRef();
  const avatarRef = useRef();
  const [preview, setPreview] = useState({ banner: null, avatar: null });
  const [blobs, setBlobs] = useState({ banner: null, avatar: null });

  // Cropper state
  const [cropState, setCropState] = useState({ active: false, image: null, type: null, aspect: 1 });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) setForm({ name: user.username || '', address: user.address || '', mobile: user.phone || '' });
  }, [user]);

  const onSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('address', form.address);
      fd.append('mobile', form.mobile);
      
      if (blobs.banner) fd.append('banner', blobs.banner, 'banner.jpg');
      if (blobs.avatar) fd.append('avatar', blobs.avatar, 'avatar.jpg');

      const res = await API.post('/auth/profile/update', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      
      if (res.data.success) {
        dispatch(setUser(res.data.user)); 
        toast.success('Profile updated successfully!');
        setBlobs({ banner: null, avatar: null });
        setPreview({ banner: null, avatar: null });
        setIsEditing(false);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleFileSelect = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCropState({
          active: true,
          image: reader.result,
          type,
          aspect: type === 'banner' ? 1200 / 300 : 1 // Banner aspect ratio (e.g. 4:1)
        });
      };
      reader.readAsDataURL(file);
    }
    // Reset input
    e.target.value = '';
  };

  const onCropDone = async (pixelCrop) => {
    try {
      const blob = await getCroppedImgBlob(cropState.image, pixelCrop);
      const url = URL.createObjectURL(blob);
      setPreview(p => ({ ...p, [cropState.type]: url }));
      setBlobs(b => ({ ...b, [cropState.type]: blob }));
      setCropState({ active: false, image: null, type: null, aspect: 1 });
    } catch (e) {
      toast.error('Failed to crop image');
    }
  };

  const tabs = [{ key: 'info', label: '👤 Profile' }, { key: 'orders', label: '📦 Orders' }];

  const InfoItem = ({ icon, label, value, fullWidth }) => (
    <div style={{ 
      gridColumn: fullWidth ? '1 / -1' : 'auto',
      padding: 20, 
      background: 'rgba(var(--primary-rgb), 0.03)', 
      borderRadius: 'var(--r-lg)',
      border: '1px solid var(--border)',
      display: 'flex',
      gap: 16,
      alignItems: 'flex-start'
    }}>
      <div style={{ fontSize: 24, padding: 10, background: '#fff', borderRadius: 'var(--r-md)', boxShadow: 'var(--shadow-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>
      <div>
        <p style={{ fontSize: 12, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700, marginBottom: 4 }}>{label}</p>
        <p style={{ fontSize: 16, color: 'var(--text-1)', fontWeight: 500, lineHeight: 1.5 }}>{value || 'Not specified'}</p>
      </div>
    </div>
  );

  return (
    <div className="page">
      <Navbar />
      <main className="container" style={{ paddingTop: 32, paddingBottom: 64 }}>
        {cropState.active && (
          <CropModal
            image={cropState.image}
            aspect={cropState.aspect}
            onCancel={() => setCropState({ active: false, image: null, type: null, aspect: 1 })}
            onCropComplete={onCropDone}
          />
        )}

        {/* Profile Header Wrapper */}
        <div style={{ position: 'relative', marginBottom: 80 }}>
          {/* Banner */}
          <div style={{ borderRadius: 'var(--r-xl)', overflow: 'hidden', height: 240, background: 'var(--bg-2)', boxShadow: 'inset 0 0 100px rgba(0,0,0,0.1)' }}>
            <div style={{
              width: '100%', height: '100%',
              background: preview.banner ? `url(${preview.banner}) center/cover` : user?.banner ? `url(${user.banner}) center/cover` : 'linear-gradient(135deg, #FF6B35, #FF8E53)',
              transition: 'all 0.3s',
            }} />
          </div>
          
          <button onClick={() => bannerRef.current?.click()} style={{
            position: 'absolute', top: 16, right: 16,
            background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none', backdropFilter: 'blur(8px)',
            padding: '10px 20px', borderRadius: 'var(--r-full)', fontSize: 13, cursor: 'pointer',
            fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.2s',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
          }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
            📷 Change Banner
          </button>
          <input ref={bannerRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleFileSelect(e, 'banner')} />

          {/* Avatar */}
          <div style={{ position: 'absolute', bottom: -60, left: 48, display: 'flex', alignItems: 'flex-end', gap: 24 }}>
            <div style={{ width: 140, height: 140, borderRadius: '50%', border: '6px solid var(--bg-card)', overflow: 'hidden', background: 'var(--primary)', cursor: 'pointer', position: 'relative', boxShadow: '0 12px 32px rgba(0,0,0,0.2)' }}
              onClick={() => avatarRef.current?.click()}>
              {(preview.avatar || user?.avatar)
                ? <img src={preview.avatar || user.avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48, color: '#fff', fontWeight: 700 }}>{user?.username?.[0]?.toUpperCase() || 'U'}</div>
              }
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.3s' }}
                onMouseEnter={e => e.currentTarget.style.opacity = 1}
                onMouseLeave={e => e.currentTarget.style.opacity = 0}>
                <span style={{ color: '#fff', fontSize: 24 }}>📷</span>
              </div>
            </div>
            <input ref={avatarRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleFileSelect(e, 'avatar')} />
            
            <div style={{ paddingBottom: 20 }}>
              <h1 style={{ fontSize: 32, fontWeight: 800, color: 'var(--text-1)', marginBottom: 4 }}>{user?.username}</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <p style={{ color: 'var(--text-2)', fontSize: 16 }}>{user?.email}</p>
                <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--border)' }}></span>
                <span className={`badge badge-${user?.role === 'admin' ? 'primary' : 'veg'}`} style={{ padding: '4px 12px', fontSize: 12 }}>
                  {user?.role === 'admin' ? '👑 Administrator' : '🍽️ Food Enthusiast'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 32, borderBottom: '1px solid var(--border)', marginBottom: 40, marginTop: 20, paddingLeft: 12 }}>
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              padding: '12px 4px', border: 'none', background: 'none', cursor: 'pointer',
              color: tab === t.key ? 'var(--primary)' : 'var(--text-2)',
              borderBottom: `3px solid ${tab === t.key ? 'var(--primary)' : 'transparent'}`,
              fontWeight: 700, fontSize: 15, marginBottom: -1, transition: 'all 0.2s',
            }}>{t.label}</button>
          ))}
        </div>

        {tab === 'info' && (
          <div style={{ width: '100%' }}>
            {isEditing ? (
              <div style={{ background: 'var(--bg-card)', padding: 40, borderRadius: 'var(--r-xl)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-lg)', maxWidth: 1000 }}>
                <div style={{ marginBottom: 32 }}>
                  <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Update Profile</h3>
                  <p style={{ color: 'var(--text-2)' }}>Modify your personal information and delivery preferences.</p>
                </div>
                
                <form onSubmit={onSave} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                    <div className="input-group">
                      <label style={{ fontWeight: 600, marginBottom: 8, display: 'block' }}>Full Name</label>
                      <input className="input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Your name" style={{ padding: '12px 16px' }} />
                    </div>
                    <div className="input-group">
                      <label style={{ fontWeight: 600, marginBottom: 8, display: 'block' }}>Phone Number</label>
                      <input className="input" value={form.mobile} onChange={e => setForm(f => ({ ...f, mobile: e.target.value }))} placeholder="10-digit mobile number" style={{ padding: '12px 16px' }} />
                    </div>
                  </div>
                  
                  <div className="input-group">
                    <label style={{ fontWeight: 600, marginBottom: 8, display: 'block' }}>Email Address</label>
                    <input className="input" value={user?.email || ''} disabled style={{ opacity: 0.6, cursor: 'not-allowed', background: 'var(--bg-2)', padding: '12px 16px' }} />
                    <span className="input-hint" style={{ fontSize: 12, marginTop: 6, color: 'var(--text-3)' }}>Email cannot be changed for security reasons</span>
                  </div>
                  
                  <div className="input-group">
                    <label style={{ fontWeight: 600, marginBottom: 8, display: 'block' }}>Delivery Address</label>
                    <textarea className="input" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} placeholder="Enter your full address" rows={4} style={{ resize: 'none', padding: '12px 16px' }} />
                  </div>
                  
                  <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                    <button type="submit" disabled={saving} className="btn btn-primary btn-lg" style={{ padding: '12px 32px' }}>
                      {saving ? 'Saving...' : '💾 Save Changes'}
                    </button>
                    <button type="button" onClick={() => setIsEditing(false)} className="btn btn-secondary btn-lg" style={{ padding: '12px 32px' }}>
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div style={{ background: 'var(--bg-card)', padding: 40, borderRadius: 'var(--r-xl)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
                  <div>
                    <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Account Details</h3>
                    <p style={{ color: 'var(--text-2)' }}>Your personal information as it appears on the platform.</p>
                  </div>
                  <button onClick={() => setIsEditing(true)} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', fontWeight: 600 }}>
                    <span>✏️</span> Edit Profile
                  </button>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
                  <InfoItem icon="📧" label="Email Address" value={user?.email} />
                  <InfoItem icon="📞" label="Phone Number" value={user?.phone} />
                  <InfoItem icon="📍" label="Delivery Address" value={user?.address} fullWidth />
                  <InfoItem icon="📅" label="Member Since" value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recently'} />
                </div>
              </div>
            )}
          </div>
        )}

        {tab === 'orders' && (
          <div className="empty-state" style={{ background: 'var(--bg-card)', padding: '80px 40px', borderRadius: 'var(--r-xl)', border: '1px solid var(--border)' }}>
            <div className="empty-icon" style={{ fontSize: 64, marginBottom: 24 }}>📦</div>
            <div className="empty-title" style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>No orders yet</div>
            <div className="empty-text" style={{ color: 'var(--text-2)', marginBottom: 32, maxWidth: 400, margin: '0 auto 32px' }}>You haven't placed any orders yet. Start exploring our delicious menu and place your first order!</div>
            <Link to="/" className="btn btn-primary btn-lg" style={{ padding: '12px 32px' }}>Explore Menu</Link>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

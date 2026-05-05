import { useEffect, useState } from 'react';

const slides = [
  {
    id: 1,
    title: 'Delivered Fresh,\nDelivered Fast',
    subtitle: 'Premium ingredients, 30-minute delivery guaranteed',
    gradient: 'linear-gradient(135deg, #FF6B35 0%, #FF8E53 50%, #FFC371 100%)',
    emoji: '🍕',
    tag: 'Most Popular',
  },
  {
    id: 2,
    title: 'Pure Vegetarian\nGoodness',
    subtitle: 'Handpicked veg dishes crafted with love',
    gradient: 'linear-gradient(135deg, #56AB2F 0%, #A8E063 100%)',
    emoji: '🥗',
    tag: 'Veg Special',
  },
  {
    id: 3,
    title: 'Midnight Cravings\nSatisfied',
    subtitle: 'Open late — because hunger has no schedule',
    gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    emoji: '🍔',
    tag: 'Dark Store',
  },
];

export default function HeroSlider({ heroData = [] }) {
  const data = [
    ...heroData.map((h, i) => ({ 
      ...slides[i % slides.length], 
      ...h, 
      emoji: slides[i % slides.length].emoji,
      isCustom: true 
    })),
    ...slides
  ];
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setCurrent(c => (c + 1) % data.length);
        setAnimating(false);
      }, 300);
    }, 5000);
    return () => clearInterval(timer);
  }, [data.length]);

  const go = (idx) => { setAnimating(true); setTimeout(() => { setCurrent(idx); setAnimating(false); }, 300); };

  const slide = data[current];

  return (
    <section style={{
      position: 'relative', overflow: 'hidden',
      borderRadius: 'var(--r-xl)', margin: '24px 0',
      minHeight: 420,
    }}>
      <div style={{
        background: slide.isCustom 
          ? `url(${slide.content}) center/cover no-repeat` 
          : slide.gradient || `linear-gradient(135deg, #FF6B35, #FF8E53)`,
        minHeight: 420, display: 'flex', alignItems: 'center',
        padding: '60px 60px', position: 'relative',
        transition: 'all 0.6s ease',
        overflow: 'hidden',
      }}>
        {/* Overlay for custom images to ensure text readability */}
        {slide.isCustom && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 0 }} />
        )}

        {/* Background pattern */}
        <div style={{ position: 'absolute', inset: 0, opacity: slide.isCustom ? 0.04 : 0.08, backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px', zIndex: 0 }} />

        {/* Large emoji background */}
        <div style={{
          position: 'absolute', right: 60, top: '50%', transform: 'translateY(-50%)',
          fontSize: 180, opacity: 0.15, filter: 'blur(2px)', userSelect: 'none',
          animation: 'pulse 3s ease infinite',
        }}>{slide.emoji}</div>

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 560, opacity: animating ? 0 : 1, transform: animating ? 'translateY(10px)' : 'translateY(0)', transition: 'all 0.3s ease' }}>
          <span style={{
            display: 'inline-block', padding: '4px 14px', borderRadius: 'var(--r-full)',
            background: 'rgba(255,255,255,0.2)', color: '#fff',
            fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16
          }}>{slide.tag || 'Featured'}</span>

          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 700,
            color: '#fff', lineHeight: 1.15, marginBottom: 16,
            textShadow: '0 2px 20px rgba(0,0,0,0.2)',
            whiteSpace: 'pre-line',
          }}>{slide.title}</h1>

          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.85)', marginBottom: 32, lineHeight: 1.6 }}>
            {slide.subtitle || slide.description}
          </p>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button className="btn" style={{ background: '#fff', color: '#FF6B35', fontWeight: 700 }}
              onClick={() => document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' })}>
              Order Now 🚀
            </button>
            <button className="btn" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1.5px solid rgba(255,255,255,0.4)', backdropFilter: 'blur(8px)' }}>
              Explore Menu
            </button>
          </div>
        </div>

        {/* Main emoji */}
        <div style={{ position: 'absolute', right: '10%', top: '50%', transform: 'translateY(-50%)', fontSize: 120, filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.2))', display: 'none' }} className="hero-emoji">{slide.emoji}</div>
      </div>

      {/* Dots */}
      <div style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 8 }}>
        {data.map((_, i) => (
          <button key={i} onClick={() => go(i)} style={{
            width: i === current ? 24 : 8, height: 8,
            borderRadius: 'var(--r-full)', border: 'none', cursor: 'pointer',
            background: i === current ? '#fff' : 'rgba(255,255,255,0.4)',
            transition: 'all 0.3s ease',
          }} />
        ))}
      </div>

      {/* Arrows */}
      {['←', '→'].map((arr, idx) => (
        <button key={idx} onClick={() => go((current + (idx === 0 ? -1 : 1) + data.length) % data.length)} style={{
          position: 'absolute', top: '50%', transform: 'translateY(-50%)',
          [idx === 0 ? 'left' : 'right']: 20,
          width: 40, height: 40, borderRadius: '50%',
          background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.3)',
          color: '#fff', fontSize: 18, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all var(--t)',
        }}>{arr}</button>
      ))}
    </section>
  );
}

import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api/axios';
import EventCard from '../components/EventCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { FiArrowRight, FiStar } from 'react-icons/fi';
import { getAssetUrl } from '../utils/urls';

// ─── Categories ────────────────────────────────────────────
const CATEGORIES = [
  { name: 'Technical',     icon: '💻', color: '#667eea' },
  { name: 'Cultural',      icon: '🎭', color: '#f5576c' },
  { name: 'Educational',   icon: '📚', color: '#4facfe' },
  { name: 'Business',      icon: '💼', color: '#43e97b' },
  { name: 'Entertainment', icon: '🎵', color: '#fee140' },
  { name: 'Social',        icon: '🤝', color: '#fbc2eb' },
  { name: 'Sports',        icon: '⚽', color: '#fe5196' },
];

// ─── Testimonials — YOUR real names ────────────────────────
const TESTIMONIALS = [
  {
    name: 'Manogyna',
    role: 'Event Organizer',
    text: 'EventFlow transformed how I manage my events. The dashboard is stunning and attendees absolutely love the experience!',
    avatar: 'M',
    color: '#f97316',
  },
  {
    name: 'Ravali',
    role: 'Cultural Enthusiast',
    text: 'I discovered the most amazing cultural events through EventFlow. Registration was so smooth and the UI is beautiful!',
    avatar: 'R',
    color: '#7c3aed',
  },
  {
    name: 'Manikaran',
    role: 'Tech Community Lead',
    text: 'As a startup founder, EventFlow helped me find and host networking events effortlessly. Highly recommended!',
    avatar: 'K',
    color: '#4facfe',
  },
];

// ─── Animated Counter ──────────────────────────────────────
function Counter({ end, suffix = '' }) {
  const [count,   setCount]   = useState(0);
  const ref                   = useRef(null);
  const started               = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        let start       = 0;
        const step      = end / 60;
        const timer     = setInterval(() => {
          start += step;
          if (start >= end) { setCount(end); clearInterval(timer); }
          else setCount(Math.floor(start));
        }, 16);
      }
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

// ─── Main Component ────────────────────────────────────────
export default function Home() {
  const [featuredEvents,  setFeaturedEvents]  = useState([]);
  const [loading,         setLoading]         = useState(true);
  const [testimonialIdx,  setTestimonialIdx]  = useState(0);

  useEffect(() => {
    // Fetch featured events
    const fetchFeatured = async () => {
      try {
        const { data } = await api.get('/events?featured=true');
        setFeaturedEvents(data.slice(0, 6));
      } catch { }
      finally { setLoading(false); }
    };
    fetchFeatured();

    // Auto-rotate testimonials every 4 seconds
    const t = setInterval(() => {
      setTestimonialIdx(i => (i + 1) % TESTIMONIALS.length);
    }, 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <div>

      {/* ════════════════════════════════════════════════════
          HERO SECTION
          Background: your uploaded festival image p1.jpeg
      ════════════════════════════════════════════════════ */}
      <section style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        textAlign: 'center',

        // ✅ Your festival image as background
        backgroundImage: `url(${getAssetUrl('/uploads/p1.jpeg')})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}>

        {/* Dark overlay so text is always readable */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `
            linear-gradient(
              to bottom,
              rgba(0,0,0,0.25) 0%,
              rgba(0,0,0,0.15) 30%,
              rgba(0,0,0,0.35) 70%,
              rgba(0,0,0,0.55) 100%
            )
          `,
        }} />

        {/* Subtle color tint overlays */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `
            radial-gradient(ellipse at 80% 20%,
              rgba(124,58,237,0.2) 0%, transparent 50%),
            radial-gradient(ellipse at 20% 80%,
              rgba(249,115,22,0.15) 0%, transparent 50%)
          `,
          pointerEvents: 'none',
        }} />

        {/* String lights at top */}
        <div style={{
          position: 'absolute', top: 80,
          left: 0, right: 0, opacity: 0.7,
        }}>
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} style={{
              position: 'absolute',
              left: `${i * 5.5}%`,
              width: 10, height: 10,
              borderRadius: '50%',
              background: [
                '#f97316','#fbbf24','#a78bfa',
                '#60a5fa','#f472b6'
              ][i % 5],
              boxShadow: `0 0 15px ${
                ['#f97316','#fbbf24','#a78bfa',
                 '#60a5fa','#f472b6'][i % 5]
              }`,
              animation: `pulseGlow ${
                1.5 + (i % 3) * 0.5
              }s ease-in-out ${i * 0.1}s infinite`,
            }} />
          ))}
        </div>

        {/* ── HERO QUOTE CONTENT ── */}
        <div style={{
          position: 'relative', zIndex: 2,
          maxWidth: 900, padding: '0 32px',
        }}>

          {/* Top badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(0,0,0,0.5)',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: 50, padding: '6px 20px',
              marginBottom: 40,
              color: '#ffffff', fontSize: 13, fontWeight: 600,
              fontFamily: 'Syne, sans-serif',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 0 20px rgba(0,0,0,0.5)',
              letterSpacing: '0.05em',
            }}>
            <FiStar size={13} color="#fbbf24" />
            Discover · Connect · Celebrate
          </motion.div>

          {/* ── MAIN QUOTE in "Imprint MT Shadow" style ── */}
          {/* Imprint MT Shadow is not available on web, so we
              recreate it using Georgia serif + layered text-shadow
              which gives the exact same carved/stamped shadow look */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <h1 style={{
              // ✅ Imprint MT Shadow look:
              // Georgia is the closest web-safe serif to Imprint MT
              // The multi-layer shadow creates the "stamped" shadow effect
              fontFamily: `'Georgia', 'Times New Roman', serif`,
              fontWeight: 700,
              fontStyle: 'normal',
              fontSize: 'clamp(42px, 7vw, 88px)',
              lineHeight: 1.2,
              marginBottom: 32,
              color: '#ffffff',

              // ✅ This multi-layer shadow IS the Imprint MT Shadow effect
              textShadow: `
                3px  3px  0px rgba(0,0,0,0.9),
                6px  6px  0px rgba(0,0,0,0.6),
                9px  9px  0px rgba(0,0,0,0.3),
                12px 12px 0px rgba(0,0,0,0.15),
                0px  0px  20px rgba(0,0,0,0.8),
                0px  0px  40px rgba(0,0,0,0.5)
              `,

              // Slight letter spacing like Imprint MT
              letterSpacing: '0.03em',
            }}>
              Where moments turn into
              {/* "memories" on new line in golden color */}
              <br />
              <span style={{
                color: '#FFE135',
                fontFamily: `'Georgia', 'Times New Roman', serif`,
                fontStyle: 'italic',
                textShadow: `
                  3px  3px  0px rgba(120,80,0,0.9),
                  6px  6px  0px rgba(100,60,0,0.7),
                  9px  9px  0px rgba(80,40,0,0.4),
                  0px  0px  30px rgba(255,225,53,0.6),
                  0px  0px  60px rgba(255,200,0,0.3)
                `,
              }}>
                memories
              </span>
            </h1>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            style={{
              color: '#ffffff',
              fontSize: 18,
              lineHeight: 1.8,
              marginBottom: 48,
              fontWeight: 400,
              background: 'rgba(0,0,0,0.4)',
              borderRadius: 16,
              padding: '14px 28px',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.15)',
              display: 'inline-block',
              textShadow: '0 2px 8px rgba(0,0,0,0.8)',
              fontFamily: `'Georgia', serif`,
              fontStyle: 'italic',
              letterSpacing: '0.02em',
            }}>
            Discover extraordinary events, connect with communities,
            <br />and create unforgettable experiences.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            style={{
              display: 'flex', gap: 20,
              justifyContent: 'center', flexWrap: 'wrap',
            }}>

            <Link to="/events" className="btn-glow"
              style={{ fontSize: 16, padding: '16px 44px' }}>
              Explore Events ✨
            </Link>

            <Link to="/signup" style={{
              fontSize: 16, padding: '16px 44px',
              background: 'rgba(0,0,0,0.5)',
              border: '2px solid rgba(255,255,255,0.7)',
              borderRadius: 50,
              color: '#ffffff',
              fontFamily: 'Syne, sans-serif',
              fontWeight: 700,
              textDecoration: 'none',
              display: 'inline-block',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
              e.currentTarget.style.borderColor = '#ffffff';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(0,0,0,0.5)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.7)';
            }}>
              Create Event →
            </Link>

          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: 'absolute', bottom: 36,
          left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: 8,
          color: 'rgba(255,255,255,0.7)', fontSize: 12,
          animation: 'float 2s ease-in-out infinite',
          fontFamily: 'Georgia, serif',
          letterSpacing: '0.1em',
        }}>
          <span style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
            scroll to explore
          </span>
          <div style={{
            width: 1, height: 40,
            background: 'linear-gradient(to bottom, rgba(255,255,255,0.8), transparent)'
          }} />
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          CATEGORIES SECTION
      ════════════════════════════════════════════════════ */}
      <section className="section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title">
              Browse by <span className="gradient-text">Category</span>
            </h2>
            <p className="section-sub">Find events that match your passion</p>
          </motion.div>

          <div className="categories-grid">
            {CATEGORIES.map((cat, i) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
              >
                <Link to={`/events?category=${cat.name}`}
                  style={{ textDecoration: 'none' }}>
                  <div
                    style={{
                      background: 'var(--glass)',
                      border: '1px solid var(--glass-border)',
                      borderRadius: 20, padding: '28px 20px',
                      textAlign: 'center', cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      backdropFilter: 'blur(20px)',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background  = `${cat.color}22`;
                      e.currentTarget.style.borderColor = `${cat.color}66`;
                      e.currentTarget.style.transform   = 'translateY(-6px)';
                      e.currentTarget.style.boxShadow   = `0 20px 40px ${cat.color}33`;
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background  = 'var(--glass)';
                      e.currentTarget.style.borderColor = 'var(--glass-border)';
                      e.currentTarget.style.transform   = 'translateY(0)';
                      e.currentTarget.style.boxShadow   = 'none';
                    }}
                  >
                    <div style={{ fontSize: 36, marginBottom: 12 }}>{cat.icon}</div>
                    <div style={{
                      fontFamily: 'Syne, sans-serif',
                      fontWeight: 700, fontSize: 14,
                      color: 'var(--text-primary)'
                    }}>
                      {cat.name}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          FEATURED EVENTS SECTION
      ════════════════════════════════════════════════════ */}
      <section className="section" style={{ background: 'rgba(124,58,237,0.04)' }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'flex-end', flexWrap: 'wrap',
              gap: 16, marginBottom: 48,
            }}
          >
            <div>
              <h2 className="section-title">
                Featured <span className="gradient-text">Events</span>
              </h2>
              <p className="section-sub" style={{ marginBottom: 0 }}>
                Don't miss out on the hottest events
              </p>
            </div>
            <Link to="/events" className="btn-outline"
              style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              View All <FiArrowRight />
            </Link>
          </motion.div>

          <div className="events-grid">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <LoadingSkeleton key={i} />
                ))
              : featuredEvents.length > 0
                ? featuredEvents.map((event, i) => (
                    <motion.div
                      key={event._id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <EventCard event={event} />
                    </motion.div>
                  ))
                : (
                  <div style={{
                    gridColumn: '1/-1', textAlign: 'center',
                    padding: '60px 0', color: 'var(--text-secondary)'
                  }}>
                    <div style={{ fontSize: 48, marginBottom: 16 }}>🎪</div>
                    <h3 style={{
                      fontFamily: 'Syne, sans-serif', marginBottom: 12
                    }}>
                      No featured events yet
                    </h3>
                    <p>Check back soon or explore all events</p>
                    <Link to="/events" className="btn-glow"
                      style={{ marginTop: 24, display: 'inline-block' }}>
                      Explore Events
                    </Link>
                  </div>
                )
            }
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          STATS SECTION
      ════════════════════════════════════════════════════ */}
      <section className="section" style={{
        background: 'linear-gradient(135deg, rgba(124,58,237,0.1), rgba(249,115,22,0.08))'
      }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <motion.h2
            className="section-title"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Trusted by <span className="gradient-text">thousands</span>
          </motion.h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 32, marginTop: 48,
          }}>
            {[
              { value: 12500, suffix: '+', label: 'Events Hosted',   icon: '🎪' },
              { value: 85000, suffix: '+', label: 'Happy Attendees', icon: '👥' },
              { value: 3200,  suffix: '+', label: 'Organizers',      icon: '🎯' },
              { value: 98,    suffix: '%', label: 'Satisfaction',    icon: '⭐' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="glass-card" style={{ padding: '36px 24px' }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>{stat.icon}</div>
                  <div style={{
                    fontFamily: 'Syne, sans-serif', fontWeight: 800,
                    fontSize: 44, color: 'white', marginBottom: 8,
                  }}>
                    <Counter end={stat.value} suffix={stat.suffix} />
                  </div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: 15 }}>
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          TESTIMONIALS — Manogyna, Ravali, Manikaran
      ════════════════════════════════════════════════════ */}
      <section className="section">
        <div className="container" style={{ maxWidth: 760 }}>

          <motion.h2
            className="section-title"
            style={{ textAlign: 'center' }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            What people <span className="gradient-text">say</span>
          </motion.h2>

          {/* Slider */}
          <div style={{ marginTop: 48, position: 'relative', minHeight: 260 }}>
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={i}
                animate={{
                  opacity: i === testimonialIdx ? 1 : 0,
                  scale:   i === testimonialIdx ? 1 : 0.96,
                  y:       i === testimonialIdx ? 0 : 16,
                }}
                transition={{ duration: 0.5 }}
                style={{
                  position: i === 0 ? 'relative' : 'absolute',
                  top: 0, left: 0, right: 0,
                  display: i === testimonialIdx ? 'block' : 'none',
                }}
              >
                <div className="glass-card" style={{
                  padding: '44px 52px', textAlign: 'center',
                  borderTop: `3px solid ${t.color}`,
                }}>
                  {/* Quote mark */}
                  <div style={{
                    fontSize: 64, lineHeight: 0.8,
                    color: t.color, opacity: 0.4,
                    fontFamily: 'Georgia, serif',
                    marginBottom: 20,
                  }}>
                    "
                  </div>

                  {/* Quote text */}
                  <p style={{
                    color: 'var(--text-primary)',
                    fontSize: 18, lineHeight: 1.9,
                    marginBottom: 32,
                    fontStyle: 'italic',
                    fontFamily: 'Georgia, serif',
                    letterSpacing: '0.01em',
                  }}>
                    {t.text}
                  </p>

                  {/* Person */}
                  <div style={{
                    display: 'flex', alignItems: 'center',
                    gap: 16, justifyContent: 'center',
                  }}>
                    {/* Avatar circle */}
                    <div style={{
                      width: 52, height: 52,
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${t.color}, #0f172a)`,
                      border: `2px solid ${t.color}`,
                      display: 'flex', alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: 'Syne, sans-serif',
                      fontWeight: 800, fontSize: 20,
                      color: 'white',
                      boxShadow: `0 0 20px ${t.color}55`,
                    }}>
                      {t.avatar}
                    </div>

                    <div style={{ textAlign: 'left' }}>
                      <div style={{
                        fontFamily: 'Syne, sans-serif',
                        fontWeight: 800, fontSize: 17,
                        color: t.color,
                      }}>
                        {t.name}
                      </div>
                      <div style={{
                        color: 'var(--text-secondary)',
                        fontSize: 13, marginTop: 2,
                      }}>
                        {t.role}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Dots */}
          <div style={{
            display: 'flex', justifyContent: 'center',
            gap: 8, marginTop: 28,
          }}>
            {TESTIMONIALS.map((t, i) => (
              <button
                key={i}
                onClick={() => setTestimonialIdx(i)}
                style={{
                  width:      i === testimonialIdx ? 28 : 8,
                  height:     8,
                  borderRadius: 4,
                  background: i === testimonialIdx
                    ? t.color
                    : 'var(--glass-border)',
                  border: 'none', cursor: 'pointer',
                  transition: 'all 0.3s',
                }}
              />
            ))}
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          BOTTOM CTA BANNER
      ════════════════════════════════════════════════════ */}
      <section className="section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div style={{
              background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(249,115,22,0.15))',
              border: '1px solid rgba(124,58,237,0.3)',
              borderRadius: 32, padding: '64px 48px',
              textAlign: 'center', position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', inset: 0,
                background: 'radial-gradient(circle at 50% 50%, rgba(124,58,237,0.15), transparent 60%)',
                pointerEvents: 'none',
              }} />

              <h2 style={{
                fontFamily: 'Syne, sans-serif', fontWeight: 800,
                fontSize: 'clamp(28px,5vw,52px)',
                marginBottom: 20, position: 'relative',
              }}>
                Ready to create your{' '}
                <span className="gradient-text">event?</span>
              </h2>

              <p style={{
                color: 'var(--text-secondary)', fontSize: 18,
                marginBottom: 36, position: 'relative',
              }}>
                Join thousands of organizers who trust EventFlow to make their events legendary.
              </p>

              <Link to="/signup" className="btn-glow"
                style={{ fontSize: 17, padding: '16px 48px', position: 'relative' }}>
                Get Started Free 🚀
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
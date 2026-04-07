import { Link } from 'react-router-dom';
import { FiCalendar, FiMapPin, FiUsers } from 'react-icons/fi';
import { format } from 'date-fns';
import { getAssetUrl } from '../utils/urls';

// Category color map — matches the colorful card design from image
const categoryColors = {
  Technical:     { bg: 'linear-gradient(135deg, #667eea, #764ba2)', glow: '#764ba2' },
  Cultural:      { bg: 'linear-gradient(135deg, #f093fb, #f5576c)', glow: '#f5576c' },
  Educational:   { bg: 'linear-gradient(135deg, #4facfe, #00f2fe)', glow: '#00f2fe' },
  Business:      { bg: 'linear-gradient(135deg, #43e97b, #38f9d7)', glow: '#38f9d7' },
  Entertainment: { bg: 'linear-gradient(135deg, #fa709a, #fee140)', glow: '#fee140' },
  Social:        { bg: 'linear-gradient(135deg, #a18cd1, #fbc2eb)', glow: '#fbc2eb' },
  Sports:        { bg: 'linear-gradient(135deg, #f77062, #fe5196)', glow: '#fe5196' },
};

export default function EventCard({ event }) {
  const colors = categoryColors[event.category] || categoryColors.Technical;
  const spotsLeft = event.capacity - event.registrationCount;

  return (
    <div style={{
      background: 'var(--dark-card)',
      border: '1px solid var(--glass-border)',
      borderRadius: 20,
      overflow: 'hidden',
      transition: 'all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
      cursor: 'pointer',
      position: 'relative',
    }}
    onMouseEnter={e => {
      e.currentTarget.style.transform = 'translateY(-8px)';
      e.currentTarget.style.boxShadow = `0 24px 60px ${colors.glow}33, 0 0 0 1px ${colors.glow}44`;
    }}
    onMouseLeave={e => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = 'none';
    }}>
      {/* Banner image / gradient header */}
      <div style={{
        height: 160,
        background: event.image ? `url(${getAssetUrl(event.image)}) center/cover` : colors.bg,
        position: 'relative',
        display: 'flex',
        alignItems: 'flex-end',
        padding: '0 20px 20px',
      }}>
        {/* Overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.7))', borderRadius: '0' }} />
        {/* Category badge */}
        <span style={{
          position: 'relative', zIndex: 2,
          background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: 20, padding: '4px 12px',
          fontSize: 11, fontWeight: 700, color: 'white',
          fontFamily: 'Syne, sans-serif', letterSpacing: '0.5px', textTransform: 'uppercase'
        }}>{event.category}</span>

        {/* Featured badge */}
        {event.featured && (
          <span style={{
            position: 'absolute', top: 14, right: 14, zIndex: 2,
            background: 'linear-gradient(135deg, #f97316, #ec4899)',
            borderRadius: 20, padding: '3px 10px', fontSize: 10,
            fontWeight: 700, color: 'white', fontFamily: 'Syne, sans-serif',
          }}>⭐ Featured</span>
        )}
      </div>

      {/* Card Body */}
      <div style={{ padding: '20px 22px 22px' }}>
        <h3 style={{
          fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 18,
          color: 'var(--text-primary)', marginBottom: 10, lineHeight: 1.3,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'
        }}>{event.title}</h3>

        <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.6, marginBottom: 16,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'
        }}>{event.description}</p>

        {/* Meta info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)', fontSize: 13 }}>
            <FiCalendar size={14} style={{ color: '#f97316' }} />
            {format(new Date(event.date), 'EEE, MMM d, yyyy · h:mm a')}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)', fontSize: 13 }}>
            <FiMapPin size={14} style={{ color: '#7c3aed' }} />
            {event.location}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: spotsLeft < 20 ? '#f97316' : 'var(--text-secondary)', fontSize: 13 }}>
            <FiUsers size={14} />
            {spotsLeft > 0 ? `${spotsLeft} spots left` : 'Full'}
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 18, color: event.price === 0 ? '#43e97b' : 'var(--text-primary)' }}>
            {event.price === 0 ? 'Free' : `₹${event.price}`}
          </span>
          <Link to={`/events/${event._id}`} style={{
            background: colors.bg, border: 'none', borderRadius: 50,
            padding: '10px 22px', color: 'white', fontFamily: 'Syne, sans-serif',
            fontWeight: 700, fontSize: 13, cursor: 'pointer', textDecoration: 'none',
            transition: 'all 0.2s', boxShadow: `0 4px 15px ${colors.glow}55`,
            display: 'inline-block'
          }}>Register →</Link>
        </div>
      </div>
    </div>
  );
}
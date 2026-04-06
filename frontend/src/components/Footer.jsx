import { Link } from 'react-router-dom';
import { MdEventNote } from 'react-icons/md';
import { FiTwitter, FiInstagram, FiLinkedin, FiGithub } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer style={{ background: 'rgba(0,0,0,0.5)', borderTop: '1px solid var(--glass-border)', backdropFilter: 'blur(20px)', padding: '60px 24px 30px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40, marginBottom: 48 }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#f97316)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MdEventNote size={18} color="white" />
              </div>
              <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 20, color: 'var(--text-primary)' }}>Event<span style={{ color: '#f97316' }}>Flow</span></span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.7 }}>Where moments turn into memories. Discover and join amazing events.</p>
            <div style={{ display: 'flex', gap: 14, marginTop: 20 }}>
              {[[FiTwitter, '#'], [FiInstagram, '#'], [FiLinkedin, '#'], [FiGithub, '#']].map(([Icon, href], i) => (
                <a key={i} href={href} style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--glass)', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#f97316'; e.currentTarget.style.borderColor = '#f97316'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--glass-border)'; }}>
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>
          {/* Links */}
          {[
            ['Explore', [['Events', '/events'], ['Categories', '/events'], ['Featured', '/events?featured=true']]],
            ['Account', [['Login', '/login'], ['Sign Up', '/signup'], ['Dashboard', '/dashboard']]],
            ['Company', [['About', '#'], ['Contact', '#'], ['Privacy', '#']]],
          ].map(([title, links]) => (
            <div key={title}>
              <h4 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 15, color: 'var(--text-primary)', marginBottom: 16 }}>{title}</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {links.map(([label, to]) => (
                  <Link key={label} to={to} style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: 14, transition: 'color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#f97316'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}>
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: 24, textAlign: 'center', color: 'var(--text-secondary)', fontSize: 13 }}>
          © {new Date().getFullYear()} EventFlow. Made with ❤️ for unforgettable experiences.
        </div>
      </div>
    </footer>
  );
}
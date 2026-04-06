import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FiSun, FiMoon, FiMenu, FiX, FiUser, FiLogOut } from 'react-icons/fi';
import { MdEventNote } from 'react-icons/md';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => { logout(); navigate('/'); setDropOpen(false); };

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin';
    if (user.role === 'organizer') return '/organizer';
    return '/dashboard';
  };

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      background: scrolled ? 'rgba(10,10,15,0.9)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(255,255,255,0.08)' : 'none',
      transition: 'all 0.3s ease', padding: '0 24px',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 72 }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 38, height: 38, borderRadius: '50%',
            background: 'linear-gradient(135deg, #7c3aed, #f97316)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 20px rgba(124,58,237,0.4)'
          }}>
            <MdEventNote size={20} color="white" />
          </div>
          <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 22, color: 'var(--text-primary)' }}>
            Event<span style={{ color: '#f97316' }}>Flow</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 32, ['@media(max-width:768px)']: { display: 'none' } }} className="desktop-nav">
          {[['/', 'Home'], ['/events', 'Events']].map(([path, label]) => (
            <Link key={path} to={path} style={{
              color: location.pathname === path ? '#f97316' : 'var(--text-secondary)',
              textDecoration: 'none', fontWeight: 500, fontSize: 15, transition: 'color 0.2s'
            }}>{label}</Link>
          ))}
        </div>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={toggleDarkMode} style={{
            background: 'var(--glass)', border: '1px solid var(--glass-border)',
            borderRadius: '50%', width: 38, height: 38, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-primary)'
          }}>
            {darkMode ? <FiSun size={16} /> : <FiMoon size={16} />}
          </button>

          {user ? (
            <div style={{ position: 'relative' }}>
              <button onClick={() => setDropOpen(!dropOpen)} style={{
                display: 'flex', alignItems: 'center', gap: 8, background: 'var(--glass)',
                border: '1px solid var(--glass-border)', borderRadius: 50, padding: '6px 16px 6px 6px',
                cursor: 'pointer', color: 'var(--text-primary)'
              }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#f97316)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>
                  {user.name[0].toUpperCase()}
                </div>
                <span style={{ fontSize: 14, fontWeight: 500 }}>{user.name.split(' ')[0]}</span>
              </button>
              {dropOpen && (
                <div style={{
                  position: 'absolute', top: '120%', right: 0, background: 'rgba(15,15,25,0.95)',
                  border: '1px solid var(--glass-border)', borderRadius: 16, padding: 8,
                  minWidth: 180, backdropFilter: 'blur(20px)', zIndex: 100
                }}>
                  <Link to={getDashboardPath()} onClick={() => setDropOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 10, color: 'var(--text-primary)', textDecoration: 'none', fontSize: 14 }}>
                    <FiUser size={15} /> Dashboard
                  </Link>
                  <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 10, color: '#f97316', background: 'none', border: 'none', cursor: 'pointer', width: '100%', fontSize: 14, fontFamily: 'DM Sans' }}>
                    <FiLogOut size={15} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 10 }}>
              <Link to="/login" className="btn-outline" style={{ padding: '8px 20px', fontSize: 14 }}>Login</Link>
              <Link to="/signup" className="btn-glow" style={{ padding: '8px 20px', fontSize: 14 }}>Sign Up</Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', display: 'none' }} className="mobile-menu-btn">
            {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <div style={{ background: 'rgba(10,10,15,0.98)', borderTop: '1px solid var(--glass-border)', padding: 24 }}>
          {[['/', 'Home'], ['/events', 'Events'], [getDashboardPath(), 'Dashboard']].map(([path, label]) => (
            <Link key={path} to={path} onClick={() => setMenuOpen(false)} style={{ display: 'block', padding: '12px 0', color: 'var(--text-primary)', textDecoration: 'none', fontSize: 18, fontWeight: 600, borderBottom: '1px solid var(--glass-border)' }}>
              {label}
            </Link>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { FiCalendar, FiMapPin, FiTrash2, FiUser } from 'react-icons/fi';

const statusColors = { confirmed: '#43e97b', waitlisted: '#fbbf24', cancelled: '#ef4444' };

export default function UserDashboard() {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('events');

  useEffect(() => {
    const fetchRegs = async () => {
      try {
        const { data } = await api.get('/registrations/myregistrations');
        setRegistrations(data);
      } catch { toast.error('Failed to load registrations'); }
      finally { setLoading(false); }
    };
    fetchRegs();
  }, []);

  const cancelRegistration = async (id) => {
    if (!confirm('Cancel this registration?')) return;
    try {
      await api.delete(`/registrations/${id}`);
      setRegistrations(prev => prev.filter(r => r._id !== id));
      toast.success('Registration cancelled');
    } catch { toast.error('Failed to cancel'); }
  };

  return (
    <div style={{ paddingTop: 90, minHeight: '100vh' }}>
      <div className="container section">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 8 }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#f97316)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 28, color: 'white' }}>
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 32 }}>Hello, {user?.name?.split(' ')[0]}! 👋</h1>
              <p style={{ color: 'var(--text-secondary)' }}>{user?.email} · {user?.role}</p>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 16, marginBottom: 40 }}>
          {[
            { label: 'Registered', value: registrations.length, icon: '🎟️' },
            { label: 'Upcoming', value: registrations.filter(r => r.event?.status === 'upcoming').length, icon: '📅' },
            { label: 'Attended', value: registrations.filter(r => r.event?.status === 'completed').length, icon: '✅' },
          ].map(stat => (
            <div key={stat.label} className="glass-card" style={{ padding: '24px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>{stat.icon}</div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 32, color: 'white' }}>{stat.value}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, background: 'rgba(0,0,0,0.2)', borderRadius: 50, padding: 4, width: 'fit-content', marginBottom: 32 }}>
          {['events', 'profile'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              padding: '8px 24px', borderRadius: 50, border: 'none', cursor: 'pointer',
              background: activeTab === tab ? 'linear-gradient(135deg,#7c3aed,#f97316)' : 'transparent',
              color: 'white', fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: 14,
              textTransform: 'capitalize', transition: 'all 0.2s',
            }}>{tab === 'events' ? '🎟️ My Events' : '👤 Profile'}</button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'events' ? (
          loading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>Loading...</div>
          ) : registrations.length === 0 ? (
            <div className="glass-card" style={{ padding: '64px', textAlign: 'center' }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>🎪</div>
              <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: 22, marginBottom: 12 }}>No registrations yet</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>Discover amazing events and register!</p>
              <a href="/events" className="btn-glow">Explore Events</a>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {registrations.map((reg, i) => (
                <motion.div key={reg._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
                  <div className="glass-card" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1, minWidth: 200 }}>
                      <div style={{ width: 56, height: 56, borderRadius: 14, background: 'linear-gradient(135deg,rgba(124,58,237,0.3),rgba(249,115,22,0.2))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 24 }}>🎟️</div>
                      <div>
                        <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{reg.event?.title}</div>
                        <div style={{ display: 'flex', gap: 16, color: 'var(--text-secondary)', fontSize: 13 }}>
                          {reg.event?.date && <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><FiCalendar size={12} />{format(new Date(reg.event.date), 'MMM d, yyyy')}</span>}
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><FiMapPin size={12} />{reg.event?.location}</span>
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ background: `${statusColors[reg.status]}22`, color: statusColors[reg.status], border: `1px solid ${statusColors[reg.status]}44`, borderRadius: 20, padding: '4px 12px', fontSize: 12, fontWeight: 700, fontFamily: 'Syne, sans-serif', textTransform: 'capitalize' }}>{reg.status}</span>
                      <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>#{reg.ticketId?.slice(-8)}</span>
                      <button onClick={() => cancelRegistration(reg._id)} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '8px 10px', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )
        ) : (
          <div className="glass-card" style={{ padding: 36, maxWidth: 480 }}>
            <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 20, marginBottom: 24 }}>Profile Settings</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div><label style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Name</label><input className="input-glass" defaultValue={user?.name} /></div>
              <div><label style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Email</label><input className="input-glass" defaultValue={user?.email} disabled style={{ opacity: 0.6 }} /></div>
              <div><label style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Bio</label><textarea className="input-glass" placeholder="Tell us about yourself..." style={{ resize: 'vertical', minHeight: 80 }} /></div>
              <button className="btn-glow" style={{ padding: '12px', marginTop: 8 }}>Save Changes</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
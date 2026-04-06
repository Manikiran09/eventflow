import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { FiTrash2, FiUsers, FiCalendar, FiShield } from 'react-icons/fi';

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [activeTab, setActiveTab] = useState('users');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, eventsRes] = await Promise.all([
          api.get('/auth/users'),
          api.get('/events'),
        ]);
        setUsers(usersRes.data);
        setEvents(eventsRes.data);
      } catch { toast.error('Failed to load data'); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const deleteEvent = async (id) => {
    if (!confirm('Delete this event?')) return;
    try { await api.delete(`/events/${id}`); setEvents(prev => prev.filter(e => e._id !== id)); toast.success('Event deleted'); }
    catch { toast.error('Failed'); }
  };

  const roleColors = { admin: '#f97316', organizer: '#7c3aed', user: '#60a5fa' };

  return (
    <div style={{ paddingTop: 90, minHeight: '100vh' }}>
      <div className="container section">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 8 }}>
            <FiShield size={32} style={{ color: '#f97316' }} />
            <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 36 }}>Admin <span className="gradient-text">Panel</span></h1>
          </div>
          <p style={{ color: 'var(--text-secondary)' }}>Platform management and oversight</p>
        </motion.div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 16, marginBottom: 40 }}>
          {[
            { label: 'Total Users', value: users.length, icon: '👥' },
            { label: 'Total Events', value: events.length, icon: '🎪' },
            { label: 'Organizers', value: users.filter(u => u.role === 'organizer').length, icon: '🎯' },
            { label: 'Total Registrations', value: events.reduce((s, e) => s + e.registrationCount, 0), icon: '🎟️' },
          ].map(s => (
            <div key={s.label} className="glass-card" style={{ padding: '24px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 32 }}>{s.value}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, background: 'rgba(0,0,0,0.2)', borderRadius: 50, padding: 4, width: 'fit-content', marginBottom: 28 }}>
          {[['users', '👥 Users'], ['events', '🎪 Events']].map(([tab, label]) => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              padding: '8px 24px', borderRadius: 50, border: 'none', cursor: 'pointer',
              background: activeTab === tab ? 'linear-gradient(135deg,#7c3aed,#f97316)' : 'transparent',
              color: 'white', fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: 14, transition: 'all 0.2s',
            }}>{label}</button>
          ))}
        </div>

        {loading ? <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-secondary)' }}>Loading...</div> : (
          activeTab === 'users' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {users.map((user, i) => (
                <motion.div key={user._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                  <div className="glass-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#f97316)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Syne, sans-serif', fontWeight: 800, color: 'white' }}>
                        {user.name[0].toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600 }}>{user.name}</div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{user.email}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ background: `${roleColors[user.role]}22`, color: roleColors[user.role], border: `1px solid ${roleColors[user.role]}44`, borderRadius: 20, padding: '3px 12px', fontSize: 12, fontWeight: 700, fontFamily: 'Syne, sans-serif', textTransform: 'capitalize' }}>{user.role}</span>
                      <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{format(new Date(user.createdAt), 'MMM d, yyyy')}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {events.map((event, i) => (
                <motion.div key={event._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                  <div className="glass-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <div style={{ fontWeight: 600, marginBottom: 4 }}>{event.title}</div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: 13, display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                        <span>{event.category}</span>
                        <span>📅 {format(new Date(event.date), 'MMM d, yyyy')}</span>
                        <span>🎟️ {event.registrationCount}/{event.capacity}</span>
                        <span>by {event.organizer?.name}</span>
                      </div>
                    </div>
                    <button onClick={() => deleteEvent(event._id)} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '8px 10px', color: '#ef4444', cursor: 'pointer' }}>
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}
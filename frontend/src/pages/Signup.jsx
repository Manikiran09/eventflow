import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { MdEventNote } from 'react-icons/md';

export default function Signup() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/signup', form);
      login(data);
      toast.success(`Welcome to EventFlow, ${data.name}! 🎊`);
      navigate(data.role === 'organizer' ? '/organizer' : '/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'radial-gradient(ellipse at 70% 30%, rgba(124,58,237,0.2) 0%, transparent 50%), radial-gradient(ellipse at 30% 70%, rgba(249,115,22,0.15) 0%, transparent 50%), var(--dark-bg)',
      padding: '24px',
    }}>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} style={{ width: '100%', maxWidth: 440 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#f97316)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 0 30px rgba(124,58,237,0.4)' }}>
            <MdEventNote size={28} color="white" />
          </div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 28 }}>Create account</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: 8 }}>Join the EventFlow community</p>
        </div>

        <div className="glass-card" style={{ padding: 36 }}>
          {/* Role toggle */}
          <div style={{ display: 'flex', gap: 8, background: 'rgba(0,0,0,0.2)', borderRadius: 50, padding: 4, marginBottom: 28 }}>
            {['user', 'organizer'].map(r => (
              <button type="button" key={r} onClick={() => setForm({ ...form, role: r })} style={{
                flex: 1, padding: '8px', borderRadius: 50, border: 'none', cursor: 'pointer',
                fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: 13, textTransform: 'capitalize',
                background: form.role === r ? 'linear-gradient(135deg,#7c3aed,#f97316)' : 'transparent',
                color: 'white', transition: 'all 0.2s',
              }}>{r === 'user' ? '👤 Attendee' : '🎪 Organizer'}</button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            {[
              { key: 'name', label: 'Full Name', placeholder: 'John Doe', type: 'text', Icon: FiUser },
              { key: 'email', label: 'Email', placeholder: 'you@email.com', type: 'email', Icon: FiMail },
            ].map(({ key, label, placeholder, type, Icon }) => (
              <div key={key} style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'var(--text-secondary)' }}>{label}</label>
                <div style={{ position: 'relative' }}>
                  <Icon size={16} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', pointerEvents: 'none' }} />
                  <input className="input-glass" type={type} value={form[key]}
                    onChange={e => setForm({ ...form, [key]: e.target.value })}
                    placeholder={placeholder} required style={{ paddingLeft: 44 }} />
                </div>
              </div>
            ))}

            <div style={{ marginBottom: 28 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'var(--text-secondary)' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <FiLock size={16} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', pointerEvents: 'none' }} />
                <input className="input-glass" type={showPass ? 'text' : 'password'} value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="Min 6 characters" required minLength={6} style={{ paddingLeft: 44, paddingRight: 44 }} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                  {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-glow" disabled={loading}
              style={{ width: '100%', padding: '15px', fontSize: 16, opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? 'Creating...' : 'Create Account 🎉'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 24, color: 'var(--text-secondary)', fontSize: 14 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#f97316', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

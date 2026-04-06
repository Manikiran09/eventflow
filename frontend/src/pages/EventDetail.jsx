import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { FiCalendar, FiMapPin, FiUsers, FiTag, FiX, FiChevronRight } from 'react-icons/fi';

// Color for each event category
const categoryColors = {
  Technical:     '#667eea',
  Cultural:      '#f5576c',
  Educational:   '#4facfe',
  Business:      '#43e97b',
  Entertainment: '#fee140',
  Social:        '#fbc2eb',
  Sports:        '#fe5196',
};

// ─── Small reusable Label component ───────────────────────────
function Label({ text }) {
  return (
    <label style={{
      fontSize: 12,
      color: 'var(--text-secondary)',
      display: 'block',
      marginBottom: 6,
      fontWeight: 600,
      letterSpacing: '0.3px'
    }}>
      {text}
    </label>
  );
}

export default function EventDetail() {
  const { id }       = useParams();    // event ID from URL
  const { user }     = useAuth();      // logged in user
  const navigate     = useNavigate();

  // ── Page state ────────────────────────────────────────────
  const [event,       setEvent]       = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [registering, setRegistering] = useState(false);
  const [notes,       setNotes]       = useState('');

  // ── Payment modal state ───────────────────────────────────
  const [showPayment, setShowPayment] = useState(false);

  // Which main tab: 'card' | 'upi' | 'netbanking'
  const [payMethod, setPayMethod] = useState('card');

  // Which UPI app: 'paytm' | 'gpay' | 'phonepe' | 'other'
  const [upiApp, setUpiApp] = useState('gpay');

  // Card fields
  const [cardNumber, setCardNumber] = useState('');
  const [expiry,     setExpiry]     = useState('');
  const [cvv,        setCvv]        = useState('');
  const [cardName,   setCardName]   = useState('');
  const [cardType,   setCardType]   = useState('debit'); // debit or credit

  // UPI field
  const [upiId, setUpiId] = useState('');

  // Net banking field
  const [bank, setBank] = useState('SBI');

  // ── Fetch event on load ───────────────────────────────────
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data } = await api.get(`/events/${id}`);
        setEvent(data);
      } catch {
        toast.error('Event not found');
        navigate('/events');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  // ── Register for FREE event directly ─────────────────────
  const registerFree = async () => {
    setRegistering(true);
    try {
      await api.post(`/registrations/${id}`, { notes });
      toast.success('🎉 Registered successfully! It\'s Free!');
      setEvent(prev => ({ ...prev, registrationCount: prev.registrationCount + 1 }));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setRegistering(false);
    }
  };

  // ── Register after payment confirmation ───────────────────
  const registerAfterPayment = async () => {
    // Validate based on selected payment method
    if (payMethod === 'card') {
      if (!cardNumber || !expiry || !cvv || !cardName) {
        toast.error('Please fill all card details'); return;
      }
    } else if (payMethod === 'upi') {
      if (upiApp === 'other' && !upiId) {
        toast.error('Please enter your UPI ID'); return;
      }
    } else if (payMethod === 'netbanking') {
      if (!bank) {
        toast.error('Please select your bank'); return;
      }
    }

    setShowPayment(false);
    setRegistering(true);
    try {
      await api.post(`/registrations/${id}`, { notes });
      toast.success('💳 Payment successful! You are registered! 🎉');
      setEvent(prev => ({ ...prev, registrationCount: prev.registrationCount + 1 }));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setRegistering(false);
    }
  };

  // ── Main register button click ────────────────────────────
  const handleRegister = () => {
    if (!user) { navigate('/login'); return; }
    if (event.price === 0) {
      registerFree();       // free → direct register
    } else {
      setShowPayment(true); // paid → open payment modal
    }
  };

  // ── Format card number: "1234 5678 9012 3456" ────────────
  const formatCard = (val) =>
    val.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19);

  // ── Format expiry: "MM/YY" ────────────────────────────────
  const formatExpiry = (val) =>
    val.replace(/\D/g, '').replace(/^(\d{2})(\d)/, '$1/$2').slice(0, 5);

  // ── Loading spinner ───────────────────────────────────────
  if (loading) return (
    <div style={{
      paddingTop: 90, display: 'flex',
      justifyContent: 'center', alignItems: 'center', minHeight: '60vh'
    }}>
      <div style={{
        width: 48, height: 48,
        border: '3px solid rgba(124,58,237,0.3)',
        borderTopColor: '#7c3aed',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (!event) return null;

  const color     = categoryColors[event.category] || '#7c3aed';
  const spotsLeft = event.capacity - event.registrationCount;

  // ─────────────────────────────────────────────────────────
  return (
    <div style={{ paddingTop: 72, minHeight: '100vh' }}>

      {/* ══ BANNER ══════════════════════════════════════════ */}
      <div style={{
        height: 400, position: 'relative',
        background: event.image
          ? `url(http://localhost:5000${event.image}) center/cover`
          : `linear-gradient(135deg, ${color}55, rgba(249,115,22,0.3))`,
        display: 'flex', alignItems: 'flex-end',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.8))'
        }} />
        <div className="container" style={{ position: 'relative', zIndex: 2, paddingBottom: 40 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span style={{
              background: `${color}33`, border: `1px solid ${color}66`,
              borderRadius: 20, padding: '4px 14px', fontSize: 12,
              fontWeight: 700, color: 'white', fontFamily: 'Syne, sans-serif',
              textTransform: 'uppercase', letterSpacing: 1
            }}>
              {event.category}
            </span>
            <h1 style={{
              fontFamily: 'Syne, sans-serif', fontWeight: 800,
              fontSize: 'clamp(28px,5vw,52px)',
              color: 'white', marginTop: 16, lineHeight: 1.2
            }}>
              {event.title}
            </h1>
          </motion.div>
        </div>
      </div>

      {/* ══ MAIN CONTENT ════════════════════════════════════ */}
      <div className="container" style={{ padding: '48px 24px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0,1fr) 360px',
          gap: 40, alignItems: 'start'
        }}>

          {/* ── LEFT: About, Tags, Organizer ── */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h2 style={{
                fontFamily: 'Syne, sans-serif', fontWeight: 700,
                fontSize: 24, marginBottom: 16
              }}>
                About this Event
              </h2>
              <p style={{
                color: 'var(--text-secondary)',
                lineHeight: 1.9, fontSize: 16, whiteSpace: 'pre-line'
              }}>
                {event.description}
              </p>

              {/* Tags */}
              {event.tags?.length > 0 && (
                <div style={{ marginTop: 28 }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    color: 'var(--text-secondary)', marginBottom: 12, fontSize: 14
                  }}>
                    <FiTag size={14} /> Tags
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {event.tags.map(tag => (
                      <span key={tag} style={{
                        background: 'var(--glass)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: 20, padding: '4px 14px',
                        fontSize: 13, color: 'var(--text-secondary)'
                      }}>
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Organizer */}
              <div style={{
                marginTop: 36, padding: 24,
                background: 'var(--glass)',
                border: '1px solid var(--glass-border)',
                borderRadius: 20, backdropFilter: 'blur(20px)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: '50%',
                    background: 'linear-gradient(135deg,#7c3aed,#f97316)',
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'Syne, sans-serif', fontWeight: 800,
                    fontSize: 18, color: 'white'
                  }}>
                    {event.organizer?.name?.[0] || 'O'}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontFamily: 'Syne, sans-serif' }}>
                      {event.organizer?.name}
                    </div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
                      Event Organizer
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* ── RIGHT: Registration Card ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            style={{ position: 'sticky', top: 100 }}
          >
            <div style={{
              background: 'var(--glass)',
              border: '1px solid var(--glass-border)',
              borderRadius: 24, padding: 28,
              backdropFilter: 'blur(20px)'
            }}>
              {/* Price */}
              <div style={{
                fontFamily: 'Syne, sans-serif', fontWeight: 800,
                fontSize: 36, marginBottom: 24,
                color: event.price === 0 ? '#43e97b' : 'white'
              }}>
                {event.price === 0 ? '🆓 Free' : `₹${event.price}`}
              </div>

              {/* Event details: date, location, seats */}
              {[
                [FiCalendar, 'Date',     format(new Date(event.date), 'PPpp'),                                    '#f97316'],
                [FiMapPin,   'Location', `${event.venue ? event.venue + ', ' : ''}${event.location}`,             '#7c3aed'],
                [FiUsers,    'Seats',    `${event.registrationCount}/${event.capacity} registered`,               spotsLeft < 10 ? '#ef4444' : '#43e97b'],
              ].map(([Icon, label, value, clr]) => (
                <div key={label} style={{
                  display: 'flex', gap: 12,
                  alignItems: 'flex-start', marginBottom: 18
                }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: `${clr}22`,
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'center', flexShrink: 0
                  }}>
                    <Icon size={16} style={{ color: clr }} />
                  </div>
                  <div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: 12, marginBottom: 2 }}>
                      {label}
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>{value}</div>
                  </div>
                </div>
              ))}

              {/* Capacity bar */}
              <div style={{ margin: '20px 0' }}>
                <div style={{
                  height: 6, background: 'rgba(255,255,255,0.1)',
                  borderRadius: 3, overflow: 'hidden'
                }}>
                  <div style={{
                    height: '100%', borderRadius: 3,
                    width: `${(event.registrationCount / event.capacity) * 100}%`,
                    background: spotsLeft < 10
                      ? 'linear-gradient(90deg,#ef4444,#f97316)'
                      : 'linear-gradient(90deg,#7c3aed,#43e97b)',
                    transition: 'width 0.5s ease',
                  }} />
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: 12, marginTop: 6 }}>
                  {spotsLeft} spots remaining
                </div>
              </div>

              {/* Notes */}
              <textarea
                className="input-glass"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Any special requirements? (optional)"
                style={{ resize: 'vertical', minHeight: 80, marginBottom: 16, fontSize: 14 }}
              />

              {/* Register / Pay button */}
              <button
                onClick={handleRegister}
                disabled={registering || spotsLeft === 0}
                className="btn-glow"
                style={{
                  width: '100%', padding: '16px', fontSize: 16,
                  opacity: (registering || spotsLeft === 0) ? 0.6 : 1,
                  cursor: (registering || spotsLeft === 0) ? 'not-allowed' : 'pointer',
                }}
              >
                {registering
                  ? '⏳ Processing...'
                  : spotsLeft === 0
                    ? '😔 Sold Out'
                    : event.price === 0
                      ? '🎟️ Register Free'
                      : `💳 Pay ₹${event.price} & Register`}
              </button>
            </div>
          </motion.div>

        </div>
      </div>

      {/* ══ PAYMENT MODAL ═══════════════════════════════════ */}
      {showPayment && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 999,
          background: 'rgba(0,0,0,0.88)',
          backdropFilter: 'blur(12px)',
          display: 'flex', alignItems: 'center',
          justifyContent: 'center', padding: 24,
          overflowY: 'auto',
        }}>
          <div style={{
            background: '#0f0f1a',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 28, padding: '36px 32px',
            width: '100%', maxWidth: 480,
            position: 'relative',
            margin: 'auto',
          }}>

            {/* Close button */}
            <button
              onClick={() => setShowPayment(false)}
              style={{
                position: 'absolute', top: 16, right: 16,
                background: 'rgba(255,255,255,0.08)',
                border: 'none', borderRadius: '50%',
                width: 34, height: 34,
                display: 'flex', alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer', color: 'white'
              }}
            >
              <FiX size={16} />
            </button>

            {/* Modal heading */}
            <h2 style={{
              fontFamily: 'Syne, sans-serif', fontWeight: 800,
              fontSize: 22, marginBottom: 4
            }}>
              Complete Payment
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 20 }}>
              Registering for{' '}
              <strong style={{ color: 'white' }}>{event.title}</strong>
            </p>

            {/* Amount box */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(249,115,22,0.1))',
              border: '1px solid rgba(124,58,237,0.3)',
              borderRadius: 16, padding: '14px 20px',
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', marginBottom: 28,
            }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
                Total Amount
              </span>
              <span style={{
                fontFamily: 'Syne, sans-serif', fontWeight: 800,
                fontSize: 28, color: '#f97316'
              }}>
                ₹{event.price}
              </span>
            </div>

            {/* ── PAYMENT METHOD TABS ── */}
            <div style={{
              display: 'flex', gap: 6,
              background: 'rgba(0,0,0,0.3)',
              borderRadius: 14, padding: 5, marginBottom: 24,
            }}>
              {[
                { id: 'card',       label: '💳 Card' },
                { id: 'upi',        label: '📱 UPI'  },
                { id: 'netbanking', label: '🏦 Net Banking' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setPayMethod(tab.id)}
                  style={{
                    flex: 1, padding: '9px 6px',
                    borderRadius: 10, border: 'none',
                    cursor: 'pointer', fontSize: 13,
                    fontFamily: 'Syne, sans-serif', fontWeight: 600,
                    background: payMethod === tab.id
                      ? 'linear-gradient(135deg,#7c3aed,#2563eb)'
                      : 'transparent',
                    color: payMethod === tab.id ? 'white' : 'var(--text-secondary)',
                    transition: 'all 0.2s',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* ════════════════════════════════════════
                TAB 1 — CARD (Debit / Credit)
            ════════════════════════════════════════ */}
            {payMethod === 'card' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                {/* Debit / Credit toggle */}
                <div style={{
                  display: 'flex', gap: 8,
                  background: 'rgba(0,0,0,0.2)',
                  borderRadius: 50, padding: 4,
                }}>
                  {['debit', 'credit'].map(type => (
                    <button
                      key={type}
                      onClick={() => setCardType(type)}
                      style={{
                        flex: 1, padding: '7px',
                        borderRadius: 50, border: 'none',
                        cursor: 'pointer',
                        fontFamily: 'Syne, sans-serif',
                        fontWeight: 600, fontSize: 13,
                        background: cardType === type
                          ? 'linear-gradient(135deg,#f97316,#ec4899)'
                          : 'transparent',
                        color: 'white', transition: 'all 0.2s',
                        textTransform: 'capitalize',
                      }}
                    >
                      {type === 'debit' ? '💳 Debit Card' : '💎 Credit Card'}
                    </button>
                  ))}
                </div>

                {/* Card Number */}
                <div>
                  <Label text="Card Number" />
                  <input
                    className="input-glass"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={e => setCardNumber(formatCard(e.target.value))}
                    maxLength={19}
                  />
                </div>

                {/* Expiry + CVV side by side */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <Label text="Expiry (MM/YY)" />
                    <input
                      className="input-glass"
                      placeholder="MM/YY"
                      value={expiry}
                      onChange={e => setExpiry(formatExpiry(e.target.value))}
                      maxLength={5}
                    />
                  </div>
                  <div>
                    <Label text="CVV" />
                    <input
                      className="input-glass"
                      placeholder="•••"
                      type="password"
                      value={cvv}
                      onChange={e => setCvv(e.target.value.replace(/\D/g,'').slice(0,3))}
                      maxLength={3}
                    />
                  </div>
                </div>

                {/* Name on Card */}
                <div>
                  <Label text="Name on Card" />
                  <input
                    className="input-glass"
                    placeholder="John Doe"
                    value={cardName}
                    onChange={e => setCardName(e.target.value)}
                  />
                </div>

                {/* Accepted cards logos (text-based) */}
                <div style={{
                  display: 'flex', gap: 8, flexWrap: 'wrap'
                }}>
                  {['VISA', 'MasterCard', 'RuPay', 'Amex'].map(brand => (
                    <span key={brand} style={{
                      background: 'rgba(255,255,255,0.07)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      borderRadius: 8, padding: '4px 12px',
                      fontSize: 11, color: 'var(--text-secondary)',
                      fontWeight: 700, letterSpacing: '0.5px'
                    }}>
                      {brand}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* ════════════════════════════════════════
                TAB 2 — UPI
            ════════════════════════════════════════ */}
            {payMethod === 'upi' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
                  Select your UPI app or enter UPI ID manually
                </p>

                {/* UPI App options */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 10
                }}>
                  {[
                    { id: 'gpay',    label: 'Google Pay',  emoji: '🟦', color: '#4285F4' },
                    { id: 'paytm',   label: 'Paytm',       emoji: '🔵', color: '#00BAF2' },
                    { id: 'phonepe', label: 'PhonePe',     emoji: '🟣', color: '#5f259f' },
                    { id: 'other',   label: 'Other UPI',   emoji: '📲', color: '#43e97b' },
                  ].map(app => (
                    <button
                      key={app.id}
                      onClick={() => { setUpiApp(app.id); setUpiId(''); }}
                      style={{
                        padding: '14px 10px',
                        borderRadius: 14,
                        border: upiApp === app.id
                          ? `2px solid ${app.color}`
                          : '1px solid rgba(255,255,255,0.1)',
                        background: upiApp === app.id
                          ? `${app.color}18`
                          : 'rgba(255,255,255,0.04)',
                        cursor: 'pointer',
                        display: 'flex', flexDirection: 'column',
                        alignItems: 'center', gap: 6,
                        transition: 'all 0.2s',
                      }}
                    >
                      <span style={{ fontSize: 28 }}>{app.emoji}</span>
                      <span style={{
                        fontFamily: 'Syne, sans-serif', fontWeight: 700,
                        fontSize: 13,
                        color: upiApp === app.id ? app.color : 'var(--text-secondary)',
                      }}>
                        {app.label}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Show UPI ID input only for "Other UPI" */}
                {upiApp === 'other' && (
                  <div>
                    <Label text="Enter UPI ID" />
                    <input
                      className="input-glass"
                      placeholder="yourname@upi  (e.g. 9999999999@paytm)"
                      value={upiId}
                      onChange={e => setUpiId(e.target.value)}
                    />
                  </div>
                )}

                {/* For selected UPI apps — show instruction */}
                {upiApp !== 'other' && (
                  <div style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 14, padding: '16px 18px',
                    display: 'flex', alignItems: 'center', gap: 12,
                  }}>
                    <span style={{ fontSize: 28 }}>
                      {upiApp === 'gpay'    ? '🟦'
                      : upiApp === 'paytm'  ? '🔵'
                      : upiApp === 'phonepe'? '🟣'
                      : '📲'}
                    </span>
                    <div>
                      <div style={{
                        fontFamily: 'Syne, sans-serif',
                        fontWeight: 700, fontSize: 14, marginBottom: 4
                      }}>
                        {upiApp === 'gpay'    ? 'Google Pay'
                        : upiApp === 'paytm'  ? 'Paytm'
                        : 'PhonePe'}
                      </div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: 12 }}>
                        Click "Pay" — you'll be redirected to complete payment in the app
                      </div>
                    </div>
                    <FiChevronRight
                      size={18}
                      style={{ color: 'var(--text-secondary)', marginLeft: 'auto' }}
                    />
                  </div>
                )}
              </div>
            )}

            {/* ════════════════════════════════════════
                TAB 3 — NET BANKING
            ════════════════════════════════════════ */}
            {payMethod === 'netbanking' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
                  Select your bank to proceed with net banking
                </p>

                {/* Popular banks as clickable buttons */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 10
                }}>
                  {[
                    { id: 'SBI',     label: 'SBI',          emoji: '🏦' },
                    { id: 'HDFC',    label: 'HDFC Bank',     emoji: '🏛️' },
                    { id: 'ICICI',   label: 'ICICI Bank',    emoji: '🏢' },
                    { id: 'AXIS',    label: 'Axis Bank',     emoji: '🏗️' },
                    { id: 'KOTAK',   label: 'Kotak Bank',    emoji: '🔴' },
                    { id: 'BOB',     label: 'Bank of Baroda',emoji: '🟠' },
                  ].map(b => (
                    <button
                      key={b.id}
                      onClick={() => setBank(b.id)}
                      style={{
                        padding: '12px 10px',
                        borderRadius: 12,
                        border: bank === b.id
                          ? '2px solid #7c3aed'
                          : '1px solid rgba(255,255,255,0.1)',
                        background: bank === b.id
                          ? 'rgba(124,58,237,0.15)'
                          : 'rgba(255,255,255,0.04)',
                        cursor: 'pointer',
                        display: 'flex', alignItems: 'center',
                        gap: 8, transition: 'all 0.2s',
                      }}
                    >
                      <span style={{ fontSize: 20 }}>{b.emoji}</span>
                      <span style={{
                        fontFamily: 'Syne, sans-serif', fontWeight: 600,
                        fontSize: 13,
                        color: bank === b.id ? '#a78bfa' : 'var(--text-secondary)',
                      }}>
                        {b.label}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Other bank dropdown */}
                <div>
                  <Label text="Or select other bank" />
                  <select
                    className="input-glass"
                    value={bank}
                    onChange={e => setBank(e.target.value)}
                    style={{ cursor: 'pointer' }}
                  >
                    <option value="SBI">State Bank of India</option>
                    <option value="HDFC">HDFC Bank</option>
                    <option value="ICICI">ICICI Bank</option>
                    <option value="AXIS">Axis Bank</option>
                    <option value="KOTAK">Kotak Mahindra Bank</option>
                    <option value="BOB">Bank of Baroda</option>
                    <option value="PNB">Punjab National Bank</option>
                    <option value="CANARA">Canara Bank</option>
                    <option value="UNION">Union Bank of India</option>
                    <option value="IDBI">IDBI Bank</option>
                    <option value="YES">Yes Bank</option>
                    <option value="INDUSIND">IndusInd Bank</option>
                    <option value="FEDERAL">Federal Bank</option>
                    <option value="IOB">Indian Overseas Bank</option>
                  </select>
                </div>

                {/* Info message */}
                <div style={{
                  background: 'rgba(96,165,250,0.08)',
                  border: '1px solid rgba(96,165,250,0.2)',
                  borderRadius: 12, padding: '12px 16px',
                  fontSize: 13, color: '#60a5fa',
                  display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  ℹ️ You will be redirected to your bank's secure portal to complete the payment
                </div>
              </div>
            )}

            {/* ── Pay button ── */}
            <button
              className="btn-glow"
              onClick={registerAfterPayment}
              style={{
                width: '100%', padding: '15px',
                fontSize: 16, marginTop: 24,
                fontFamily: 'Syne, sans-serif', fontWeight: 700,
              }}
            >
              Pay ₹{event.price} & Confirm 🎟️
            </button>

            {/* Security note */}
            <p style={{
              color: 'var(--text-secondary)', fontSize: 11,
              textAlign: 'center', marginTop: 14
            }}>
              🔒 Demo payment UI — integrate Razorpay or Stripe for real payments
            </p>

          </div>
        </div>
      )}

      {/* Mobile responsive fix */}
      <style>{`
        @media(max-width: 768px) {
          .container > div[style*="grid"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

    </div>
  );
}
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api/axios';
import EventCard from '../components/EventCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { FiSearch, FiX } from 'react-icons/fi';

// All filter categories
const CATEGORIES = [
  'All', 'Technical', 'Cultural', 'Educational',
  'Business', 'Entertainment', 'Social', 'Sports'
];

export default function Events() {
  const [searchParams] = useSearchParams();

  // ── State ─────────────────────────────────────────────────
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');

  // Read category from URL (?category=Technical) or default to 'All'
  const [category, setCategory] = useState(
    searchParams.get('category') || 'All'
  );

  // ── Fetch events from backend ─────────────────────────────
  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params = {};
      if (category !== 'All') params.category = category;
      if (search)   params.search   = search;
      if (location) params.location = location;

      const { data } = await api.get('/events', { params });
      setEvents(data);
    } catch {
      // silently fail — no events shown
    } finally {
      setLoading(false);
    }
  };

  // ✅ Re-fetch whenever category or location changes
  useEffect(() => {
    fetchEvents();
  }, [category, location]);

  // ── Search form submit ────────────────────────────────────
  const handleSearch = (e) => {
    e.preventDefault();
    fetchEvents();
  };

  // ── Clear all filters ─────────────────────────────────────
  const clearFilters = () => {
    setSearch('');
    setCategory('All');
    setLocation('');
  };

  // ── UI ────────────────────────────────────────────────────
  return (
    <div style={{ paddingTop: 90, minHeight: '100vh' }}>

      {/* ── Header with Search & Filters ── */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(249,115,22,0.1))',
        borderBottom: '1px solid var(--glass-border)',
        padding: '48px 24px 40px',
      }}>
        <div className="container">

          {/* Page Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              fontFamily: 'Syne, sans-serif', fontWeight: 800,
              fontSize: 'clamp(32px,5vw,52px)', marginBottom: 8
            }}
          >
            Discover <span className="gradient-text">Events</span>
          </motion.h1>

          {/* Event count */}
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: 17, marginBottom: 32
          }}>
            {loading ? 'Loading...' : `${events.length} events found`}
          </p>

          {/* ── Search bar ── */}
          <form
            onSubmit={handleSearch}
            style={{
              display: 'flex', gap: 12,
              flexWrap: 'wrap', marginBottom: 24
            }}
          >
            {/* Search input */}
            <div style={{ position: 'relative', flex: 1, minWidth: 260 }}>
              <FiSearch size={16} style={{
                position: 'absolute', left: 16,
                top: '50%', transform: 'translateY(-50%)',
                color: 'var(--text-secondary)', pointerEvents: 'none'
              }} />
              <input
                className="input-glass"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search events, topics, tags..."
                style={{ paddingLeft: 44 }}
              />
            </div>

            {/* Location input */}
            <input
              className="input-glass"
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="Location"
              style={{ width: 200 }}
            />

            {/* Search button */}
            <button
              type="submit"
              className="btn-glow"
              style={{ padding: '12px 28px' }}
            >
              Search
            </button>

            {/* Clear button — only shows if filters are active */}
            {(search || category !== 'All' || location) && (
              <button
                type="button"
                onClick={clearFilters}
                className="btn-outline"
                style={{
                  padding: '12px 20px',
                  display: 'flex', alignItems: 'center', gap: 6
                }}
              >
                <FiX size={14} /> Clear
              </button>
            )}
          </form>

          {/* ── Category filter buttons ── */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                style={{
                  background: category === cat
                    ? 'linear-gradient(135deg, #7c3aed, #f97316)'
                    : 'var(--glass)',
                  border: `1px solid ${category === cat ? 'transparent' : 'var(--glass-border)'}`,
                  borderRadius: 50, padding: '8px 20px',
                  color: 'var(--text-primary)', cursor: 'pointer',
                  fontFamily: 'Syne, sans-serif',
                  fontWeight: 600, fontSize: 13,
                  transition: 'all 0.2s',
                  backdropFilter: 'blur(10px)',
                  boxShadow: category === cat
                    ? '0 4px 15px rgba(124,58,237,0.3)'
                    : 'none',
                }}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* ── Events Grid ── */}
      <div className="container section">
        {loading ? (
          // Show skeletons while loading
          <div className="events-grid">
            {Array.from({ length: 9 }).map((_, i) => (
              <LoadingSkeleton key={i} />
            ))}
          </div>
        ) : events.length > 0 ? (
          // Show event cards
          <div className="events-grid">
            {events.map((event, i) => (
              <motion.div
                key={event._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <EventCard event={event} />
              </motion.div>
            ))}
          </div>
        ) : (
          // No results state
          <div style={{
            textAlign: 'center', padding: '80px 0',
            color: 'var(--text-secondary)'
          }}>
            <div style={{ fontSize: 60, marginBottom: 20 }}>🔍</div>
            <h3 style={{
              fontFamily: 'Syne, sans-serif', fontSize: 24,
              marginBottom: 12, color: 'var(--text-primary)'
            }}>
              No events found
            </h3>
            <p>Try adjusting your filters or search terms</p>
            <button
              onClick={clearFilters}
              className="btn-glow"
              style={{ marginTop: 24 }}
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
export default function LoadingSkeleton() {
  return (
    <div style={{ background: 'var(--dark-card)', border: '1px solid var(--glass-border)', borderRadius: 20, overflow: 'hidden' }}>
      <div className="skeleton" style={{ height: 160 }} />
      <div style={{ padding: '20px 22px 22px' }}>
        <div className="skeleton" style={{ height: 22, marginBottom: 10, borderRadius: 6 }} />
        <div className="skeleton" style={{ height: 14, marginBottom: 6, borderRadius: 6 }} />
        <div className="skeleton" style={{ height: 14, width: '70%', marginBottom: 20, borderRadius: 6 }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="skeleton" style={{ height: 20, width: 60, borderRadius: 6 }} />
          <div className="skeleton" style={{ height: 38, width: 110, borderRadius: 50 }} />
        </div>
      </div>
    </div>
  );
}
import { motion } from 'framer-motion';

export default function AnalyticsView({ stats }) {
  if (!stats || typeof stats.total === 'undefined') return <div style={{ padding: '2rem' }}>Loading analytics...</div>;

  const resolvedCount = stats.byStatus?.resolved || 0;
  const breachedCount = stats.breachedOpen || 0;

  const resolvedPercent = stats.total > 0 ? Math.round((resolvedCount / stats.total) * 100) : 0;
  const breachedPercent = stats.total > 0 ? Math.round((breachedCount / stats.total) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="analytics-view"
      style={{ display: 'flex', flexDirection: 'column', gap: '2rem', padding: '1rem' }}
    >
      <div className="page-header" style={{ marginBottom: '1rem' }}>
        <h2>Analytics Dashboard</h2>
        <p>Performance metrics and ticket insights.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {/* Resolution Rate Card */}
        <div className="glass-card" style={{ padding: '1.5rem', background: 'rgba(20,20,20,0.6)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Resolution Rate</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ fontSize: '3rem', fontWeight: 700, color: 'var(--color-resolved)' }}>{resolvedPercent}%</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>of all tickets<br/>are resolved.</div>
          </div>
          <div style={{ marginTop: '1rem', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${resolvedPercent}%`, background: 'var(--color-resolved)' }}></div>
          </div>
        </div>

        {/* SLA Performance Card */}
        <div className="glass-card" style={{ padding: '1.5rem', background: 'rgba(20,20,20,0.6)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>SLA Breach Rate</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ fontSize: '3rem', fontWeight: 700, color: 'var(--breach-color)' }}>{breachedPercent}%</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>of tickets have<br/>breached SLA.</div>
          </div>
          <div style={{ marginTop: '1rem', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${breachedPercent}%`, background: 'var(--breach-color)' }}></div>
          </div>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '1.5rem', background: 'rgba(20,20,20,0.6)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
        <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Ticket Volume</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <span>Total Tickets</span>
          <span style={{ fontWeight: 600 }}>{stats.total}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <span style={{ color: 'var(--color-open)' }}>Open</span>
          <span style={{ fontWeight: 600 }}>{stats.byStatus?.open || 0}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <span style={{ color: 'var(--color-in-progress)' }}>In Progress</span>
          <span style={{ fontWeight: 600 }}>{stats.byStatus?.in_progress || 0}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0' }}>
          <span style={{ color: 'var(--color-resolved)' }}>Resolved</span>
          <span style={{ fontWeight: 600 }}>{resolvedCount}</span>
        </div>
      </div>
    </motion.div>
  );
}

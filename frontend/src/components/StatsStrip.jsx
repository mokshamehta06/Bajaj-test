export default function StatsStrip({ stats, loading }) {
  if (loading) {
    return (
      <div className="stats-strip">
        <div className="stats-loading">Loading stats...</div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="stats-strip">
      <div className="stat-item stat-open">
        <span className="stat-count">{stats.byStatus?.open || 0}</span>
        <span className="stat-label">Open</span>
      </div>
      <div className="stat-item stat-in-progress">
        <span className="stat-count">{stats.byStatus?.in_progress || 0}</span>
        <span className="stat-label">In Progress</span>
      </div>
      <div className="stat-item stat-resolved">
        <span className="stat-count">{stats.byStatus?.resolved || 0}</span>
        <span className="stat-label">Resolved</span>
      </div>
      <div className="stat-item stat-closed">
        <span className="stat-count">{stats.byStatus?.closed || 0}</span>
        <span className="stat-label">Closed</span>
      </div>
      <div className="stat-divider"></div>
      <div className="stat-item stat-total">
        <span className="stat-count">{stats.total || 0}</span>
        <span className="stat-label">Total</span>
      </div>
      <div className="stat-item stat-breached">
        <span className="stat-count">{stats.breachedOpen || 0}</span>
        <span className="stat-label">Breached</span>
      </div>
    </div>
  );
}

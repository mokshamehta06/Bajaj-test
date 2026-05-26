export default function FilterBar({ filters, onFilterChange }) {
  const priorities = ['all', 'low', 'medium', 'high', 'urgent'];

  return (
    <div className="filter-bar">
      <div className="filter-group">
        <label className="filter-label">Priority</label>
        <div className="priority-pills">
          {priorities.map(p => (
            <button
              key={p}
              className={`pill ${filters.priority === (p === 'all' ? '' : p) ? 'pill-active' : ''} ${p !== 'all' ? `pill-${p}` : ''}`}
              onClick={() => onFilterChange({ ...filters, priority: p === 'all' ? '' : p })}
            >
              {p === 'all' ? 'All' : p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <label className="sla-toggle">
          <input
            type="checkbox"
            checked={filters.breached || false}
            onChange={(e) => onFilterChange({ ...filters, breached: e.target.checked })}
          />
          <span className="toggle-slider"></span>
          <span className="toggle-label">SLA Breached Only</span>
        </label>
      </div>
    </div>
  );
}

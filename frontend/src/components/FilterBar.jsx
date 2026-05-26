export default function FilterBar({ filters, onFilterChange, searchQuery, setSearchQuery }) {
  const priorities = ['all', 'low', 'medium', 'high', 'urgent'];

  return (
    <div className="filter-bar">
      <div className="search-wrapper">
        <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input 
          type="text" 
          className="search-input" 
          placeholder="Search by subject or email..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="filter-controls">
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
    </div>
  );
}

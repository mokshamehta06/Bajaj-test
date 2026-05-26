import Column from './Column';

const STATUSES = ['open', 'in_progress', 'resolved', 'closed'];

export default function Board({ tickets, onStatusChange, onDelete, onDropError, onTicketClick, loading }) {
  // Group tickets by status
  const grouped = {};
  STATUSES.forEach(s => { grouped[s] = []; });
  tickets.forEach(ticket => {
    if (grouped[ticket.status]) {
      grouped[ticket.status].push(ticket);
    }
  });

  if (loading) {
    return (
      <div className="board">
        {STATUSES.map(status => (
          <div key={status} className={`board-column column-${status}`}>
            <div className="column-header">
              <div className="column-title">
                <h3>{status.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}</h3>
              </div>
            </div>
            <div className="column-body">
              <div className="skeleton-card"></div>
              <div className="skeleton-card"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="board">
      {STATUSES.map(status => (
        <Column
          key={status}
          status={status}
          tickets={grouped[status]}
          onStatusChange={onStatusChange}
          onDelete={onDelete}
          onDropError={onDropError}
          onTicketClick={onTicketClick}
        />
      ))}
    </div>
  );
}

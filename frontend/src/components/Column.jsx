import { useState } from 'react';
import TicketCard from './TicketCard';

const STATUS_LABELS = {
  open: 'Open',
  in_progress: 'In Progress',
  resolved: 'Resolved',
  closed: 'Closed'
};

const STATUS_ICONS = {
  open: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  ),
  in_progress: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M8 4v4l3 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  resolved: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M5.5 8l2 2 3-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  closed: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M5.5 8l2 2 3-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
};

// Valid transitions for drop validation
const ALLOWED_TRANSITIONS = {
  open:        ['in_progress'],
  in_progress: ['open', 'resolved'],
  resolved:    ['in_progress', 'closed'],
  closed:      ['resolved']
};

export default function Column({ status, tickets, onStatusChange, onDelete, onDropError }) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    // Only set false if we're leaving the column, not entering a child
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);

    try {
      const data = JSON.parse(e.dataTransfer.getData('text/plain'));
      const { ticketId, currentStatus } = data;

      // Don't do anything if dropped in the same column
      if (currentStatus === status) return;

      // Check if the transition is valid
      const allowed = ALLOWED_TRANSITIONS[currentStatus] || [];
      if (!allowed.includes(status)) {
        onDropError(`Cannot move ticket from "${currentStatus.replace('_', ' ')}" to "${status.replace('_', ' ')}". Only adjacent status changes are allowed.`);
        return;
      }

      onStatusChange(ticketId, status);
    } catch (err) {
      console.error('Drop error:', err);
    }
  };

  return (
    <div
      className={`board-column column-${status} ${isDragOver ? 'drag-over' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="column-header">
        <div className="column-title">
          <span className={`column-icon icon-${status}`}>{STATUS_ICONS[status]}</span>
          <h3>{STATUS_LABELS[status]}</h3>
        </div>
        <span className="column-count">{tickets.length}</span>
      </div>
      <div className="column-body">
        {tickets.length === 0 ? (
          <div className="column-empty">
            <span>No tickets</span>
          </div>
        ) : (
          tickets.map(ticket => (
            <TicketCard
              key={ticket._id}
              ticket={ticket}
              onStatusChange={onStatusChange}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}

import { formatAge, getSLATarget } from '../utils/formatAge';
import { motion } from 'framer-motion';

// Allowed transitions map — mirrors backend
const ALLOWED_TRANSITIONS = {
  open:        ['in_progress'],
  in_progress: ['open', 'resolved'],
  resolved:    ['in_progress', 'closed'],
  closed:      ['resolved']
};

const TRANSITION_LABELS = {
  open: 'Reopen',
  in_progress: 'Start',
  resolved: 'Resolve',
  closed: 'Close'
};

// Which button goes left (backward) and which goes right (forward)
const STATUS_ORDER = ['open', 'in_progress', 'resolved', 'closed'];

export default function TicketCard({ ticket, onStatusChange, onDelete, onTicketClick }) {
  const allowed = ALLOWED_TRANSITIONS[ticket.status] || [];
  const currentIdx = STATUS_ORDER.indexOf(ticket.status);

  const backwardTransitions = allowed.filter(s => STATUS_ORDER.indexOf(s) < currentIdx);
  const forwardTransitions = allowed.filter(s => STATUS_ORDER.indexOf(s) > currentIdx);

  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({
      ticketId: ticket._id,
      currentStatus: ticket.status
    }));
    e.dataTransfer.effectAllowed = 'move';
    // Allow dragging styling to kick in smoothly
    setTimeout(() => {
      if (e.target && e.target.classList) {
        e.target.classList.add('dragging');
      }
    }, 0);
  };

  const handleDragEnd = (e) => {
    e.target.classList.remove('dragging');
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={`ticket-card ${ticket.slaBreached ? 'sla-breached' : ''}`}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={() => onTicketClick(ticket)}
    >
      <div className="ticket-header">
        <h4 className="ticket-subject">{ticket.subject}</h4>
        <button
          className="ticket-delete"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(ticket._id);
          }}
          title="Delete ticket"
          aria-label="Delete ticket"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1.5 3.5h11M4.5 3.5V2a1 1 0 011-1h3a1 1 0 011 1v1.5M5.5 6v4M8.5 6v4M3 3.5h8l-.5 8a1 1 0 01-1 1h-5a1 1 0 01-1-1L3 3.5z"
              stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      <div className="ticket-meta">
        <span className={`priority-badge priority-${ticket.priority}`}>
          {ticket.priority}
        </span>
        <span className="ticket-age" title={`SLA target: ${getSLATarget(ticket.priority)}`}>
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none" className="clock-icon">
            <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2"/>
            <path d="M7 3.5V7l2.5 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
          {formatAge(ticket.ageMinutes)}
        </span>
        {ticket.slaBreached && (
          <span className="sla-badge" title="SLA breached">
            ⚠ SLA
          </span>
        )}
      </div>

      {ticket.customerEmail && (
        <div className="ticket-email" title={ticket.customerEmail}>
          {ticket.customerEmail}
        </div>
      )}

      <div className="ticket-actions">
        {backwardTransitions.map(status => (
          <button
            key={status}
            className="btn-transition btn-backward"
            onClick={(e) => {
              e.stopPropagation();
              onStatusChange(ticket._id, status);
            }}
            title={`Move to ${status.replace('_', ' ')}`}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M7.5 2L3.5 6l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {TRANSITION_LABELS[status] || status.replace('_', ' ')}
          </button>
        ))}
        {forwardTransitions.map(status => (
          <button
            key={status}
            className={`btn-transition btn-forward ${status === 'resolved' ? 'btn-resolve' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              onStatusChange(ticket._id, status);
            }}
            title={`Move to ${status.replace('_', ' ')}`}
          >
            {TRANSITION_LABELS[status] || status.replace('_', ' ')}
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M4.5 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        ))}
      </div>
    </motion.div>
  );
}

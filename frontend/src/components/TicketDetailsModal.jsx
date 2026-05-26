import { motion } from 'framer-motion';
import { formatAge, getSLATarget } from '../utils/formatAge';

export default function TicketDetailsModal({ ticket, onClose }) {
  if (!ticket) return null;

  return (
    <motion.div 
      className="modal-overlay" 
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        initial={{ y: 20, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 20, opacity: 0, scale: 0.95 }}
        transition={{ type: "spring", bounce: 0.3, duration: 0.5 }}
      >
        <div className="modal-header">
          <h2>Ticket Details</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div className="modal-body">
          <div className="details-section">
            <div className="details-label">Subject</div>
            <div className="details-value" style={{ fontSize: '1.15rem', fontWeight: 600 }}>
              {ticket.subject}
            </div>
          </div>

          <div className="details-meta-grid">
            <div className="meta-item">
              <div className="details-label">Status</div>
              <span className={`priority-badge priority-low`} style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>
                {ticket.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>
            
            <div className="meta-item">
              <div className="details-label">Priority</div>
              <span className={`priority-badge priority-${ticket.priority}`}>
                {ticket.priority.toUpperCase()}
              </span>
            </div>

            <div className="meta-item">
              <div className="details-label">Customer Email</div>
              <div style={{ color: 'var(--text-secondary)' }}>{ticket.customerEmail || 'Not provided'}</div>
            </div>

            <div className="meta-item">
              <div className="details-label">Time Elapsed</div>
              <div style={{ color: ticket.slaBreached ? 'var(--breach-color)' : 'var(--text-secondary)' }}>
                {formatAge(ticket.ageMinutes)}
                <span style={{ fontSize: '0.75rem', opacity: 0.7, marginLeft: '0.5rem' }}>
                  (Target: {getSLATarget(ticket.priority)})
                </span>
              </div>
            </div>
          </div>

          <div className="details-section">
            <div className="details-label">Description</div>
            <div className="details-value">
              {ticket.description || 'No description provided.'}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

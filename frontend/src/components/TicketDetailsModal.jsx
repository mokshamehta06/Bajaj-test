import { useState } from 'react';
import { motion } from 'framer-motion';
import { formatAge, getSLATarget } from '../utils/formatAge';

export default function TicketDetailsModal({ ticket, onClose, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    subject: ticket.subject || '',
    description: ticket.description || '',
    priority: ticket.priority || 'low',
    status: ticket.status || 'open',
    customerEmail: ticket.customerEmail || ''
  });
  const [isSaving, setIsSaving] = useState(false);

  if (!ticket) return null;

  const handleSave = async () => {
    setIsSaving(true);
    if (onUpdate) {
      await onUpdate(formData);
    }
    setIsSaving(false);
    setIsEditing(false);
  };

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
          <h2>{isEditing ? 'Edit Ticket' : 'Ticket Details'}</h2>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            {!isEditing ? (
              <button className="btn-cancel" style={{ padding: '0.4rem 1rem' }} onClick={() => setIsEditing(true)}>Edit</button>
            ) : (
              <>
                <button className="btn-cancel" style={{ padding: '0.4rem 1rem' }} onClick={() => setIsEditing(false)}>Cancel</button>
                <button className="btn-submit" style={{ padding: '0.4rem 1rem' }} onClick={handleSave} disabled={isSaving}>
                  {isSaving ? <span className="spinner-inline"></span> : 'Save'}
                </button>
              </>
            )}
            <button className="modal-close" onClick={onClose} aria-label="Close modal">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>

        <div className="modal-body">
          {isEditing ? (
            <div className="ticket-form" style={{ padding: 0 }}>
              <div className="form-group">
                <label>Subject</label>
                <input 
                  type="text" 
                  value={formData.subject}
                  onChange={e => setFormData({...formData, subject: e.target.value})}
                />
              </div>
              <div className="details-meta-grid">
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Status</label>
                  <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Priority</label>
                  <select value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Customer Email</label>
                <input 
                  type="email" 
                  value={formData.customerEmail}
                  onChange={e => setFormData({...formData, customerEmail: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea 
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  rows={5}
                />
              </div>
            </div>
          ) : (
            <>
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
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

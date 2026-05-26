/**
 * Status transition rules for tickets.
 * Forward: open → in_progress → resolved → closed (one step only)
 * Backward: allowed one step back (e.g. resolved → in_progress)
 */
const ALLOWED_TRANSITIONS = {
  open:        ['in_progress'],
  in_progress: ['open', 'resolved'],
  resolved:    ['in_progress', 'closed'],
  closed:      ['resolved']
};

const VALID_STATUSES = ['open', 'in_progress', 'resolved', 'closed'];

/**
 * Check if a status transition is allowed.
 * @param {string} currentStatus
 * @param {string} newStatus
 * @returns {{ valid: boolean, message?: string }}
 */
function validateTransition(currentStatus, newStatus) {
  if (!VALID_STATUSES.includes(newStatus)) {
    return {
      valid: false,
      message: `Invalid status "${newStatus}". Must be one of: ${VALID_STATUSES.join(', ')}`
    };
  }

  if (currentStatus === newStatus) {
    return { valid: true }; // No change, that's fine
  }

  const allowed = ALLOWED_TRANSITIONS[currentStatus];
  if (!allowed || !allowed.includes(newStatus)) {
    return {
      valid: false,
      message: `Transition from "${currentStatus}" to "${newStatus}" is not allowed. Allowed transitions from "${currentStatus}": ${(allowed || []).join(', ') || 'none'}`
    };
  }

  return { valid: true };
}

module.exports = { ALLOWED_TRANSITIONS, VALID_STATUSES, validateTransition };

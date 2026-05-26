// SLA response time targets in minutes
const SLA_TARGETS = {
  urgent: 60,     // 1 hour
  high: 240,      // 4 hours
  medium: 1440,   // 24 hours
  low: 4320       // 72 hours
};

/**
 * Compute derived fields for a ticket.
 * - ageMinutes: minutes between createdAt and now (or resolvedAt if resolved)
 * - slaBreached: true if ticket exceeded its priority's response time target
 */
function computeDerivedFields(ticket) {
  const now = new Date();
  const createdAt = new Date(ticket.createdAt);

  // For resolved/closed tickets with resolvedAt, age stops at resolution time
  const endTime = ticket.resolvedAt ? new Date(ticket.resolvedAt) : now;
  const ageMinutes = Math.floor((endTime - createdAt) / 60000);

  const target = SLA_TARGETS[ticket.priority];
  const slaBreached = ageMinutes > target;

  return { ageMinutes, slaBreached };
}

/**
 * Attach derived fields to a plain ticket object.
 */
function enrichTicket(ticket) {
  const obj = ticket.toObject ? ticket.toObject() : { ...ticket };
  const { ageMinutes, slaBreached } = computeDerivedFields(obj);
  obj.ageMinutes = ageMinutes;
  obj.slaBreached = slaBreached;
  return obj;
}

module.exports = { SLA_TARGETS, computeDerivedFields, enrichTicket };

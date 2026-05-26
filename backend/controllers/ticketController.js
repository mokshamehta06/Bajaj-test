const Ticket = require('../models/Ticket');
const { enrichTicket, computeDerivedFields, SLA_TARGETS } = require('../utils/sla');
const { validateTransition, VALID_STATUSES } = require('../utils/transitions');

/**
 * POST /tickets — Create a new ticket
 */
exports.createTicket = async (req, res, next) => {
  try {
    const { subject, description, customerEmail, priority } = req.body;

    // Collect validation errors
    const errors = [];
    if (!subject || !subject.trim()) errors.push('Subject is required');
    if (!description || !description.trim()) errors.push('Description is required');
    if (!customerEmail || !customerEmail.trim()) errors.push('Customer email is required');
    if (!priority) errors.push('Priority is required');

    if (priority && !['low', 'medium', 'high', 'urgent'].includes(priority)) {
      errors.push('Priority must be one of: low, medium, high, urgent');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (customerEmail && !emailRegex.test(customerEmail)) {
      errors.push(`"${customerEmail}" is not a valid email address`);
    }

    if (errors.length > 0) {
      return res.status(400).json({ error: 'Validation failed', details: errors });
    }

    const ticket = await Ticket.create({
      subject: subject.trim(),
      description: description.trim(),
      customerEmail: customerEmail.trim(),
      priority
    });

    res.status(201).json(enrichTicket(ticket));
  } catch (err) {
    next(err);
  }
};

/**
 * GET /tickets — List tickets with optional filters
 * Query params: ?status, ?priority, ?breached=true (combinable)
 */
exports.getTickets = async (req, res, next) => {
  try {
    const { status, priority, breached } = req.query;
    const filter = {};

    if (status) {
      if (!VALID_STATUSES.includes(status)) {
        return res.status(400).json({
          error: `Invalid status filter "${status}". Must be one of: ${VALID_STATUSES.join(', ')}`
        });
      }
      filter.status = status;
    }

    if (priority) {
      if (!['low', 'medium', 'high', 'urgent'].includes(priority)) {
        return res.status(400).json({
          error: `Invalid priority filter "${priority}". Must be one of: low, medium, high, urgent`
        });
      }
      filter.priority = priority;
    }

    const tickets = await Ticket.find(filter).sort({ createdAt: -1 });
    let enriched = tickets.map(t => enrichTicket(t));

    // Filter by SLA breach in application code (since it's a derived field)
    if (breached === 'true') {
      enriched = enriched.filter(t => t.slaBreached);
    }

    res.json(enriched);
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /tickets/:id — Update a ticket (status transitions, etc.)
 */
exports.updateTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    const { status, subject, description, customerEmail, priority } = req.body;

    // Handle status transition
    if (status && status !== ticket.status) {
      const result = validateTransition(ticket.status, status);
      if (!result.valid) {
        return res.status(400).json({ error: result.message });
      }

      // Auto-set resolvedAt when moving TO resolved
      if (status === 'resolved' && ticket.status !== 'resolved') {
        ticket.resolvedAt = new Date();
      }

      // Auto-clear resolvedAt when moving AWAY FROM resolved
      if (ticket.status === 'resolved' && status !== 'resolved') {
        ticket.resolvedAt = null;
      }

      ticket.status = status;
    }

    // Allow updating other fields too
    if (subject !== undefined) {
      if (!subject.trim()) {
        return res.status(400).json({ error: 'Subject cannot be empty' });
      }
      ticket.subject = subject.trim();
    }

    if (description !== undefined) {
      if (!description.trim()) {
        return res.status(400).json({ error: 'Description cannot be empty' });
      }
      ticket.description = description.trim();
    }

    if (customerEmail !== undefined) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(customerEmail)) {
        return res.status(400).json({ error: `"${customerEmail}" is not a valid email address` });
      }
      ticket.customerEmail = customerEmail.trim();
    }

    if (priority !== undefined) {
      if (!['low', 'medium', 'high', 'urgent'].includes(priority)) {
        return res.status(400).json({
          error: 'Priority must be one of: low, medium, high, urgent'
        });
      }
      ticket.priority = priority;
    }

    await ticket.save();
    res.json(enrichTicket(ticket));
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /tickets/:id — Delete a ticket
 */
exports.deleteTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.findByIdAndDelete(req.params.id);

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    res.json({ message: 'Ticket deleted successfully', _id: ticket._id });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /tickets/stats — Aggregate counts
 * Returns: counts per status, per priority, and number of SLA-breached open tickets
 */
exports.getStats = async (req, res, next) => {
  try {
    // Count by status
    const statusCounts = await Ticket.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Count by priority
    const priorityCounts = await Ticket.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);

    // SLA breached: fetch unresolved tickets and compute in app code
    const unresolvedTickets = await Ticket.find({
      status: { $in: ['open', 'in_progress'] }
    });

    const breachedCount = unresolvedTickets.filter(t => {
      const { slaBreached } = computeDerivedFields(t);
      return slaBreached;
    }).length;

    // Format results
    const byStatus = {};
    VALID_STATUSES.forEach(s => { byStatus[s] = 0; });
    statusCounts.forEach(({ _id, count }) => { byStatus[_id] = count; });

    const byPriority = {};
    ['low', 'medium', 'high', 'urgent'].forEach(p => { byPriority[p] = 0; });
    priorityCounts.forEach(({ _id, count }) => { byPriority[_id] = count; });

    res.json({
      byStatus,
      byPriority,
      breachedOpen: breachedCount,
      total: Object.values(byStatus).reduce((a, b) => a + b, 0)
    });
  } catch (err) {
    next(err);
  }
};

const crypto = require('crypto');
const { computeDerivedFields } = require('../utils/sla');

// In-memory store
let tickets = [
  {
    _id: '1',
    subject: 'Cannot login to my account',
    description: 'I keep getting an invalid password error but I know it is correct.',
    customerEmail: 'john@example.com',
    priority: 'high',
    status: 'open',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    resolvedAt: null,
  },
  {
    _id: '2',
    subject: 'Billing issue',
    description: 'I was charged twice for my subscription this month.',
    customerEmail: 'sarah@example.com',
    priority: 'urgent',
    status: 'in_progress',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    resolvedAt: null,
  },
  {
    _id: '3',
    subject: 'How to export data?',
    description: 'Is there a way to export my data to CSV?',
    customerEmail: 'mike@example.com',
    priority: 'low',
    status: 'resolved',
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000), // 2 days ago
    resolvedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
  }
];

class TicketMock {
  constructor(data) {
    Object.assign(this, data);
  }

  toObject() {
    return { ...this };
  }

  async save() {
    const idx = tickets.findIndex(t => t._id === this._id);
    if (idx !== -1) {
      tickets[idx] = { ...this };
    } else {
      tickets.push({ ...this });
    }
    return this;
  }

  static async create(data) {
    const newTicket = new TicketMock({
      ...data,
      _id: crypto.randomBytes(8).toString('hex'),
      createdAt: new Date(),
      status: data.status || 'open',
      resolvedAt: null
    });
    tickets.unshift(newTicket);
    return newTicket;
  }

  static find(filter = {}) {
    let result = [...tickets];
    if (filter.status) {
      if (filter.status.$in) {
        result = result.filter(t => filter.status.$in.includes(t.status));
      } else {
        result = result.filter(t => t.status === filter.status);
      }
    }
    if (filter.priority) {
      result = result.filter(t => t.priority === filter.priority);
    }
    
    // Return a mock Query object
    return {
      sort: (sortObj) => {
        // mock sorting by createdAt -1
        if (sortObj && sortObj.createdAt === -1) {
          result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }
        return Promise.resolve(result.map(t => new TicketMock(t)));
      },
      then: function(resolve, reject) {
        return Promise.resolve(result.map(t => new TicketMock(t))).then(resolve, reject);
      }
    };
  }

  static async findById(id) {
    const t = tickets.find(t => t._id === id);
    return t ? new TicketMock(t) : null;
  }

  static async findByIdAndDelete(id) {
    const t = tickets.find(t => t._id === id);
    if (t) {
      tickets = tickets.filter(t => t._id !== id);
      return new TicketMock(t);
    }
    return null;
  }

  static async aggregate(pipeline) {
    // Only handles simple group by status or priority
    const groupBy = pipeline[0].$group._id.replace('$', '');
    const counts = {};
    tickets.forEach(t => {
      counts[t[groupBy]] = (counts[t[groupBy]] || 0) + 1;
    });
    return Object.entries(counts).map(([id, count]) => ({ _id: id, count }));
  }
}

module.exports = TicketMock;

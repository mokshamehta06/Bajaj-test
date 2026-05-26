const mongoose = require('mongoose');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ticketSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
      maxlength: [200, 'Subject cannot exceed 200 characters']
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true
    },
    customerEmail: {
      type: String,
      required: [true, 'Customer email is required'],
      trim: true,
      lowercase: true,
      validate: {
        validator: function (v) {
          return emailRegex.test(v);
        },
        message: props => `"${props.value}" is not a valid email address`
      }
    },
    priority: {
      type: String,
      required: [true, 'Priority is required'],
      enum: {
        values: ['low', 'medium', 'high', 'urgent'],
        message: 'Priority must be one of: low, medium, high, urgent'
      }
    },
    status: {
      type: String,
      enum: {
        values: ['open', 'in_progress', 'resolved', 'closed'],
        message: 'Status must be one of: open, in_progress, resolved, closed'
      },
      default: 'open'
    },
    resolvedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true // adds createdAt and updatedAt
  }
);

// Index for common queries
ticketSchema.index({ status: 1 });
ticketSchema.index({ priority: 1 });
ticketSchema.index({ status: 1, priority: 1 });

module.exports = mongoose.model('Ticket', ticketSchema);

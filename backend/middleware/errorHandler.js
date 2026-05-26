/**
 * Global error handling middleware.
 * Catches Mongoose validation errors, cast errors, and generic errors.
 */
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      error: 'Validation failed',
      details: errors
    });
  }

  // Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      error: `Invalid ${err.path}: ${err.value}`
    });
  }

  // Custom application errors with statusCode
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      error: err.message
    });
  }

  // Generic server error
  res.status(500).json({
    error: 'Internal server error'
  });
};

module.exports = errorHandler;

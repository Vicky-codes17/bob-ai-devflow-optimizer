// middleware/errorHandler.js - Global Error Handling Middleware

/**
 * Global error handling middleware
 * Catches all errors and sends appropriate response
 */
function errorHandler(err, req, res, next) {
  console.error('❌ Error:', err);

  // Default error
  let statusCode = 500;
  let message = 'Internal server error';
  let errors = [];

  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation error';
    errors = Object.values(err.errors).map(e => e.message);
  } else if (err.code === 'SQLITE_CONSTRAINT') {
    statusCode = 400;
    message = 'Database constraint violation';
  } else if (err.code === 'ENOENT') {
    statusCode = 404;
    message = 'Resource not found';
  } else if (err.message) {
    message = err.message;
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    message: message,
    errors: errors.length > 0 ? errors : undefined,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
}

module.exports = errorHandler;

// Made with Bob

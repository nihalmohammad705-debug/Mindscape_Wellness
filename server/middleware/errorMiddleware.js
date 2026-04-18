const errorHandler = (error, req, res, next) => {
  console.error('Error occurred:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    body: req.body,
    user: req.user ? req.user.id : 'unauthenticated'
  });

  // MySQL duplicate entry error
  if (error.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({
      error: 'Resource already exists',
      code: 'DUPLICATE_ENTRY'
    });
  }

  // MySQL foreign key constraint error
  if (error.code === 'ER_NO_REFERENCED_ROW') {
    return res.status(404).json({
      error: 'Referenced resource not found',
      code: 'FOREIGN_KEY_VIOLATION'
    });
  }

  // MySQL connection errors
  if (error.code === 'ECONNREFUSED' || error.code === 'PROTOCOL_CONNECTION_LOST') {
    return res.status(503).json({
      error: 'Database connection unavailable',
      code: 'DATABASE_UNAVAILABLE'
    });
  }

  // Default error response
  const statusCode = error.statusCode || 500;
  const response = {
    error: 'Internal server error',
    code: 'INTERNAL_ERROR'
  };

  // Include more details in development
  if (process.env.NODE_ENV === 'development') {
    response.details = error.message;
    response.stack = error.stack;
  }

  res.status(statusCode).json(response);
};

const notFoundHandler = (req, res) => {
  res.status(404).json({
    error: `Endpoint ${req.method} ${req.url} not found`,
    code: 'ENDPOINT_NOT_FOUND'
  });
};

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
  errorHandler,
  notFoundHandler,
  asyncHandler
};
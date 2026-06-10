const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  const requestId = req.id || 'unknown';

  logger.error('Request error', {
    requestId,
    message: err.message,
    statusCode: err.statusCode || 500,
    path: req.path,
  });

  if (err.statusCode) {
    return res.status(err.statusCode).json({
      error: {
        code: err.code || 'ERROR',
        message: err.message,
        status_code: err.statusCode,
        request_id: requestId,
        details: err.details || [],
      },
    });
  }

  if (err.name === 'ValidationError') {
    return res.status(422).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        status_code: 422,
        request_id: requestId,
      },
    });
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: {
        code: 'INVALID_TOKEN',
        message: 'Invalid or expired token',
        status_code: 401,
        request_id: requestId,
      },
    });
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: process.env.NODE_ENV === 'production' ? 'An error occurred' : err.message,
      status_code: statusCode,
      request_id: requestId,
    },
  });
};

module.exports = errorHandler;
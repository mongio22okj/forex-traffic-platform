const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');
const AppError = require('../utils/AppError');

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new AppError('No token provided', 401, 'UNAUTHORIZED');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    logger.warn('Auth middleware error:', { message: error.message });

    if (error.name === 'TokenExpiredError') {
      throw new AppError('Token expired', 401, 'TOKEN_EXPIRED');
    }

    if (error.name === 'JsonWebTokenError') {
      throw new AppError('Invalid token', 401, 'INVALID_TOKEN');
    }

    throw error;
  }
};

const roleCheck = (...allowedRoles) => (req, res, next) => {
  if (!req.user) {
    throw new AppError('User not authenticated', 401, 'UNAUTHORIZED');
  }

  if (!allowedRoles.includes(req.user.role)) {
    throw new AppError('Insufficient permissions', 403, 'FORBIDDEN');
  }

  next();
};

module.exports = { authMiddleware, roleCheck };
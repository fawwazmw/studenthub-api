const { errorResponse } = require('../utils/response.helper');

const errorMiddleware = (err, req, res, next) => {
  console.error('Error:', err);

  // Prisma errors
  if (err.code === 'P2002') {
    return errorResponse(res, 'Duplicate entry. This record already exists.', 409);
  }

  if (err.code === 'P2025') {
    return errorResponse(res, 'Record not found', 404);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return errorResponse(res, 'Invalid token', 401);
  }

  if (err.name === 'TokenExpiredError') {
    return errorResponse(res, 'Token expired', 401);
  }

  // Default error
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  return errorResponse(res, message, statusCode, err.details);
};

module.exports = errorMiddleware;

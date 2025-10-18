const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');
const { errorResponse } = require('../utils/response.helper');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 'Access token is required', 401);
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    try {
      const decoded = jwt.verify(token, jwtConfig.secret);
      req.user = decoded; // Attach user info to request
      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return errorResponse(res, 'Token has expired', 401);
      }
      return errorResponse(res, 'Invalid token', 401);
    }
  } catch (error) {
    return errorResponse(res, 'Authentication failed', 500, error.message);
  }
};

module.exports = authMiddleware;

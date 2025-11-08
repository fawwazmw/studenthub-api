const bcrypt = require('bcryptjs');
const authRepository = require('./auth.repository');
const { generateToken } = require('../../utils/jwt.helper');
const { authLogger } = require('../../utils/logger');

const register = async (name, email, password) => {
  // Check if user already exists
  const existingUser = await authRepository.findByEmail(email);
  if (existingUser) {
    const error = new Error('Email already registered');
    error.statusCode = 409;
    throw error;
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = await authRepository.create({
    name,
    email,
    password: hashedPassword,
  });

  // Log successful registration
  authLogger.info('User registered successfully', {
    userId: user.id,
    email: user.email,
    name: user.name,
    timestamp: new Date().toISOString(),
    action: 'REGISTER'
  });

  // Generate token
  const token = generateToken({ id: user.id, email: user.email });

  // Remove password from response
  const { password: _, ...userWithoutPassword } = user;

  return {
    user: userWithoutPassword,
    token,
  };
};

const login = async (email, password) => {
  // Find user
  const user = await authRepository.findByEmail(email);
  if (!user) {
    // Log failed login attempt
    authLogger.warn('Login failed - User not found', {
      email,
      timestamp: new Date().toISOString(),
      action: 'LOGIN_FAILED',
      reason: 'USER_NOT_FOUND'
    });
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    // Log failed login attempt
    authLogger.warn('Login failed - Invalid password', {
      userId: user.id,
      email: user.email,
      timestamp: new Date().toISOString(),
      action: 'LOGIN_FAILED',
      reason: 'INVALID_PASSWORD'
    });
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  // Log successful login
  authLogger.info('User logged in successfully', {
    userId: user.id,
    email: user.email,
    name: user.name,
    timestamp: new Date().toISOString(),
    action: 'LOGIN'
  });

  // Generate token
  const token = generateToken({ id: user.id, email: user.email });

  // Remove password from response
  const { password: _, ...userWithoutPassword } = user;

  return {
    user: userWithoutPassword,
    token,
  };
};

const getUserById = async (userId) => {
  const user = await authRepository.findById(userId);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

module.exports = {
  register,
  login,
  getUserById,
};

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const errorMiddleware = require('./middlewares/error.middleware');
const requestLogger = require('./middlewares/request-logger.middleware');

// Import routes
const authRoutes = require('./modules/auth/auth.routes');
const dashboardRoutes = require('./modules/dashboard/dashboard.routes');
const notesRoutes = require('./modules/notes/notes.routes');
const wellbeingRoutes = require('./modules/wellbeing/wellbeing.routes');
const profileRoutes = require('./modules/profile/profile.routes');
const tasksRoutes = require('./modules/tasks/tasks.routes');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || '*',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use(requestLogger);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'StudentHub API is running',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/wellbeing', wellbeingRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/tasks', tasksRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handler (must be last)
app.use(errorMiddleware);

module.exports = app;

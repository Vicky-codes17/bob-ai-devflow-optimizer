// server.js - Main Entry Point
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const taskRoutes = require('./routes/tasks');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  
  // Log request
  logger.logRequest(req);
  
  // Log response when finished
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.logResponse(req, res, duration);
  });
  
  next();
});

// Routes
app.use('/api/tasks', taskRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Clyno Backend is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    database: 'PostgreSQL',
    aiMode: process.env.USE_AI === 'true' ? 'Enabled' : 'Mock'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Clyno API - Smart Deadline & Stress Manager',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      tasks: '/api/tasks',
      addTask: 'POST /api/tasks/add-task',
      generatePlan: 'POST /api/tasks/generate-plan',
      stressLevel: 'GET /api/tasks/stress-level',
      simulateDelay: 'POST /api/tasks/simulate-delay'
    }
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log('🚀 Clyno Backend Server');
  console.log('   Smart Deadline & Stress Manager');
  console.log('='.repeat(50));
  console.log(`📡 Server running on http://localhost:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
  console.log(`🤖 AI Mode: ${process.env.USE_AI === 'true' ? 'Enabled (watsonx.ai)' : 'Mock (Development)'}`);
  console.log(`💾 Database: PostgreSQL (${process.env.DB_NAME})`);
  console.log(`🔌 DB Host: ${process.env.DB_HOST}:${process.env.DB_PORT}`);
  console.log('='.repeat(50));
  console.log('📚 API Endpoints:');
  console.log(`   GET    /api/health`);
  console.log(`   GET    /api/tasks`);
  console.log(`   POST   /api/tasks/add-task`);
  console.log(`   POST   /api/tasks/generate-plan`);
  console.log(`   GET    /api/tasks/stress-level`);
  console.log(`   POST   /api/tasks/simulate-delay`);
  console.log(`   PUT    /api/tasks/:id`);
  console.log(`   DELETE /api/tasks/:id`);
  console.log('='.repeat(50));
});

module.exports = app;

// Made with Bob

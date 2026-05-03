// routes/tasks.js - API Route Definitions
const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const {
  validateTaskCreation,
  validateTaskUpdate,
  validateTaskId,
  validateDelaySimulation,
  sanitizeInput
} = require('../middleware/validator');

// Apply sanitization to all routes
router.use(sanitizeInput);

// ============================================
// Task CRUD Routes
// ============================================

/**
 * GET /api/tasks
 * Get all tasks with metadata
 */
router.get('/', taskController.getAllTasks);

// ============================================
// AI & Smart Features Routes (MUST come before :id routes)
// ============================================

/**
 * GET /api/tasks/stats
 * Get task statistics
 */
router.get('/stats', taskController.getTaskStats);

/**
 * POST /api/tasks/generate-plan
 * Generate smart daily plan
 */
router.post('/generate-plan', taskController.generateDailyPlan);

/**
 * GET /api/tasks/stress-level
 * Calculate current stress level
 */
router.get('/stress-level', taskController.getStressLevel);

/**
 * POST /api/tasks/simulate-delay
 * Simulate task delay impact
 */
router.post('/simulate-delay', validateDelaySimulation, taskController.simulateTaskDelay);

// ============================================
// Task CRUD Routes
// ============================================

/**
 * GET /api/tasks/:id
 * Get single task by ID
 */
router.get('/:id', validateTaskId, taskController.getTaskById);

/**
 * POST /api/tasks
 * Create new task
 */
router.post('/', validateTaskCreation, taskController.createTask);

/**
 * PUT /api/tasks/:id
 * Update task
 */
router.put('/:id', validateTaskId, validateTaskUpdate, taskController.updateTask);

/**
 * DELETE /api/tasks/:id
 * Delete task
 */
router.delete('/:id', validateTaskId, taskController.deleteTask);

/**
 * POST /api/tasks/simulate-delay
 * Simulate task delay impact
 */
router.post('/simulate-delay', validateDelaySimulation, taskController.simulateTaskDelay);

/**
 * POST /api/tasks/ai-chat
 * AI Chat assistant
 */
router.post('/ai-chat', taskController.handleAIChat);

module.exports = router;

// Made with Bob

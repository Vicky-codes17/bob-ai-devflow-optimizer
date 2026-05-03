// models/taskModel.js - Database Operations for Tasks (PostgreSQL)
const db = require('../config/database');

/**
 * Get all tasks from database
 * @returns {Promise<Array>} Array of tasks
 */
async function getAllTasks() {
  const sql = `
    SELECT
      id,
      title,
      description,
      priority,
      deadline,
      duration,
      completed,
      created_at
    FROM tasks
    ORDER BY deadline ASC
  `;
  
  const result = await db.query(sql);
  return result.rows;
}

/**
 * Get incomplete tasks only
 * @returns {Promise<Array>} Array of incomplete tasks
 */
async function getIncompleteTasks() {
  const sql = `
    SELECT id, title, description, priority, deadline, duration, completed
    FROM tasks
    WHERE completed = FALSE
    ORDER BY deadline ASC
  `;
  
  const result = await db.query(sql);
  return result.rows;
}

/**
 * Get task by ID
 * @param {number} id - Task ID
 * @returns {Promise<Object|null>} Task object or null
 */
async function getTaskById(id) {
  const sql = 'SELECT * FROM tasks WHERE id = $1';
  const result = await db.query(sql, [id]);
  return result.rows[0] || null;
}

/**
 * Create new task
 * @param {Object} taskData - Task data {title, deadline, duration}
 * @returns {Promise<Object>} Created task with ID
 */
async function createTask(taskData) {
  const { title, description = '', priority = 'medium', deadline, duration = 2 } = taskData;
  
  const sql = `
    INSERT INTO tasks (title, description, priority, deadline, duration, completed, created_at)
    VALUES ($1, $2, $3, $4, $5, FALSE, CURRENT_TIMESTAMP)
    RETURNING *
  `;
  
  const result = await db.query(sql, [title, description, priority, deadline, duration]);
  return result.rows[0];
}

/**
 * Update task
 * @param {number} id - Task ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<boolean>} True if updated, false if not found
 */
async function updateTask(id, updates) {
  const allowedFields = ['title', 'description', 'priority', 'deadline', 'duration', 'completed'];
  const updateFields = [];
  const params = [];
  let paramCount = 1;
  
  // Build dynamic update query
  for (const [key, value] of Object.entries(updates)) {
    if (allowedFields.includes(key)) {
      updateFields.push(`${key} = $${paramCount}`);
      params.push(value);
      paramCount++;
    }
  }
  
  if (updateFields.length === 0) {
    return false;
  }
  
  params.push(id);
  const sql = `UPDATE tasks SET ${updateFields.join(', ')} WHERE id = $${paramCount} RETURNING *`;
  
  const result = await db.query(sql, params);
  return result.rowCount > 0;
}

/**
 * Delete task
 * @param {number} id - Task ID
 * @returns {Promise<boolean>} True if deleted, false if not found
 */
async function deleteTask(id) {
  const sql = 'DELETE FROM tasks WHERE id = $1';
  const result = await db.query(sql, [id]);
  return result.rowCount > 0;
}

/**
 * Mark task as complete
 * @param {number} id - Task ID
 * @returns {Promise<boolean>} True if updated, false if not found
 */
async function markTaskComplete(id) {
  return await updateTask(id, { completed: true });
}

/**
 * Get task count
 * @returns {Promise<Object>} Count of total and incomplete tasks
 */
async function getTaskCount() {
  const totalSql = 'SELECT COUNT(*) as count FROM tasks';
  const incompleteSql = 'SELECT COUNT(*) as count FROM tasks WHERE completed = FALSE';
  
  const totalResult = await db.query(totalSql);
  const incompleteResult = await db.query(incompleteSql);
  
  const total = parseInt(totalResult.rows[0].count);
  const incomplete = parseInt(incompleteResult.rows[0].count);
  
  return {
    total,
    incomplete,
    completed: total - incomplete
  };
}

module.exports = {
  getAllTasks,
  getIncompleteTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  markTaskComplete,
  getTaskCount
};

// Made with Bob
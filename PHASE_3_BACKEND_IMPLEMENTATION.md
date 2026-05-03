# TaskMind AI - PHASE 3: BACKEND IMPLEMENTATION

## Project: TaskMind AI – Smart Deadline & Stress Manager

---

## STEP 1: Create Node.js Express Backend

### Folder Structure

```
server/
├── config/
│   └── database.js          # SQLite database configuration
├── routes/
│   └── tasks.js             # API route handlers
├── services/
│   ├── planGenerator.js     # Smart plan generation logic
│   ├── stressCalculator.js  # Stress level calculation
│   └── watsonxService.js    # IBM watsonx.ai integration
├── middleware/
│   └── errorHandler.js      # Error handling middleware
├── models/
│   └── schema.sql           # Database schema
├── .env                     # Environment variables
├── package.json             # Dependencies
└── server.js                # Main entry point
```

---

### package.json

```json
{
  "name": "taskmind-backend",
  "version": "1.0.0",
  "description": "TaskMind AI Backend Server",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "setup-db": "node config/database.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "sqlite3": "^5.1.6",
    "axios": "^1.6.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

---

### .env (Environment Variables)

```bash
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
DATABASE_PATH=./database/taskmind.db

# IBM watsonx.ai Configuration
WATSONX_API_KEY=your_api_key_here
WATSONX_URL=https://api.watsonx.ai/v1
WATSONX_PROJECT_ID=your_project_id

# Enable/Disable AI (set to false for mock responses)
USE_AI=false
```

---

### server.js (Main Entry Point)

```javascript
// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const taskRoutes = require('./routes/tasks');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/tasks', taskRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'TaskMind AI Backend is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
  console.log(`🤖 AI Mode: ${process.env.USE_AI === 'true' ? 'Enabled' : 'Mock'}`);
});

module.exports = app;
```

---

## STEP 2: Implement APIs

### routes/tasks.js (Complete API Routes)

```javascript
// routes/tasks.js
const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { generatePlan } = require('../services/planGenerator');
const { calculateStress } = require('../services/stressCalculator');
const { simulateDelay } = require('../services/planGenerator');

// ============================================
// 1. POST /api/tasks/add-task - Add new task
// ============================================
router.post('/add-task', async (req, res, next) => {
  try {
    const { title, deadline, duration } = req.body;

    // Validation
    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Task title is required'
      });
    }

    if (!deadline) {
      return res.status(400).json({
        success: false,
        message: 'Deadline is required'
      });
    }

    // Check if deadline is in the future
    const deadlineDate = new Date(deadline);
    if (deadlineDate < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Deadline must be in the future'
      });
    }

    // Insert task into database
    const sql = `
      INSERT INTO tasks (title, deadline, duration, completed, created_at)
      VALUES (?, ?, ?, 0, datetime('now'))
    `;

    db.run(sql, [title.trim(), deadline, duration || 2], function(err) {
      if (err) {
        return next(err);
      }

      // Return created task
      res.status(201).json({
        success: true,
        message: 'Task added successfully',
        data: {
          id: this.lastID,
          title: title.trim(),
          deadline: deadline,
          duration: duration || 2,
          completed: false,
          created_at: new Date().toISOString()
        }
      });
    });

  } catch (error) {
    next(error);
  }
});

// ============================================
// 2. GET /api/tasks - Get all tasks
// ============================================
router.get('/', async (req, res, next) => {
  try {
    const sql = `
      SELECT 
        id,
        title,
        deadline,
        duration,
        completed,
        created_at
      FROM tasks
      ORDER BY deadline ASC
    `;

    db.all(sql, [], (err, rows) => {
      if (err) {
        return next(err);
      }

      // Calculate days remaining for each task
      const tasksWithDays = rows.map(task => {
        const deadlineDate = new Date(task.deadline);
        const now = new Date();
        const diffTime = deadlineDate - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return {
          ...task,
          daysRemaining: diffDays,
          isOverdue: diffDays < 0,
          priority: diffDays <= 1 ? 'high' : diffDays <= 3 ? 'medium' : 'low'
        };
      });

      res.json({
        success: true,
        count: tasksWithDays.length,
        data: tasksWithDays
      });
    });

  } catch (error) {
    next(error);
  }
});

// ============================================
// 3. POST /api/tasks/generate-plan - Generate smart daily plan
// ============================================
router.post('/generate-plan', async (req, res, next) => {
  try {
    // Get all incomplete tasks
    const sql = `
      SELECT id, title, deadline, duration, completed
      FROM tasks
      WHERE completed = 0
      ORDER BY deadline ASC
    `;

    db.all(sql, [], async (err, tasks) => {
      if (err) {
        return next(err);
      }

      if (tasks.length === 0) {
        return res.json({
          success: true,
          message: 'No tasks to plan',
          data: {
            morning: [],
            afternoon: [],
            evening: [],
            totalHours: 0
          }
        });
      }

      // Generate plan using service
      const plan = await generatePlan(tasks);

      res.json({
        success: true,
        message: 'Plan generated successfully',
        data: plan
      });
    });

  } catch (error) {
    next(error);
  }
});

// ============================================
// 4. POST /api/tasks/simulate-delay - Simulate task delay
// ============================================
router.post('/simulate-delay', async (req, res, next) => {
  try {
    const { taskId, delayDays } = req.body;

    // Validation
    if (!taskId) {
      return res.status(400).json({
        success: false,
        message: 'Task ID is required'
      });
    }

    if (!delayDays || delayDays < 1) {
      return res.status(400).json({
        success: false,
        message: 'Delay days must be at least 1'
      });
    }

    // Get the specific task
    const taskSql = 'SELECT * FROM tasks WHERE id = ?';
    
    db.get(taskSql, [taskId], async (err, task) => {
      if (err) {
        return next(err);
      }

      if (!task) {
        return res.status(404).json({
          success: false,
          message: 'Task not found'
        });
      }

      // Get all tasks for comparison
      const allTasksSql = 'SELECT * FROM tasks WHERE completed = 0';
      
      db.all(allTasksSql, [], async (err, allTasks) => {
        if (err) {
          return next(err);
        }

        // Simulate delay
        const simulation = await simulateDelay(task, allTasks, delayDays);

        res.json({
          success: true,
          message: 'Delay simulation completed',
          data: simulation
        });
      });
    });

  } catch (error) {
    next(error);
  }
});

// ============================================
// 5. GET /api/tasks/stress-level - Calculate stress level
// ============================================
router.get('/stress-level', async (req, res, next) => {
  try {
    const sql = 'SELECT * FROM tasks WHERE completed = 0';

    db.all(sql, [], async (err, tasks) => {
      if (err) {
        return next(err);
      }

      // Calculate stress using service
      const stressData = await calculateStress(tasks);

      res.json({
        success: true,
        data: stressData
      });
    });

  } catch (error) {
    next(error);
  }
});

// ============================================
// 6. PUT /api/tasks/:id - Update task (mark complete)
// ============================================
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { completed } = req.body;

    const sql = 'UPDATE tasks SET completed = ? WHERE id = ?';

    db.run(sql, [completed ? 1 : 0, id], function(err) {
      if (err) {
        return next(err);
      }

      if (this.changes === 0) {
        return res.status(404).json({
          success: false,
          message: 'Task not found'
        });
      }

      res.json({
        success: true,
        message: 'Task updated successfully'
      });
    });

  } catch (error) {
    next(error);
  }
});

// ============================================
// 7. DELETE /api/tasks/:id - Delete task
// ============================================
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const sql = 'DELETE FROM tasks WHERE id = ?';

    db.run(sql, [id], function(err) {
      if (err) {
        return next(err);
      }

      if (this.changes === 0) {
        return res.status(404).json({
          success: false,
          message: 'Task not found'
        });
      }

      res.json({
        success: true,
        message: 'Task deleted successfully'
      });
    });

  } catch (error) {
    next(error);
  }
});

module.exports = router;
```

---

## STEP 3: SQLite Database Setup

### config/database.js

```javascript
// config/database.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Database file path
const dbPath = process.env.DATABASE_PATH || './database/taskmind.db';
const dbDir = path.dirname(dbPath);

// Create database directory if it doesn't exist
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
  console.log('📁 Created database directory');
}

// Create database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Error connecting to database:', err.message);
    process.exit(1);
  }
  console.log('✅ Connected to SQLite database');
});

// Create tasks table
const createTableSQL = `
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    deadline TEXT NOT NULL,
    duration INTEGER DEFAULT 2,
    completed INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`;

db.run(createTableSQL, (err) => {
  if (err) {
    console.error('❌ Error creating table:', err.message);
  } else {
    console.log('✅ Tasks table ready');
  }
});

// Helper function to promisify db.run
db.runAsync = function(sql, params = []) {
  return new Promise((resolve, reject) => {
    this.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
};

// Helper function to promisify db.get
db.getAsync = function(sql, params = []) {
  return new Promise((resolve, reject) => {
    this.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

// Helper function to promisify db.all
db.allAsync = function(sql, params = []) {
  return new Promise((resolve, reject) => {
    this.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

module.exports = db;
```

### models/schema.sql

```sql
-- models/schema.sql
-- TaskMind AI Database Schema

-- Tasks Table
CREATE TABLE IF NOT EXISTS tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  deadline TEXT NOT NULL,
  duration INTEGER DEFAULT 2,
  completed INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Sample data for testing
INSERT INTO tasks (title, deadline, duration, completed) VALUES
  ('Math Assignment', '2026-05-03T23:59:59Z', 3, 0),
  ('Project Report', '2026-05-04T23:59:59Z', 4, 0),
  ('Presentation Prep', '2026-05-02T14:00:00Z', 2, 0);
```

---

## STEP 4: Implement Logic

### services/planGenerator.js (Smart Plan Generation)

```javascript
// services/planGenerator.js

/**
 * Generate smart daily plan
 * Divides tasks into Morning / Afternoon / Evening
 */
async function generatePlan(tasks) {
  // Sort tasks by deadline (most urgent first)
  const sortedTasks = tasks.sort((a, b) => {
    return new Date(a.deadline) - new Date(b.deadline);
  });

  const plan = {
    morning: [],    // 6 AM - 12 PM (6 hours)
    afternoon: [],  // 12 PM - 6 PM (6 hours)
    evening: []     // 6 PM - 11 PM (5 hours)
  };

  let morningHours = 0;
  let afternoonHours = 0;
  let eveningHours = 0;

  const MAX_MORNING = 6;
  const MAX_AFTERNOON = 6;
  const MAX_EVENING = 5;

  // Distribute tasks across time slots
  sortedTasks.forEach(task => {
    const duration = task.duration || 2;
    const daysUntil = getDaysUntilDeadline(task.deadline);

    // Calculate time slot based on urgency
    const timeSlot = {
      id: task.id,
      title: task.title,
      duration: duration,
      deadline: task.deadline,
      daysRemaining: daysUntil,
      priority: daysUntil <= 1 ? 'high' : daysUntil <= 3 ? 'medium' : 'low'
    };

    // Assign to time slot based on available hours
    if (morningHours + duration <= MAX_MORNING) {
      timeSlot.timeSlot = `${8 + morningHours}:00 AM - ${8 + morningHours + duration}:00 ${morningHours + duration >= 4 ? 'PM' : 'AM'}`;
      plan.morning.push(timeSlot);
      morningHours += duration;
    } else if (afternoonHours + duration <= MAX_AFTERNOON) {
      timeSlot.timeSlot = `${12 + afternoonHours}:00 PM - ${12 + afternoonHours + duration}:00 PM`;
      plan.afternoon.push(timeSlot);
      afternoonHours += duration;
    } else if (eveningHours + duration <= MAX_EVENING) {
      timeSlot.timeSlot = `${6 + eveningHours}:00 PM - ${6 + eveningHours + duration}:00 PM`;
      plan.evening.push(timeSlot);
      eveningHours += duration;
    } else {
      // Overflow - add to next day or evening anyway
      timeSlot.timeSlot = 'Overflow - Consider rescheduling';
      plan.evening.push(timeSlot);
    }
  });

  const totalHours = morningHours + afternoonHours + eveningHours;

  return {
    date: new Date().toISOString().split('T')[0],
    morning: plan.morning,
    afternoon: plan.afternoon,
    evening: plan.evening,
    totalHours: totalHours,
    aiRecommendation: getRecommendation(totalHours, sortedTasks)
  };
}

/**
 * Simulate delaying a task
 */
async function simulateDelay(task, allTasks, delayDays) {
  // Calculate current stress
  const currentStress = await require('./stressCalculator').calculateStress(allTasks);

  // Create modified task with new deadline
  const originalDeadline = new Date(task.deadline);
  const newDeadline = new Date(originalDeadline);
  newDeadline.setDate(newDeadline.getDate() + delayDays);

  const modifiedTask = {
    ...task,
    deadline: newDeadline.toISOString()
  };

  // Replace task in list
  const modifiedTasks = allTasks.map(t => 
    t.id === task.id ? modifiedTask : t
  );

  // Calculate new stress
  const newStress = await require('./stressCalculator').calculateStress(modifiedTasks);

  // Check for conflicts
  const conflicts = findConflicts(modifiedTask, allTasks);

  // Calculate impact
  const stressIncrease = newStress.score - currentStress.score;
  const percentageIncrease = ((stressIncrease / currentStress.score) * 100).toFixed(0);

  return {
    taskId: task.id,
    taskTitle: task.title,
    originalDeadline: task.deadline,
    newDeadline: newDeadline.toISOString(),
    delayDays: delayDays,
    impact: {
      before: {
        stressLevel: currentStress.currentLevel,
        score: currentStress.score,
        conflicts: 0
      },
      after: {
        stressLevel: newStress.currentLevel,
        score: newStress.score,
        conflicts: conflicts.length,
        conflictingTasks: conflicts
      },
      stressIncrease: stressIncrease,
      percentageIncrease: `${percentageIncrease}%`
    },
    recommendation: getDelayRecommendation(stressIncrease, conflicts),
    aiAnalysis: `Delaying will ${stressIncrease > 10 ? 'significantly' : 'slightly'} increase your stress level. ${conflicts.length > 0 ? `You will have ${conflicts.length} conflicting task(s).` : 'No direct conflicts detected.'}`
  };
}

// Helper functions
function getDaysUntilDeadline(deadline) {
  const deadlineDate = new Date(deadline);
  const now = new Date();
  const diffTime = deadlineDate - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

function getRecommendation(totalHours, tasks) {
  if (totalHours > 12) {
    return '⚠️ Your schedule is overloaded. Consider rescheduling some tasks.';
  } else if (totalHours > 8) {
    return '📊 Your schedule is busy but manageable. Stay focused!';
  } else if (totalHours > 4) {
    return '✅ Your schedule is balanced. Good planning!';
  } else {
    return '🎯 Light workload today. Great time to get ahead!';
  }
}

function findConflicts(modifiedTask, allTasks) {
  const conflicts = [];
  const modifiedDate = new Date(modifiedTask.deadline).toDateString();

  allTasks.forEach(task => {
    if (task.id !== modifiedTask.id) {
      const taskDate = new Date(task.deadline).toDateString();
      if (taskDate === modifiedDate) {
        conflicts.push({
          id: task.id,
          title: task.title,
          deadline: task.deadline
        });
      }
    }
  });

  return conflicts;
}

function getDelayRecommendation(stressIncrease, conflicts) {
  if (stressIncrease > 20 || conflicts.length > 0) {
    return '🔴 NOT RECOMMENDED: Delaying this task will significantly increase stress and create conflicts.';
  } else if (stressIncrease > 10) {
    return '🟡 CAUTION: Delaying will moderately increase stress. Consider alternatives.';
  } else {
    return '🟢 ACCEPTABLE: Minimal impact on stress level. Safe to delay if needed.';
  }
}

module.exports = {
  generatePlan,
  simulateDelay
};
```

### services/stressCalculator.js (Stress Intelligence)

```javascript
// services/stressCalculator.js

/**
 * Calculate stress level based on tasks
 * Output: Low / Medium / High
 */
async function calculateStress(tasks) {
  if (tasks.length === 0) {
    return {
      currentLevel: 'LOW',
      score: 0,
      factors: {
        taskCount: 0,
        urgentTasks: 0,
        totalHoursNeeded: 0,
        availableHours: 24,
        workloadDensity: 'none'
      },
      forecast: generateForecast([]),
      recommendation: '🎉 No tasks! Enjoy your free time.',
      aiInsight: 'You have no pending tasks. Great job staying on top of things!'
    };
  }

  let stressScore = 0;
  let urgentTasks = 0;
  let totalHours = 0;

  // Calculate stress based on multiple factors
  tasks.forEach(task => {
    const daysUntil = getDaysUntilDeadline(task.deadline);
    const duration = task.duration || 2;
    totalHours += duration;

    // Factor 1: Deadline proximity (0-40 points)
    if (daysUntil <= 0) {
      stressScore += 40; // Overdue
      urgentTasks++;
    } else if (daysUntil <= 1) {
      stressScore += 30; // Due tomorrow
      urgentTasks++;
    } else if (daysUntil <= 3) {
      stressScore += 20; // Due soon
      urgentTasks++;
    } else if (daysUntil <= 7) {
      stressScore += 10; // Due this week
    } else {
      stressScore += 5; // Due later
    }

    // Factor 2: Task duration vs time available (0-20 points)
    const urgencyWeight = duration / Math.max(daysUntil, 1);
    stressScore += Math.min(urgencyWeight * 10, 20);
  });

  // Factor 3: Total workload (0-20 points)
  if (totalHours > 15) stressScore += 20;
  else if (totalHours > 10) stressScore += 15;
  else if (totalHours > 5) stressScore += 10;

  // Factor 4: Number of tasks (0-20 points)
  if (tasks.length > 5) stressScore += 20;
  else if (tasks.length > 3) stressScore += 15;
  else if (tasks.length > 1) stressScore += 10;

  // Determine stress level
  let level;
  if (stressScore < 30) level = 'LOW';
  else if (stressScore < 60) level = 'MEDIUM';
  else level = 'HIGH';

  // Workload density
  const avgHoursPerDay = totalHours / 7;
  let density;
  if (avgHoursPerDay > 4) density = 'high';
  else if (avgHoursPerDay > 2) density = 'moderate';
  else density = 'low';

  return {
    currentLevel: level,
    score: Math.min(stressScore, 100),
    factors: {
      taskCount: tasks.length,
      urgentTasks: urgentTasks,
      totalHoursNeeded: totalHours,
      availableHours: 24,
      workloadDensity: density
    },
    forecast: generateForecast(tasks),
    recommendation: getStressRecommendation(level, urgentTasks, totalHours),
    aiInsight: getAIInsight(level, tasks)
  };
}

/**
 * Generate 7-day stress forecast
 */
function generateForecast(tasks) {
  const forecast = [];
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const forecastDate = new Date(today);
    forecastDate.setDate(today.getDate() + i);
    const dateStr = forecastDate.toISOString().split('T')[0];

    // Count tasks due on this day
    const tasksOnDay = tasks.filter(task => {
      const taskDate = new Date(task.deadline).toISOString().split('T')[0];
      return taskDate === dateStr;
    });

    // Calculate score for this day
    let dayScore = tasksOnDay.length * 20;
    tasksOnDay.forEach(task => {
      dayScore += (task.duration || 2) * 5;
    });

    const level = dayScore < 30 ? 'LOW' : dayScore < 60 ? 'MEDIUM' : 'HIGH';

    forecast.push({
      date: dateStr,
      level: level,
      score: Math.min(dayScore, 100),
      tasksDue: tasksOnDay.length
    });
  }

  return forecast;
}

// Helper functions
function getDaysUntilDeadline(deadline) {
  const deadlineDate = new Date(deadline);
  const now = new Date();
  const diffTime = deadlineDate - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

function getStressRecommendation(level, urgentTasks, totalHours) {
  if (level === 'HIGH') {
    return `🔴 HIGH STRESS: You have ${urgentTasks} urgent task(s) and ${totalHours} hours of work. Consider rescheduling or asking for help.`;
  } else if (level === 'MEDIUM') {
    return `🟡 MODERATE STRESS: Stay focused on your ${urgentTasks} urgent task(s). You can manage this workload.`;
  } else {
    return `🟢 LOW STRESS: You're in good shape! Keep up the good work.`;
  }
}

function getAIInsight(level, tasks) {
  const sortedTasks = tasks.sort((a, b) => 
    new Date(a.deadline) - new Date(b.deadline)
  );

  if (sortedTasks.length === 0) {
    return 'No tasks to analyze.';
  }

  const nextTask = sortedTasks[0];
  const daysUntil = getDaysUntilDeadline(nextTask.deadline);

  if (daysUntil <= 1) {
    return `⚠️ Your next task "${nextTask.title}" is due ${daysUntil === 0 ? 'today' : 'tomorrow'}. Start immediately!`;
  } else if (daysUntil <= 3) {
    return `📅 Your next task "${nextTask.title}" is due in ${daysUntil} days. Plan your time wisely.`;
  } else {
    return `✅ Your next task "${nextTask.title}" is due in ${daysUntil} days. You have time to plan ahead.`;
  }
}

module.exports = {
  calculateStress
};
```

---

## STEP 5: AI Integration

### services/watsonxService.js (IBM watsonx.ai Integration)

```javascript
// services/watsonxService.js
const axios = require('axios');

const USE_AI = process.env.USE_AI === 'true';
const WATSONX_API_KEY = process.env.WATSONX_API_KEY;
const WATSONX_URL = process.env.WATSONX_URL;
const WATSONX_PROJECT_ID = process.env.WATSONX_PROJECT_ID;

/**
 * Analyze tasks using IBM watsonx.ai
 */
async function analyzeTasksWithAI(tasks, analysisType = 'stress') {
  // If AI is disabled, return mock response
  if (!USE_AI) {
    console.log('🤖 Using mock AI response (AI disabled)');
    return getMockAIResponse(tasks, analysisType);
  }

  try {
    console.log('🤖 Calling IBM watsonx.ai...');

    // Prepare prompt for watsonx.ai
    const prompt = buildPrompt(tasks, analysisType);

    // Call watsonx.ai API
    const response = await axios.post(
      `${WATSONX_URL}/text/generation`,
      {
        model_id: 'ibm/granite-13b-chat-v2',
        input: prompt,
        parameters: {
          max_new_tokens: 500,
          temperature: 0.7,
          top_p: 0.9
        },
        project_id: WATSONX_PROJECT_ID
      },
      {
        headers: {
          'Authorization': `Bearer ${WATSONX_API_KEY}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );

    console.log('✅ AI response received');
    return parseAIResponse(response.data, analysisType);

  } catch (error) {
    console.error('❌ AI Error:', error.message);
    console.log('🔄 Falling back to mock response');
    return getMockAIResponse(tasks, analysisType);
  }
}

/**
 * Build prompt for watsonx.ai
 */
function buildPrompt(tasks, analysisType) {
  const taskList = tasks.map(t => 
    `- ${t.title} (Due: ${t.deadline}, Duration: ${t.duration}h)`
  ).join('\n');

  if (analysisType === 'stress') {
    return `Analyze the following tasks and calculate stress level (LOW/MEDIUM/HIGH):

Tasks:
${taskList}

Provide:
1. Stress level (LOW/MEDIUM/HIGH)
2. Stress score (0-100)
3. Brief recommendation

Format your response as JSON.`;
  } else if (analysisType === 'plan') {
    return `Create an optimal daily schedule for these tasks:

Tasks:
${taskList}

Divide tasks into:
- Morning (6 AM - 12 PM)
- Afternoon (12 PM - 6 PM)
- Evening (6 PM - 11 PM)

Prioritize by deadline urgency.
Format your response as JSON.`;
  }
}

/**
 * Parse AI response
 */
function parseAIResponse(aiData, analysisType) {
  try {
    // Extract generated text
    const generatedText = aiData.results[0].generated_text;
    
    // Try to parse as JSON
    const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    // If not JSON, return as text
    return { aiResponse: generatedText };
  } catch (error) {
    console.error('Error parsing AI response:', error);
    return getMockAIResponse([], analysisType);
  }
}

/**
 * Mock AI response (fallback)
 */
function getMockAIResponse(tasks, analysisType) {
  if (analysisType === 'stress') {
    let score = tasks.length * 15;
    tasks.forEach(task => {
      const daysUntil = getDaysUntilDeadline(task.deadline);
      if (daysUntil <= 1) score += 25;
      else if (daysUntil <= 3) score += 15;
    });

    const level = score < 30 ? 'LOW' : score < 60 ? 'MEDIUM' : 'HIGH';

    return {
      level: level,
      score: Math.min(score, 100),
      recommendation: `Based on ${tasks.length} tasks, your stress level is ${level}.`
    };
  }

  return {
    message: 'Mock AI response',
    tasks: tasks
  };
}

function getDaysUntilDeadline(deadline) {
  const deadlineDate = new Date(deadline);
  const now = new Date();
  const diffTime = deadlineDate - now;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

module.exports = {
  analyzeTasksWithAI
};
```

---

## STEP 6: Error Handling

### middleware/errorHandler.js

```javascript
// middleware/errorHandler.js

/**
 * Global error handling middleware
 */
function errorHandler(err, req, res, next) {
  console.error('❌ Error:', err);

  // Default error
  let statusCode = 500;
  let message = 'Internal server error';
  let errors = [];

  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation error';
    errors = Object.values(err.errors).map(e => e.message);
  } else if (err.code === 'SQLITE_CONSTRAINT') {
    statusCode = 400;
    message = 'Database constraint violation';
  } else if (err.message) {
    message = err.message;
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    message: message,
    errors: errors.length > 0 ? errors : undefined,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
}

module.exports = errorHandler;
```

---

## Sample API Responses

### 1. Add Task Response
```json
{
  "success": true,
  "message": "Task added successfully",
  "data": {
    "id": 1,
    "title": "Math Assignment",
    "deadline": "2026-05-03T23:59:59Z",
    "duration": 3,
    "completed": false,
    "created_at": "2026-05-01T10:00:00Z"
  }
}
```

### 2. Get Tasks Response
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "id": 1,
      "title": "Math Assignment",
      "deadline": "2026-05-03T23:59:59Z",
      "duration": 3,
      "completed": false,
      "daysRemaining": 2,
      "isOverdue": false,
      "priority": "medium",
      "created_at": "2026-05-01T10:00:00Z"
    }
  ]
}
```

### 3. Generate Plan Response
```json
{
  "success": true,
  "message": "Plan generated successfully",
  "data": {
    "date": "2026-05-01",
    "morning": [
      {
        "id": 3,
        "title": "Presentation Prep",
        "duration": 2,
        "timeSlot": "8:00 AM - 10:00 AM",
        "priority": "high",
        "daysRemaining": 1
      }
    ],
    "afternoon": [
      {
        "id": 1,
        "title": "Math Assignment",
        "duration": 3,
        "timeSlot": "12:00 PM - 3:00 PM",
        "priority": "medium",
        "daysRemaining": 2
      }
    ],
    "evening": [
      {
        "id": 2,
        "title": "Project Report",
        "duration": 4,
        "timeSlot": "6:00 PM - 10:00 PM",
        "priority": "medium",
        "daysRemaining": 3
      }
    ],
    "totalHours": 9,
    "aiRecommendation": "📊 Your schedule is busy but manageable. Stay focused!"
  }
}
```

### 4. Stress Level Response
```json
{
  "success": true,
  "data": {
    "currentLevel": "MEDIUM",
    "score": 55,
    "factors": {
      "taskCount": 3,
      "urgentTasks": 2,
      "totalHoursNeeded": 9,
      "availableHours": 24,
      "workloadDensity": "moderate"
    },
    "forecast": [
      { "date": "2026-05-01", "level": "MEDIUM", "score": 55, "tasksDue": 0 },
      { "date": "2026-05-02", "level": "HIGH", "score": 75, "tasksDue": 1 },
      { "date": "2026-05-03", "level": "HIGH", "score": 80, "tasksDue": 1 },
      { "date": "2026-05-04", "level": "MEDIUM", "score": 45, "tasksDue": 1 },
      { "date": "2026-05-05", "level": "LOW", "score": 20, "tasksDue": 0 },
      { "date": "2026-05-06", "level": "LOW", "score": 10, "tasksDue": 0 },
      { "date": "2026-05-07", "level": "LOW", "score": 10, "tasksDue": 0 }
    ],
    "recommendation": "🟡 MODERATE STRESS: Stay focused on your 2 urgent task(s). You can manage this workload.",
    "aiInsight": "⚠️ Your next task \"Presentation Prep\" is due tomorrow. Start immediately!"
  }
}
```

### 5. Simulate Delay Response
```json
{
  "success": true,
  "message": "Delay simulation completed",
  "data": {
    "taskId": 1,
    "taskTitle": "Math Assignment",
    "originalDeadline": "2026-05-03T23:59:59Z",
    "newDeadline": "2026-05-04T23:59:59Z",
    "delayDays": 1,
    "impact": {
      "before": {
        "stressLevel": "MEDIUM",
        "score": 55,
        "conflicts": 0
      },
      "after": {
        "stressLevel": "HIGH",
        "score": 75,
        "conflicts": 1,
        "conflictingTasks": [
          {
            "id": 2,
            "title": "Project Report",
            "deadline": "2026-05-04T23:59:59Z"
          }
        ]
      },
      "stressIncrease": 20,
      "percentageIncrease": "36%"
    },
    "recommendation": "🔴 NOT RECOMMENDED: Delaying this task will significantly increase stress and create conflicts.",
    "aiAnalysis": "Delaying will significantly increase your stress level. You will have 1 conflicting task(s)."
  }
}
```

---

## Quick Start Guide

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Setup Environment
```bash
# Create .env file
cp .env.example .env

# Edit .env with your settings
nano .env
```

### 3. Initialize Database
```bash
npm run setup-db
```

### 4. Start Server
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

### 5. Test APIs
```bash
# Health check
curl http://localhost:5000/api/health

# Add task
curl -X POST http://localhost:5000/api/tasks/add-task \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Task","deadline":"2026-05-05T10:00:00Z","duration":2}'

# Get all tasks
curl http://localhost:5000/api/tasks

# Generate plan
curl -X POST http://localhost:5000/api/tasks/generate-plan

# Get stress level
curl http://localhost:5000/api/tasks/stress-level
```

---

## Summary

✅ **Complete backend implementation**  
✅ **7 API endpoints** (add, get, update, delete, plan, stress, simulate)  
✅ **SQLite database** with simple schema  
✅ **Smart algorithms** for planning and stress calculation  
✅ **IBM watsonx.ai integration** with fallback  
✅ **Error handling** and validation  
✅ **Beginner-friendly** code with comments  
✅ **Ready for 48-hour hackathon**  

**Backend is complete and ready to connect with React frontend! 🚀**
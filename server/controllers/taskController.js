// controllers/taskController.js - Task Business Logic
const taskModel = require('../models/taskModel');
const { generatePlan, simulateDelay } = require('../services/planGenerator');
const { calculateStress } = require('../services/stressCalculator');
const { calculateDaysRemaining, getPriority } = require('../utils/dateHelper');

/**
 * Get all tasks with calculated fields
 */
async function getAllTasks(req, res, next) {
  try {
    const tasks = await taskModel.getAllTasks();
    
    // Add calculated fields to each task
    const tasksWithMetadata = tasks.map(task => ({
      ...task,
      status: task.completed ? 'completed' : 'pending',
      daysRemaining: calculateDaysRemaining(task.deadline),
      isOverdue: calculateDaysRemaining(task.deadline) < 0,
      priority: task.priority || getPriority(task.deadline),
      estimated_duration: (task.duration || 2) * 60 // Convert hours to minutes
    }));
    
    res.json({
      success: true,
      count: tasksWithMetadata.length,
      data: tasksWithMetadata
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get single task by ID
 */
async function getTaskById(req, res, next) {
  try {
    const { id } = req.params;
    const task = await taskModel.getTaskById(id);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }
    
    res.json({
      success: true,
      data: {
        ...task,
        status: task.completed ? 'completed' : 'pending',
        daysRemaining: calculateDaysRemaining(task.deadline),
        isOverdue: calculateDaysRemaining(task.deadline) < 0,
        priority: task.priority || getPriority(task.deadline),
        estimated_duration: (task.duration || 2) * 60
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Create new task
 */
async function createTask(req, res, next) {
  try {
    const { title, description, priority, estimated_duration, deadline } = req.body;
    
    // Map frontend fields to backend fields
    const taskData = {
      title,
      description: description || '',
      priority: priority || 'medium',
      duration: estimated_duration ? estimated_duration / 60 : 1, // Convert minutes to hours
      deadline
    };
    
    // Validation is handled by middleware
    const task = await taskModel.createTask(taskData);
    
    res.status(201).json({
      success: true,
      message: 'Task added successfully',
      data: task
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Update task
 */
async function updateTask(req, res, next) {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const updated = await taskModel.updateTask(id, updates);
    
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Task updated successfully'
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Delete task
 */
async function deleteTask(req, res, next) {
  try {
    const { id } = req.params;
    
    const deleted = await taskModel.deleteTask(id);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Generate smart daily plan with AI
 */
async function generateDailyPlan(req, res, next) {
  try {
    const tasks = await taskModel.getIncompleteTasks();
    
    if (tasks.length === 0) {
      return res.json({
        success: true,
        message: 'No tasks to plan',
        data: {
          date: new Date().toISOString().split('T')[0],
          schedule: {
            morning: [],
            afternoon: [],
            evening: []
          },
          totalHours: 0,
          summary: '🎉 No tasks! Enjoy your free time.',
          recommendations: []
        }
      });
    }
    
    // Generate plan using AI-enhanced logic
    const plan = await generatePlan(tasks);
    
    // Transform plan to match frontend expectations
    const transformedPlan = {
      date: plan.date,
      schedule: {
        morning: plan.morning || [],
        afternoon: plan.afternoon || [],
        evening: plan.evening || []
      },
      totalHours: plan.totalHours,
      summary: plan.aiRecommendation || 'Your daily plan is ready!',
      recommendations: [
        plan.aiRecommendation,
        'Take regular breaks between tasks',
        'Stay hydrated and maintain focus'
      ].filter(Boolean)
    };
    
    res.json({
      success: true,
      message: 'AI plan generated successfully',
      data: transformedPlan
    });
  } catch (error) {
    console.error('Plan generation error:', error);
    next(error);
  }
}

/**
 * Calculate stress level
 */
async function getStressLevel(req, res, next) {
  try {
    const tasks = await taskModel.getIncompleteTasks();
    const stressData = await calculateStress(tasks);
    
    res.json({
      success: true,
      data: stressData
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Simulate task delay
 */
async function simulateTaskDelay(req, res, next) {
  try {
    const { taskId, delayDays } = req.body;
    
    // Get the specific task
    const task = await taskModel.getTaskById(taskId);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }
    
    // Get all incomplete tasks for comparison
    const allTasks = await taskModel.getIncompleteTasks();
    
    // Simulate delay
    const simulation = await simulateDelay(task, allTasks, delayDays);
    
    res.json({
      success: true,
      message: 'Delay simulation completed',
      data: simulation
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get task statistics
 */
async function getTaskStats(req, res, next) {
  try {
    const counts = await taskModel.getTaskCount();
    const tasks = await taskModel.getAllTasks();
    
    // Calculate additional stats
    const overdueTasks = tasks.filter(task => 
      !task.completed && calculateDaysRemaining(task.deadline) < 0
    ).length;
    
    const urgentTasks = tasks.filter(task => 
      !task.completed && calculateDaysRemaining(task.deadline) <= 1
    ).length;
    
    res.json({
      success: true,
      data: {
        ...counts,
        overdue: overdueTasks,
        urgent: urgentTasks
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Handle AI Chat
 */
async function handleAIChat(req, res, next) {
  try {
    const { message, tasks } = req.body;
    
    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    // Use watsonx.ai service for intelligent responses
    const { analyzeTasksWithAI } = require('../services/watsonxService');
    
    try {
      // Try to get AI response
      const aiResponse = await analyzeTasksWithAI(tasks || [], 'chat', message);
      
      res.json({
        success: true,
        data: {
          response: aiResponse.response || aiResponse.message || generateFallbackResponse(message, tasks),
          source: aiResponse.source || 'ai'
        }
      });
    } catch (aiError) {
      console.log('AI service unavailable, using fallback');
      // Fallback to rule-based responses
      res.json({
        success: true,
        data: {
          response: generateFallbackResponse(message, tasks),
          source: 'fallback'
        }
      });
    }
  } catch (error) {
    next(error);
  }
}

/**
 * Generate fallback chat response
 */
function generateFallbackResponse(message, tasks = []) {
  const msg = message.toLowerCase();
  
  if (msg.includes('how many') || msg.includes('count')) {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;
    return `📊 You have ${total} total tasks: ${completed} completed and ${pending} pending.`;
  }
  
  if (msg.includes('high priority') || msg.includes('urgent')) {
    const highPriority = tasks.filter(t => t.priority === 'high' && !t.completed);
    if (highPriority.length === 0) {
      return '✅ Great! You have no high-priority pending tasks.';
    }
    return `🔴 You have ${highPriority.length} high-priority tasks:\n${highPriority.map(t => `• ${t.title}`).join('\n')}`;
  }
  
  if (msg.includes('plan') || msg.includes('schedule')) {
    const pendingTasks = tasks.filter(t => !t.completed).length;
    if (pendingTasks === 0) {
      return '🎉 You have no pending tasks! Great job staying on top of things.';
    }
    return `📅 I recommend focusing on your ${pendingTasks} pending tasks. Start with high-priority items and break down large tasks into smaller chunks.`;
  }
  
  if (msg.includes('productivity') || msg.includes('tips') || msg.includes('help')) {
    return `Here are some productivity tips:\n🎯 Break large tasks into smaller, manageable sub-tasks\n⏰ Use time-blocking to focus on one task at a time\n📱 Turn off notifications while working\n💪 Take regular breaks to maintain focus\n📊 Review your progress daily`;
  }
  
  if (msg.includes('stress') || msg.includes('overwhelmed')) {
    return `I understand you're feeling stressed. Here's what I recommend:\n🧘 Take a short break to clear your mind\n📋 Prioritize your most important tasks\n🤝 Consider delegating or postponing less critical items\n💡 Break down large tasks into smaller steps\n🎯 Focus on one thing at a time`;
  }
  
  // Default response
  return `I understand you're asking about "${message}". I can help you with:\n• Task statistics and counts\n• Planning and scheduling advice\n• Priority analysis\n• Productivity tips\n• Stress management\n\nWhat would you like to know more about?`;
}

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  generateDailyPlan,
  getStressLevel,
  simulateTaskDelay,
  getTaskStats,
  handleAIChat
};

// Made with Bob
// middleware/validator.js - Input Validation Middleware

/**
 * Validate task creation data
 */
function validateTaskCreation(req, res, next) {
  const { title, description, priority, estimated_duration, deadline } = req.body;
  const errors = [];
  
  // Validate title
  if (!title || typeof title !== 'string') {
    errors.push('Title is required and must be a string');
  } else if (title.trim().length === 0) {
    errors.push('Title cannot be empty');
  } else if (title.length > 200) {
    errors.push('Title must be less than 200 characters');
  }
  
  // Validate description (optional)
  if (description !== undefined && typeof description !== 'string') {
    errors.push('Description must be a string');
  }
  
  // Validate priority (optional)
  if (priority !== undefined) {
    const validPriorities = ['low', 'medium', 'high'];
    if (!validPriorities.includes(priority)) {
      errors.push('Priority must be one of: low, medium, high');
    }
  }
  
  // Validate estimated_duration (optional, in minutes)
  if (estimated_duration !== undefined) {
    if (typeof estimated_duration !== 'number' || estimated_duration < 15 || estimated_duration > 1440) {
      errors.push('Estimated duration must be a number between 15 and 1440 minutes');
    }
  }
  
  // Validate deadline (optional but recommended)
  if (deadline) {
    const deadlineDate = new Date(deadline);
    if (isNaN(deadlineDate.getTime())) {
      errors.push('Invalid deadline format');
    }
  }
  
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors
    });
  }
  
  // Sanitize title
  req.body.title = title.trim();
  if (description) {
    req.body.description = description.trim();
  }
  
  next();
}

/**
 * Validate task update data
 */
function validateTaskUpdate(req, res, next) {
  const { title, deadline, duration, completed } = req.body;
  const errors = [];
  
  // At least one field must be provided
  if (!title && !deadline && duration === undefined && completed === undefined) {
    return res.status(400).json({
      success: false,
      message: 'At least one field must be provided for update'
    });
  }
  
  // Validate title if provided
  if (title !== undefined) {
    if (typeof title !== 'string') {
      errors.push('Title must be a string');
    } else if (title.trim().length === 0) {
      errors.push('Title cannot be empty');
    } else if (title.length > 200) {
      errors.push('Title must be less than 200 characters');
    } else {
      req.body.title = title.trim();
    }
  }
  
  // Validate deadline if provided
  if (deadline !== undefined) {
    const deadlineDate = new Date(deadline);
    if (isNaN(deadlineDate.getTime())) {
      errors.push('Invalid deadline format');
    }
  }
  
  // Validate duration if provided
  if (duration !== undefined) {
    if (typeof duration !== 'number' || duration < 0.5 || duration > 24) {
      errors.push('Duration must be a number between 0.5 and 24 hours');
    }
  }
  
  // Validate completed if provided
  if (completed !== undefined) {
    if (typeof completed !== 'boolean') {
      errors.push('Completed must be a boolean');
    }
  }
  
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors
    });
  }
  
  next();
}

/**
 * Validate task ID parameter
 */
function validateTaskId(req, res, next) {
  const { id } = req.params;
  
  if (!id || isNaN(parseInt(id))) {
    return res.status(400).json({
      success: false,
      message: 'Invalid task ID'
    });
  }
  
  next();
}

/**
 * Validate delay simulation data
 */
function validateDelaySimulation(req, res, next) {
  const { taskId, delayDays } = req.body;
  const errors = [];
  
  // Validate taskId
  if (!taskId || isNaN(parseInt(taskId))) {
    errors.push('Valid task ID is required');
  }
  
  // Validate delayDays
  if (!delayDays || typeof delayDays !== 'number') {
    errors.push('Delay days is required and must be a number');
  } else if (delayDays < 1 || delayDays > 30) {
    errors.push('Delay days must be between 1 and 30');
  }
  
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors
    });
  }
  
  next();
}

/**
 * Sanitize input to prevent XSS
 */
function sanitizeInput(req, res, next) {
  if (req.body) {
    for (const key in req.body) {
      if (typeof req.body[key] === 'string') {
        // Remove potentially dangerous characters
        req.body[key] = req.body[key]
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
      }
    }
  }
  next();
}

/**
 * Rate limiting helper (simple in-memory implementation)
 */
const requestCounts = new Map();

function simpleRateLimit(maxRequests = 100, windowMs = 60000) {
  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    
    if (!requestCounts.has(ip)) {
      requestCounts.set(ip, { count: 1, resetTime: now + windowMs });
      return next();
    }
    
    const record = requestCounts.get(ip);
    
    if (now > record.resetTime) {
      record.count = 1;
      record.resetTime = now + windowMs;
      return next();
    }
    
    if (record.count >= maxRequests) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests, please try again later'
      });
    }
    
    record.count++;
    next();
  };
}

module.exports = {
  validateTaskCreation,
  validateTaskUpdate,
  validateTaskId,
  validateDelaySimulation,
  sanitizeInput,
  simpleRateLimit
};

// Made with Bob
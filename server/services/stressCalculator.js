// services/stressCalculator.js - Stress Intelligence Logic

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

// Made with Bob

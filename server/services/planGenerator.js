// services/planGenerator.js - Smart Plan Generation Logic

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
      const startHour = 6 + morningHours;
      const endHour = startHour + duration;
      timeSlot.timeSlot = formatTimeSlot(startHour, endHour);
      plan.morning.push(timeSlot);
      morningHours += duration;
    } else if (afternoonHours + duration <= MAX_AFTERNOON) {
      const startHour = 12 + afternoonHours;
      const endHour = startHour + duration;
      timeSlot.timeSlot = formatTimeSlot(startHour, endHour);
      plan.afternoon.push(timeSlot);
      afternoonHours += duration;
    } else if (eveningHours + duration <= MAX_EVENING) {
      const startHour = 18 + eveningHours;
      const endHour = startHour + duration;
      timeSlot.timeSlot = formatTimeSlot(startHour, endHour);
      plan.evening.push(timeSlot);
      eveningHours += duration;
    } else {
      // Overflow - add to evening anyway with warning
      timeSlot.timeSlot = 'Overflow - Consider rescheduling';
      timeSlot.warning = true;
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
  const percentageIncrease = currentStress.score > 0 
    ? ((stressIncrease / currentStress.score) * 100).toFixed(0)
    : '0';

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

function formatTimeSlot(startHour, endHour) {
  const formatHour = (hour) => {
    if (hour === 12) return '12:00 PM';
    if (hour === 24) return '12:00 AM';
    if (hour > 12) return `${hour - 12}:00 PM`;
    return `${hour}:00 AM`;
  };
  return `${formatHour(startHour)} - ${formatHour(endHour)}`;
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

// Made with Bob

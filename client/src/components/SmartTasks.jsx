import React from 'react';

const SmartTasks = ({ tasks, stressData }) => {
  // AI Insights based on tasks
  const generateInsights = () => {
    const insights = [];
    
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;
    const highPriorityTasks = tasks.filter(t => t.priority === 'high' && !t.completed).length;
    const overdueCount = tasks.filter(t => {
      const daysLeft = Math.ceil((new Date(t.deadline) - new Date()) / (1000 * 60 * 60 * 24));
      return !t.completed && daysLeft < 0;
    }).length;

    // Generate AI recommendations
    if (highPriorityTasks > 3) {
      insights.push({
        type: 'warning',
        icon: '⚠️',
        title: 'High Workload Alert',
        message: `You have ${highPriorityTasks} high-priority tasks. Consider focusing on the most urgent ones first.`,
        action: 'Review Priorities'
      });
    }

    if (overdueCount > 0) {
      insights.push({
        type: 'critical',
        icon: '🚨',
        title: 'Overdue Tasks',
        message: `${overdueCount} task(s) are overdue. Immediate action required!`,
        action: 'Fix Now'
      });
    }

    if (completedTasks / totalTasks > 0.8) {
      insights.push({
        type: 'success',
        icon: '🎉',
        title: 'Great Progress!',
        message: `You've completed ${completedTasks} of ${totalTasks} tasks. Keep up the momentum!`,
        action: 'Continue'
      });
    }

    if (tasks.filter(t => !t.completed).length === 0) {
      insights.push({
        type: 'success',
        icon: '✨',
        title: 'All Caught Up!',
        message: 'Congratulations! You have completed all your tasks.',
        action: 'Add More'
      });
    }

    if (stressData?.stressLevel === 'high') {
      insights.push({
        type: 'warning',
        icon: '😰',
        title: 'High Stress Detected',
        message: 'Your stress level is high. Consider breaking down tasks or delegating.',
        action: 'See Tips'
      });
    }

    return insights.length > 0 ? insights : [{
      type: 'info',
      icon: '💡',
      title: 'All Clear',
      message: 'Your task load looks manageable. Keep maintaining this pace!',
      action: 'Good Job'
    }];
  };

  // Recommended Actions
  const getRecommendedActions = () => {
    const actions = [];
    const incompleteTasks = tasks.filter(t => !t.completed);
    
    if (incompleteTasks.length > 0) {
      const nextTask = incompleteTasks.sort((a, b) => new Date(a.deadline) - new Date(b.deadline))[0];
      actions.push({
        icon: '🎯',
        title: 'Focus on Next Task',
        description: nextTask.title,
        priority: 'high'
      });
    }

    const longTasks = incompleteTasks.filter(t => t.duration > 4);
    if (longTasks.length > 0) {
      actions.push({
        icon: '⏰',
        title: 'Break Down Large Tasks',
        description: `${longTasks.length} task(s) over 4 hours`,
        priority: 'medium'
      });
    }

    actions.push({
      icon: '📊',
      title: 'Generate Daily Plan',
      description: 'Let AI create your optimal schedule',
      priority: 'high'
    });

    return actions;
  };

  const insights = generateInsights();
  const actions = getRecommendedActions();

  const getInsightColor = (type) => {
    const colors = {
      critical: 'border-red-500/30 bg-red-500/5',
      warning: 'border-yellow-500/30 bg-yellow-500/5',
      success: 'border-green-500/30 bg-green-500/5',
      info: 'border-blue-500/30 bg-blue-500/5'
    };
    return colors[type] || colors.info;
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* AI Insights */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <svg className="w-8 h-8 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          AI Insights
        </h2>
        
        <div className="grid gap-4">
          {insights.map((insight, idx) => (
            <div key={idx} className={`glass-card rounded-2xl p-6 border ${getInsightColor(insight.type)} hover-lift card-hover`}>
              <div className="flex items-start gap-4">
                <span className="text-4xl flex-shrink-0">{insight.icon}</span>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-1">{insight.title}</h3>
                  <p className="text-gray-300 text-sm mb-3">{insight.message}</p>
                  <button className="btn-primary px-4 py-2 text-sm rounded-lg hover:opacity-90 transition-opacity">
                    {insight.action}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Actions */}
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-white flex items-center gap-2">
          <svg className="w-8 h-8 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Recommended Actions
        </h3>

        <div className="grid gap-4">
          {actions.map((action, idx) => (
            <div key={idx} className="glass-card rounded-2xl p-6 border border-white/10 hover-lift card-hover group cursor-pointer">
              <div className="flex items-start gap-4">
                <span className="text-4xl flex-shrink-0 group-hover:scale-110 transition-transform">{action.icon}</span>
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-white mb-1">{action.title}</h4>
                  <p className="text-gray-400 text-sm">{action.description}</p>
                </div>
                <div className="flex-shrink-0">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    action.priority === 'high' 
                      ? 'bg-red-500/20 text-red-400' 
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {action.priority}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="glass-card rounded-2xl p-6 border border-white/10">
        <h3 className="text-xl font-bold text-white mb-4">Quick Stats</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-white/5 rounded-lg text-center border border-white/10">
            <p className="text-2xl font-bold text-primary-400">{tasks.length}</p>
            <p className="text-xs text-gray-400 mt-1">Total Tasks</p>
          </div>
          <div className="p-4 bg-white/5 rounded-lg text-center border border-white/10">
            <p className="text-2xl font-bold text-green-400">{tasks.filter(t => t.completed).length}</p>
            <p className="text-xs text-gray-400 mt-1">Completed</p>
          </div>
          <div className="p-4 bg-white/5 rounded-lg text-center border border-white/10">
            <p className="text-2xl font-bold text-red-400">{tasks.filter(t => t.priority === 'high' && !t.completed).length}</p>
            <p className="text-xs text-gray-400 mt-1">High Priority</p>
          </div>
          <div className="p-4 bg-white/5 rounded-lg text-center border border-white/10">
            <p className="text-2xl font-bold text-yellow-400">{tasks.reduce((sum, t) => sum + (t.duration || 0), 0)}</p>
            <p className="text-xs text-gray-400 mt-1">Total Hours</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartTasks;

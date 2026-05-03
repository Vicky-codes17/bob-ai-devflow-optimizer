import React from 'react';

const TaskInvestments = ({ tasks }) => {
  // Format hours to display properly (e.g., 1.5h, 2h, 0.5h)
  const formatHours = (hours) => {
    if (hours === 0) return '0';
    if (Number.isInteger(hours)) return hours.toString();
    return hours.toFixed(2).replace(/\.?0+$/, ''); // Remove trailing zeros
  };

  // Calculate task metrics
  const getTaskMetrics = () => {
    const totalDuration = tasks.reduce((sum, t) => sum + (parseFloat(t.duration) || 0), 0);
    const completedDuration = tasks.filter(t => t.completed).reduce((sum, t) => sum + (parseFloat(t.duration) || 0), 0);
    const incompleteDuration = tasks.filter(t => !t.completed).reduce((sum, t) => sum + (parseFloat(t.duration) || 0), 0);

    return {
      totalTasks: tasks.length,
      completedTasks: tasks.filter(t => t.completed).length,
      incompleteTasks: tasks.filter(t => !t.completed).length,
      totalHours: totalDuration,
      completedHours: completedDuration,
      incompleteHours: incompleteDuration,
      efficiency: tasks.length > 0 ? Math.round((completedDuration / totalDuration) * 100) || 0 : 0
    };
  };

  const metrics = getTaskMetrics();
  
  // Sort by duration for ROI analysis
  const tasksByROI = [...tasks]
    .filter(t => !t.completed)
    .sort((a, b) => (b.duration || 0) - (a.duration || 0))
    .slice(0, 10);

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'text-red-400 bg-red-500/10',
      medium: 'text-yellow-400 bg-yellow-500/10',
      low: 'text-green-400 bg-green-500/10'
    };
    return colors[priority] || 'text-gray-400 bg-gray-500/10';
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Time Investment Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card p-6 rounded-2xl border border-white/10 hover-lift">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Total Investment</span>
            <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-3xl font-bold text-white">{formatHours(metrics.totalHours)}h</p>
          <p className="text-xs text-gray-500 mt-2">Across {metrics.totalTasks} tasks</p>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-white/10 hover-lift">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Completed</span>
            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-3xl font-bold text-green-400">{formatHours(metrics.completedHours)}h</p>
          <p className="text-xs text-gray-500 mt-2">{metrics.completedTasks} tasks done</p>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-white/10 hover-lift">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Remaining</span>
            <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-3xl font-bold text-yellow-400">{formatHours(metrics.incompleteHours)}h</p>
          <p className="text-xs text-gray-500 mt-2">{metrics.incompleteTasks} tasks left</p>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-white/10 hover-lift">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Efficiency</span>
            <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <p className="text-3xl font-bold text-primary-400">{metrics.efficiency}%</p>
          <p className="text-xs text-gray-500 mt-2">Task completion rate</p>
        </div>
      </div>

      {/* Time Investment Progress */}
      {metrics.totalHours > 0 && (
        <div className="glass-card rounded-2xl p-6 border border-white/10">
          <h3 className="text-xl font-bold text-white mb-4">Time Allocation</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-400">Completed Work</span>
                <span className="text-sm font-semibold text-green-400">{formatHours(metrics.completedHours)}h / {formatHours(metrics.totalHours)}h</span>
              </div>
              <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden border border-white/20">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full"
                  style={{ width: `${(metrics.completedHours / metrics.totalHours) * 100}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-400">Remaining Work</span>
                <span className="text-sm font-semibold text-yellow-400">{formatHours(metrics.incompleteHours)}h / {formatHours(metrics.totalHours)}h</span>
              </div>
              <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden border border-white/20">
                <div 
                  className="h-full bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full"
                  style={{ width: `${(metrics.incompleteHours / metrics.totalHours) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top Investment Tasks */}
      {tasksByROI.length > 0 && (
        <div className="glass-card rounded-2xl p-6 border border-white/10">
          <h3 className="text-xl font-bold text-white mb-4">Highest Time Investment Tasks</h3>
          <div className="space-y-3">
            {tasksByROI.map((task, index) => (
              <div key={task.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-500/20 text-primary-400 font-bold text-sm">
                    #{index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-semibold truncate">{task.title}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(task.deadline).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                  <div className="text-right">
                    <p className="text-white font-bold">{formatHours(parseFloat(task.duration) || 0)}h</p>
                    <p className="text-xs text-gray-500">hours</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tasks.length === 0 && (
        <div className="glass-card rounded-2xl p-12 text-center border border-white/10">
          <svg className="w-24 h-24 mx-auto mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p className="text-gray-400 text-lg">No tasks yet</p>
          <p className="text-gray-500 text-sm mt-2">Add tasks to analyze your time investments</p>
        </div>
      )}
    </div>
  );
};

export default TaskInvestments;

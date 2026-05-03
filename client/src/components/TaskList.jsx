import React from 'react';

const TaskList = ({ tasks, onStatusChange, onDelete, onSimulateDelay }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/20 text-red-300 border-red-500/50';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50';
      case 'low':
        return 'bg-green-500/20 text-green-300 border-green-500/50';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/50';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-300 border-green-500/50';
      case 'in_progress':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/50';
      case 'delayed':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/50';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/50';
    }
  };

  const getPriorityIcon = (priority) => {
    const colors = {
      high: 'text-red-400',
      medium: 'text-yellow-400',
      low: 'text-green-400'
    };
    return (
      <svg className={`w-4 h-4 ${colors[priority] || 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
        <circle cx="10" cy="10" r="8"/>
      </svg>
    );
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'in_progress':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      case 'delayed':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        );
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No deadline';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (tasks.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-12 text-center animate-fade-in">
        <svg className="w-24 h-24 mx-auto mb-4 text-gray-500 animate-float" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p className="text-gray-400 text-lg mb-2">No tasks yet</p>
        <p className="text-gray-500 text-sm">Add your first task to get started!</p>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-6 border border-white/10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <svg className="w-8 h-8 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          Today's Tasks
        </h2>
        <div className="flex items-center gap-2 text-sm">
          <span className="px-3 py-1 bg-primary-500/20 text-primary-300 rounded-lg">
            {tasks.length} Total
          </span>
          <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-lg">
            {tasks.filter(t => t.status === 'completed').length} Done
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {tasks.map((task, index) => (
          <div
            key={task.id}
            className="glass-card border border-white/10 rounded-xl p-5 hover-lift card-hover animate-fade-in"
            style={{animationDelay: `${index * 0.1}s`}}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-3 flex-wrap">
                  <h3 className="text-lg font-semibold text-white truncate">
                    {task.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-lg border ${getPriorityColor(
                        task.priority
                      )} flex items-center gap-1`}
                    >
                      {getPriorityIcon(task.priority)}
                      {task.priority.toUpperCase()}
                    </span>
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-lg border ${getStatusColor(
                        task.status
                      )} flex items-center gap-1`}
                    >
                      {getStatusIcon(task.status)}
                      {task.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>

                {task.description && (
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                    {task.description}
                  </p>
                )}

                <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-lg">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{task.estimated_duration} min</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-lg">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{formatDate(task.deadline)}</span>
                  </div>
                  {task.scheduled_time && (
                    <div className="flex items-center gap-2 bg-primary-500/20 text-primary-300 px-3 py-1 rounded-lg">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{formatDate(task.scheduled_time)}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2 min-w-[140px]">
                <select
                  value={task.status}
                  onChange={(e) => onStatusChange(task.id, e.target.value)}
                  className="px-3 py-2 text-sm bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-white transition-all cursor-pointer hover:bg-white/10"
                >
                  <option value="pending" className="bg-dark-800">Pending</option>
                  <option value="in_progress" className="bg-dark-800">In Progress</option>
                  <option value="completed" className="bg-dark-800">Completed</option>
                  <option value="delayed" className="bg-dark-800">Delayed</option>
                </select>

                <button
                  onClick={() => onSimulateDelay(task.id)}
                  disabled={task.status === 'completed'}
                  className="px-3 py-2 text-sm bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 border border-orange-500/50 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed hover-lift flex items-center justify-center gap-2"
                  title="Simulate Delay"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Delay
                </button>

                <button
                  onClick={() => onDelete(task.id)}
                  className="px-3 py-2 text-sm bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/50 rounded-lg transition-all hover-lift flex items-center justify-center gap-2"
                  title="Delete Task"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
              </div>
            </div>

            {/* Progress indicator for in-progress tasks */}
            {task.status === 'in_progress' && (
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                  <span>Progress</span>
                  <span>In Progress...</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full animate-pulse-slow" style={{width: '60%'}}></div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskList;

// Made with Bob

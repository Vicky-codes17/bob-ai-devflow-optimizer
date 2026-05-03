import React from 'react';

const TaskMatrix = ({ tasks }) => {
  // Categorize tasks by urgency and importance
  const categorizeTask = (task) => {
    const daysRemaining = Math.ceil((new Date(task.deadline) - new Date()) / (1000 * 60 * 60 * 24));
    const isUrgent = daysRemaining <= 1;
    const isImportant = task.priority === 'high' || (task.priority === 'medium' && task.duration >= 2);

    if (isUrgent && isImportant) return 'do-first';
    if (!isUrgent && isImportant) return 'schedule';
    if (isUrgent && !isImportant) return 'delegate';
    return 'eliminate';
  };

  const quadrants = {
    'do-first': { label: 'Do First', color: 'red', icon: '🔴', tasks: [] },
    'schedule': { label: 'Schedule', color: 'yellow', icon: '🟡', tasks: [] },
    'delegate': { label: 'Delegate', color: 'blue', icon: '🔵', tasks: [] },
    'eliminate': { label: 'Eliminate', color: 'green', icon: '🟢', tasks: [] }
  };

  // Filter incomplete tasks and categorize
  tasks.filter(t => !t.completed).forEach(task => {
    const quadrant = categorizeTask(task);
    quadrants[quadrant].tasks.push(task);
  });

  const QuadrantCard = ({ quad, title, description }) => {
    const colorClasses = {
      'red': 'border-red-500/30 bg-red-950',
      'yellow': 'border-yellow-500/30 bg-yellow-950',
      'blue': 'border-blue-500/30 bg-blue-950',
      'green': 'border-green-500/30 bg-green-950'
    };

    const taskColorClasses = {
      'red': 'bg-red-500/10 border-red-500/30',
      'yellow': 'bg-yellow-500/10 border-yellow-500/30',
      'blue': 'bg-blue-500/10 border-blue-500/30',
      'green': 'bg-green-500/10 border-green-500/30'
    };

    return (
    <div className={`glass-card rounded-2xl p-6 border ${colorClasses[quad.color]} hover-lift card-hover`}>
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl">{quad.icon}</span>
        <div>
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <p className="text-sm text-gray-400">{description}</p>
        </div>
      </div>
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {quad.tasks.length === 0 ? (
          <p className="text-gray-500 text-sm italic">No tasks</p>
        ) : (
          quad.tasks.map(task => (
            <div key={task.id} className={`p-3 rounded-lg ${taskColorClasses[quad.color]}`}>
              <p className="text-sm font-semibold text-white truncate">{task.title}</p>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(task.deadline).toLocaleDateString()} • {task.priority}
              </p>
            </div>
          ))
        )}
      </div>
      <div className="mt-4 pt-4 border-t border-white/10">
        <p className="text-sm text-gray-400">Total: <span className="font-bold text-white">{quad.tasks.length}</span></p>
      </div>
    </div>
    );
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="glass-card rounded-2xl p-8 border border-white/10">
        <h2 className="text-3xl font-bold text-white mb-2">Eisenhower Matrix</h2>
        <p className="text-gray-400 mb-6">Prioritize tasks based on urgency and importance</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <QuadrantCard 
            quad={quadrants['do-first']}
            title="Do First"
            description="Urgent & Important - Focus on these"
          />
          <QuadrantCard 
            quad={quadrants['schedule']}
            title="Schedule"
            description="Not Urgent but Important - Plan these"
          />
          <QuadrantCard 
            quad={quadrants['delegate']}
            title="Delegate"
            description="Urgent but Not Important - Delegate if possible"
          />
          <QuadrantCard 
            quad={quadrants['eliminate']}
            title="Eliminate"
            description="Not Urgent & Not Important - Consider dropping"
          />
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-xl text-center border border-white/10">
          <p className="text-2xl font-bold text-red-400">{quadrants['do-first'].tasks.length}</p>
          <p className="text-xs text-gray-400 mt-2">Do First (Critical)</p>
        </div>
        <div className="glass-card p-4 rounded-xl text-center border border-white/10">
          <p className="text-2xl font-bold text-yellow-400">{quadrants['schedule'].tasks.length}</p>
          <p className="text-xs text-gray-400 mt-2">Schedule (Important)</p>
        </div>
        <div className="glass-card p-4 rounded-xl text-center border border-white/10">
          <p className="text-2xl font-bold text-blue-400">{quadrants['delegate'].tasks.length}</p>
          <p className="text-xs text-gray-400 mt-2">Delegate (Urgent)</p>
        </div>
        <div className="glass-card p-4 rounded-xl text-center border border-white/10">
          <p className="text-2xl font-bold text-green-400">{quadrants['eliminate'].tasks.length}</p>
          <p className="text-xs text-gray-400 mt-2">Eliminate (Low)</p>
        </div>
      </div>
    </div>
  );
};

export default TaskMatrix;

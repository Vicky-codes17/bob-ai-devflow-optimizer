import React, { useState } from 'react';

const TaskForm = ({ onTaskAdded }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    estimated_duration: 60,
    deadline: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.title.trim()) {
      setError('Task title is required');
      return;
    }
    
    if (!formData.deadline) {
      setError('Deadline is required');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      await onTaskAdded(formData);
      // Reset form on success
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        estimated_duration: 60,
        deadline: '',
      });
      setIsExpanded(false);
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to add task. Please check your connection.';
      setError(errorMessage);
      console.error('Task creation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'estimated_duration' ? parseInt(value) || 0 : value,
    }));
  };

  return (
    <div className="glass-card rounded-2xl p-6 hover-lift card-hover border border-white/10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <svg className="w-8 h-8 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create New Task
        </h2>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg transition-all text-sm font-medium"
        >
          {isExpanded ? 'Collapse' : 'Expand'}
        </button>
      </div>
      
      {error && (
        <div className="glass-card border-red-500/50 p-4 rounded-xl mb-4 animate-scale-in">
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-red-300">{error}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
              Task Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-white placeholder-gray-500 transition-all"
              placeholder="Enter task title..."
            />
          </div>

          {isExpanded && (
            <>
              <div className="md:col-span-2 animate-fade-in">
                <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-white placeholder-gray-500 transition-all resize-none"
                  placeholder="Describe your task..."
                />
              </div>

              <div className="animate-fade-in" style={{animationDelay: '0.1s'}}>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-300 mb-2">
                  Priority *
                </label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-white transition-all cursor-pointer"
                >
                  <option value="low" className="bg-dark-800">Low Priority</option>
                  <option value="medium" className="bg-dark-800">Medium Priority</option>
                  <option value="high" className="bg-dark-800">High Priority</option>
                </select>
              </div>

              <div className="animate-fade-in" style={{animationDelay: '0.2s'}}>
                <label htmlFor="estimated_duration" className="block text-sm font-medium text-gray-300 mb-2">
                  Duration (minutes) *
                </label>
                <input
                  type="number"
                  id="estimated_duration"
                  name="estimated_duration"
                  value={formData.estimated_duration}
                  onChange={handleChange}
                  required
                  min="15"
                  step="15"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-white placeholder-gray-500 transition-all"
                />
              </div>

              <div className="md:col-span-2 animate-fade-in" style={{animationDelay: '0.3s'}}>
                <label htmlFor="deadline" className="block text-sm font-medium text-gray-300 mb-2">
                  Deadline
                </label>
                <input
                  type="datetime-local"
                  id="deadline"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-white transition-all"
                />
              </div>
            </>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Adding Task...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Task
              </>
            )}
          </span>
        </button>
      </form>
    </div>
  );
};

export default TaskForm;

// Made with Bob

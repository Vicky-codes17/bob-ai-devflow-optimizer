import React, { useState, useEffect } from 'react';

const DailyPlan = ({ plan, onGeneratePlan, loading }) => {
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().getDate());
  const [showScheduleInput, setShowScheduleInput] = useState(false);
  const [schedulePreferences, setSchedulePreferences] = useState({
    startTime: '09:00',
    endTime: '18:00',
    breakDuration: 60,
    focusBlocks: 90
  });

  useEffect(() => {
    const now = new Date();
    const monthYear = now.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    setSelectedMonth(monthYear);
  }, []);

  const handleSchedulePreferenceChange = (field, value) => {
    setSchedulePreferences(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGenerateWithPreferences = () => {
    // Pass preferences to parent component
    onGeneratePlan(schedulePreferences);
    setShowScheduleInput(false);
  };

  const getTimeSlotIcon = (timeSlot) => {
    switch (timeSlot) {
      case 'morning':
        return '🌅';
      case 'afternoon':
        return '☀️';
      case 'evening':
        return '🌆';
      default:
        return '📋';
    }
  };

  const getTimeSlotLabel = (timeSlot) => {
    switch (timeSlot) {
      case 'morning':
        return 'Morning (6 AM - 12 PM)';
      case 'afternoon':
        return 'Afternoon (12 PM - 6 PM)';
      case 'evening':
        return 'Evening (6 PM - 10 PM)';
      default:
        return timeSlot;
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Generate calendar days dynamically
  const generateCalendarDays = () => {
    const today = new Date().getDate();
    const days = [];
    for (let i = 0; i < 4; i++) {
      const date = today + i;
      days.push({
        date: date,
        hasEvent: plan && plan.schedule && Object.keys(plan.schedule).length > 0,
        isToday: i === 0
      });
    }
    return days;
  };

  const calendarDays = generateCalendarDays();

  return (
    <div className="glass-card rounded-2xl p-6 border border-white/10 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <span className="text-3xl">📅</span>
          Time Schedule
        </h2>
        <div className="flex gap-3">
          <button
            onClick={() => setShowScheduleInput(!showScheduleInput)}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white font-medium transition-all flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            Preferences
          </button>
          <button
            onClick={showScheduleInput ? handleGenerateWithPreferences : onGeneratePlan}
            disabled={loading}
            className="btn-primary text-white font-semibold py-2 px-6 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Generating...
                </>
              ) : (
                <>
                  <span>✨</span>
                  Generate Plan
                </>
              )}
            </span>
          </button>
        </div>
      </div>

      {/* Schedule Preferences Panel */}
      {showScheduleInput && (
        <div className="glass-card border border-primary-500/30 rounded-xl p-6 mb-6 animate-scale-in">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span>⚙️</span>
            Schedule Preferences
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Start Time</label>
              <input
                type="time"
                value={schedulePreferences.startTime}
                onChange={(e) => handleSchedulePreferenceChange('startTime', e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-400/50"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">End Time</label>
              <input
                type="time"
                value={schedulePreferences.endTime}
                onChange={(e) => handleSchedulePreferenceChange('endTime', e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-400/50"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Break Duration (minutes)</label>
              <input
                type="number"
                value={schedulePreferences.breakDuration}
                onChange={(e) => handleSchedulePreferenceChange('breakDuration', parseInt(e.target.value))}
                min="15"
                max="120"
                step="15"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-400/50"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Focus Block Duration (minutes)</label>
              <input
                type="number"
                value={schedulePreferences.focusBlocks}
                onChange={(e) => handleSchedulePreferenceChange('focusBlocks', parseInt(e.target.value))}
                min="30"
                max="180"
                step="15"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-400/50"
              />
            </div>
          </div>
          <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <p className="text-sm text-blue-300">
              💡 AI will generate your schedule based on these preferences and task priorities
            </p>
          </div>
        </div>
      )}

      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white">
            {selectedMonth}
          </div>
          {plan && plan.schedule && (
            <>
              <span className="text-2xl font-bold text-white">
                {Object.values(plan.schedule).flat().length}
              </span>
              <span className="text-sm text-gray-400">tasks scheduled</span>
            </>
          )}
        </div>
        {plan && (
          <div className="px-4 py-2 bg-primary-500/20 border border-primary-500/50 rounded-xl text-primary-300 text-sm">
            Plan Active
          </div>
        )}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {calendarDays.map((day, index) => (
          <div
            key={index}
            onClick={() => setSelectedDate(day.date)}
            className={`glass-card p-4 rounded-xl border cursor-pointer transition-all hover-lift ${
              day.isToday
                ? 'border-primary-500 bg-primary-500/10'
                : 'border-white/10 hover:border-white/20'
            }`}
            style={{animationDelay: `${index * 0.1}s`}}
          >
            <div className="text-center">
              <div className={`text-2xl font-bold mb-2 ${day.isToday ? 'text-primary-300' : 'text-white'}`}>
                {day.date}
              </div>
              {day.hasEvent && (
                <div className="flex justify-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary-500"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {!plan && !loading && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4 animate-float">📆</div>
          <p className="text-gray-400 text-lg mb-2">
            No plan generated yet
          </p>
          <p className="text-gray-500 text-sm">
            Click "Generate Plan" to create your smart daily schedule!
          </p>
        </div>
      )}

      {loading && (
        <div className="text-center py-12">
          <div className="inline-block w-16 h-16 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-400">Generating your personalized plan...</p>
        </div>
      )}

      {plan && !loading && (
        <div className="space-y-6 animate-fade-in">
          {/* Plan Generated Success Message */}
          <div className="glass-card border-green-500/30 bg-green-500/10 rounded-xl p-4 animate-scale-in">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-green-300">AI Plan Generated Successfully!</h3>
                <p className="text-sm text-green-200/80">Your optimized schedule is ready</p>
              </div>
            </div>
          </div>

          {/* Plan Summary */}
          {plan.summary && (
            <div className="glass-card border-primary-500/30 rounded-xl p-4 animate-scale-in">
              <h3 className="font-semibold text-primary-300 mb-2 flex items-center gap-2">
                <span>📊</span>
                Plan Summary
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">{plan.summary}</p>
            </div>
          )}

          {/* Time Slots with Calendar View */}
          {plan.schedule && Object.keys(plan.schedule).length > 0 ? (
            <div className="space-y-4">
              {Object.entries(plan.schedule).map(([timeSlot, tasks], slotIndex) => (
                <div 
                  key={timeSlot} 
                  className="glass-card border border-white/10 rounded-xl p-5 hover-lift animate-fade-in"
                  style={{animationDelay: `${slotIndex * 0.1}s`}}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/20 to-purple-500/20 flex items-center justify-center text-2xl">
                        {getTimeSlotIcon(timeSlot)}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {getTimeSlotLabel(timeSlot)}
                        </h3>
                        <p className="text-xs text-gray-400">
                          {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} scheduled
                        </p>
                      </div>
                    </div>
                    <div className="px-3 py-1 bg-primary-500/20 border border-primary-500/50 rounded-lg text-primary-300 text-xs font-medium">
                      {tasks.reduce((sum, t) => sum + (t.estimated_duration || 60), 0)} min
                    </div>
                  </div>

                  {tasks.length === 0 ? (
                    <p className="text-gray-500 text-sm italic">No tasks scheduled</p>
                  ) : (
                    <div className="space-y-3">
                      {tasks.map((task, index) => (
                        <div
                          key={task.id || index}
                          className="group relative glass-card rounded-xl p-4 hover-lift card-hover transition-all duration-300 border border-white/10 hover:border-primary-500/50"
                          style={{
                            background: task.priority === 'high'
                              ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.05) 100%)'
                              : task.priority === 'medium'
                              ? 'linear-gradient(135deg, rgba(234, 179, 8, 0.1) 0%, rgba(202, 138, 4, 0.05) 100%)'
                              : 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(22, 163, 74, 0.05) 100%)'
                          }}
                        >
                          {/* Priority indicator bar */}
                          <div
                            className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl ${
                              task.priority === 'high' ? 'bg-red-500' :
                              task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                          />
                          
                          <div className="flex items-start justify-between gap-4 pl-3">
                            <div className="flex-1">
                              {/* Title and Priority Badge */}
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-semibold text-white text-base group-hover:text-primary-300 transition-colors">
                                  {task.title}
                                </h4>
                                <span
                                  className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${
                                    task.priority === 'high'
                                      ? 'bg-red-500/30 text-red-200 border border-red-500/50'
                                      : task.priority === 'medium'
                                      ? 'bg-yellow-500/30 text-yellow-200 border border-yellow-500/50'
                                      : 'bg-green-500/30 text-green-200 border border-green-500/50'
                                  }`}
                                >
                                  {task.priority === 'high' ? '🔴 High' : task.priority === 'medium' ? '🟡 Medium' : '🟢 Low'}
                                </span>
                              </div>
                              
                              {/* Description */}
                              {task.description && (
                                <p className="text-sm text-gray-300 mb-3 leading-relaxed">{task.description}</p>
                              )}
                              
                              {/* Time Info */}
                              <div className="flex flex-wrap gap-2">
                                <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg border border-white/20">
                                  <svg className="w-4 h-4 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  <span className="text-xs font-medium text-gray-200">{task.estimated_duration || 60} min</span>
                                </div>
                                {task.scheduled_time && (
                                  <div className="flex items-center gap-1.5 bg-primary-500/20 px-3 py-1.5 rounded-lg border border-primary-500/50">
                                    <svg className="w-4 h-4 text-primary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="text-xs font-medium text-primary-200">{formatTime(task.scheduled_time)}</span>
                                  </div>
                                )}
                                {task.deadline && (
                                  <div className="flex items-center gap-1.5 bg-purple-500/20 px-3 py-1.5 rounded-lg border border-purple-500/50">
                                    <svg className="w-4 h-4 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span className="text-xs font-medium text-purple-200">Due: {new Date(task.deadline).toLocaleDateString()}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-5xl mb-4 animate-float">📝</div>
              <p className="text-gray-400">No tasks to schedule. Add some tasks first!</p>
            </div>
          )}

          {/* Recommendations */}
          {plan.recommendations && plan.recommendations.length > 0 && (
            <div className="glass-card border-blue-500/30 rounded-xl p-4 animate-scale-in">
              <h3 className="font-semibold text-blue-300 mb-3 flex items-center gap-2">
                <span>💡</span>
                AI Recommendations
              </h3>
              <ul className="space-y-2">
                {plan.recommendations.map((rec, index) => (
                  <li key={index} className="text-blue-200 text-sm flex items-start gap-2 hover:text-blue-100 transition-colors">
                    <span className="text-blue-400 mt-0.5">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DailyPlan;

// Made with Bob

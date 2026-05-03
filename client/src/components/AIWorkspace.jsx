import React, { useState } from 'react';
import { taskAPI } from '../services/api';

const AIWorkspace = ({ tasks }) => {
  const [selectedCategory, setSelectedCategory] = useState('productivity');
  const [loading, setLoading] = useState(false);
  const [aiInsight, setAiInsight] = useState(null);

  const workspaceFeatures = [
    {
      id: 'productivity',
      title: 'Productivity Dashboard',
      icon: '📊',
      description: 'Real-time analytics on your productivity',
      content: {
        stats: [
          { label: 'Active Tasks', value: tasks.filter(t => !t.completed).length, icon: '⚡' },
          { label: 'Completion Rate', value: tasks.length > 0 ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100) + '%' : '0%', icon: '✅' },
          { label: 'Average Duration', value: tasks.length > 0 ? Math.round(tasks.reduce((sum, t) => sum + (t.duration || 0), 0) / tasks.length) + 'h' : '0h', icon: '⏱️' },
          { label: 'Overdue Count', value: tasks.filter(t => !t.completed && new Date(t.deadline) < new Date()).length, icon: '⚠️' }
        ]
      }
    },
    {
      id: 'collaboration',
      title: 'Team Collaboration',
      icon: '👥',
      description: 'Share tasks and collaborate with team members',
      content: {
        members: [
          { name: 'You', role: 'Project Lead', status: 'active' },
          { name: 'Team Member', role: 'Contributor', status: 'available' }
        ]
      }
    },
    {
      id: 'analytics',
      title: 'Advanced Analytics',
      icon: '📈',
      description: 'Deep insights into your work patterns',
      content: {
        metrics: [
          { name: 'Peak Hours', value: '10 AM - 2 PM', desc: 'Most productive time' },
          { name: 'Avg Task Duration', value: tasks.length > 0 ? Math.round(tasks.reduce((sum, t) => sum + (t.duration || 0), 0) / tasks.length) + 'h' : '0h', desc: 'Average time per task' },
          { name: 'Weekly Target', value: '40h', desc: 'Hours planned this week' }
        ]
      }
    },
    {
      id: 'automation',
      title: 'Task Automation',
      icon: '⚙️',
      description: 'Automate repetitive tasks and workflows',
      content: {
        automations: [
          { name: 'Auto-schedule Tasks', status: 'enabled', desc: 'Automatically schedule tasks based on deadlines' },
          { name: 'Smart Reminders', status: 'enabled', desc: 'Get reminders before deadlines' },
          { name: 'Auto-categorize', status: 'enabled', desc: 'Automatically categorize new tasks' }
        ]
      }
    }
  ];

  const currentFeature = workspaceFeatures.find(f => f.id === selectedCategory);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="glass-card rounded-2xl p-8 border border-white/10 bg-gradient-to-r from-primary-600/20 to-purple-600/20">
        <h2 className="text-3xl font-bold text-white mb-2">AI Workspace</h2>
        <p className="text-gray-400">Collaborate, analyze, and automate with AI-powered tools</p>
      </div>

      {/* Feature Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {workspaceFeatures.map(feature => (
          <button
            key={feature.id}
            onClick={() => setSelectedCategory(feature.id)}
            className={`glass-card rounded-2xl p-6 border transition-all transform hover:scale-105 ${
              selectedCategory === feature.id
                ? 'border-primary-400/50 bg-primary-400/10 ring-2 ring-primary-400/20'
                : 'border-white/10 hover:border-white/20'
            }`}
          >
            <div className="text-4xl mb-3">{feature.icon}</div>
            <h3 className="font-bold text-white text-sm">{feature.title}</h3>
            <p className="text-xs text-gray-400 mt-2">{feature.description}</p>
          </button>
        ))}
      </div>

      {/* Feature Content */}
      {currentFeature && (
        <div className="glass-card rounded-2xl p-8 border border-white/10 space-y-6">
          <div>
            <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
              <span className="text-4xl">{currentFeature.icon}</span>
              {currentFeature.title}
            </h3>
            <p className="text-gray-400">{currentFeature.description}</p>
          </div>

          {/* Productivity Dashboard */}
          {selectedCategory === 'productivity' && currentFeature.content.stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {currentFeature.content.stats.map((stat, idx) => (
                <div key={idx} className="p-4 bg-white/5 rounded-lg border border-white/10 text-center hover-lift">
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <p className="text-2xl font-bold text-primary-400">{stat.value}</p>
                  <p className="text-xs text-gray-400 mt-2">{stat.label}</p>
                </div>
              ))}
            </div>
          )}

          {/* Team Collaboration */}
          {selectedCategory === 'collaboration' && currentFeature.content.members && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-lg font-semibold text-white">Active Members</h4>
                <button className="btn-primary px-4 py-2 text-sm rounded-lg">Invite Member</button>
              </div>
              {currentFeature.content.members.map((member, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center">
                      <span className="text-lg">👤</span>
                    </div>
                    <div>
                      <p className="text-white font-semibold">{member.name}</p>
                      <p className="text-xs text-gray-400">{member.role}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    member.status === 'active' 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {member.status}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Advanced Analytics */}
          {selectedCategory === 'analytics' && currentFeature.content.metrics && (
            <div className="space-y-4">
              {currentFeature.content.metrics.map((metric, idx) => (
                <div key={idx} className="p-4 bg-gradient-to-r from-primary-500/10 to-purple-500/10 rounded-lg border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="text-white font-semibold">{metric.name}</h5>
                    <p className="text-2xl font-bold text-primary-400">{metric.value}</p>
                  </div>
                  <p className="text-sm text-gray-400">{metric.desc}</p>
                </div>
              ))}
            </div>
          )}

          {/* Task Automation */}
          {selectedCategory === 'automation' && currentFeature.content.automations && (
            <div className="space-y-4">
              {currentFeature.content.automations.map((automation, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                  <div>
                    <p className="text-white font-semibold">{automation.name}</p>
                    <p className="text-sm text-gray-400 mt-1">{automation.desc}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-6 bg-green-500/20 rounded-full flex items-center justify-end pr-1 border border-green-500/50">
                      <div className="w-5 h-5 bg-green-500 rounded-full shadow-lg shadow-green-500/50"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Action Button */}
          <div className="pt-6 border-t border-white/10">
            <button
              onClick={async () => {
                setLoading(true);
                try {
                  const message = `Give me insights about ${currentFeature.title.toLowerCase()} based on my current tasks`;
                  const response = await taskAPI.sendChatMessage(message, tasks);
                  setAiInsight(response.data.response);
                } catch (error) {
                  console.error('AI insight error:', error);
                  setAiInsight('Unable to get AI insights at the moment. Please try again.');
                } finally {
                  setLoading(false);
                }
              }}
              disabled={loading}
              className="w-full btn-primary py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Getting AI Insights...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  Get AI Insights for {currentFeature.title}
                </>
              )}
            </button>
          </div>

          {/* AI Insight Display */}
          {aiInsight && (
            <div className="mt-4 glass-card border-primary-500/30 bg-primary-500/10 rounded-xl p-4 animate-scale-in">
              <h4 className="font-semibold text-primary-300 mb-2 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                AI Insight
              </h4>
              <p className="text-primary-200 text-sm leading-relaxed whitespace-pre-wrap">{aiInsight}</p>
              <button
                onClick={() => setAiInsight(null)}
                className="mt-3 text-xs text-primary-300 hover:text-primary-200 transition-colors"
              >
                ✕ Close
              </button>
            </div>
          )}
        </div>
      )}

      {/* Quick Tips */}
      <div className="glass-card rounded-2xl p-6 border border-white/10">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <svg className="w-6 h-6 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Quick Tips
        </h3>
        <div className="space-y-2 text-sm text-gray-400">
          <p>💡 Use the productivity dashboard to track your daily progress</p>
          <p>👥 Invite team members to collaborate on shared tasks</p>
          <p>📊 Check analytics regularly to identify productivity patterns</p>
          <p>⚙️ Enable automations to save time on routine tasks</p>
        </div>
      </div>
    </div>
  );
};

export default AIWorkspace;

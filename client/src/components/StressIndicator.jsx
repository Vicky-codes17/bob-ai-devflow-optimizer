import React from 'react';

const StressIndicator = ({ stressData }) => {
  const getStressColor = (level) => {
    switch (level) {
      case 'low':
        return {
          gradient: 'from-green-500 to-emerald-600',
          glow: 'shadow-[0_0_30px_rgba(34,197,94,0.5)]',
          text: 'text-green-300',
          icon: '😊',
          label: 'Low Stress',
          color: '#22c55e',
        };
      case 'medium':
        return {
          gradient: 'from-yellow-500 to-orange-500',
          glow: 'shadow-[0_0_30px_rgba(234,179,8,0.5)]',
          text: 'text-yellow-300',
          icon: '😐',
          label: 'Medium Stress',
          color: '#eab308',
        };
      case 'high':
        return {
          gradient: 'from-orange-500 to-red-500',
          glow: 'shadow-[0_0_30px_rgba(249,115,22,0.5)]',
          text: 'text-orange-300',
          icon: '😰',
          label: 'High Stress',
          color: '#f97316',
        };
      case 'critical':
        return {
          gradient: 'from-red-500 to-pink-600',
          glow: 'shadow-[0_0_30px_rgba(239,68,68,0.5)]',
          text: 'text-red-300',
          icon: '😱',
          label: 'Critical Stress',
          color: '#ef4444',
        };
      default:
        return {
          gradient: 'from-gray-500 to-gray-600',
          glow: 'shadow-[0_0_30px_rgba(107,114,128,0.5)]',
          text: 'text-gray-300',
          icon: '📊',
          label: 'Unknown',
          color: '#6b7280',
        };
    }
  };

  if (!stressData) {
    return (
      <div className="glass-card rounded-2xl p-6 border border-white/10 animate-fade-in">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
          <span className="text-3xl">📊</span>
          Stress Level
        </h2>
        <div className="text-center py-8">
          <div className="text-6xl mb-4 animate-float">🧘</div>
          <p className="text-gray-400">No stress data available</p>
          <p className="text-gray-500 text-sm mt-2">Add tasks to see analysis</p>
        </div>
      </div>
    );
  }

  const stressInfo = getStressColor(stressData.level);
  const percentage = Math.min(100, Math.max(0, stressData.score || 0));
  const circumference = 2 * Math.PI * 70;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="space-y-6">
      {/* Main Stress Indicator Card */}
      <div className="glass-card rounded-2xl p-6 border border-white/10 hover-lift animate-fade-in">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <span className="text-3xl">📊</span>
          Stress Analysis
        </h2>

        {/* Circular Progress Indicator */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative w-48 h-48 mb-4">
            <svg className="transform -rotate-90 w-48 h-48">
              {/* Background circle */}
              <circle
                cx="96"
                cy="96"
                r="70"
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth="12"
                fill="none"
              />
              {/* Progress circle */}
              <circle
                cx="96"
                cy="96"
                r="70"
                stroke="url(#gradient)"
                strokeWidth="12"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
                style={{
                  filter: 'drop-shadow(0 0 10px currentColor)',
                }}
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={stressInfo.color} stopOpacity="1" />
                  <stop offset="100%" stopColor={stressInfo.color} stopOpacity="0.6" />
                </linearGradient>
              </defs>
            </svg>
            
            {/* Center content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-5xl mb-2 animate-pulse-slow">{stressInfo.icon}</div>
              <div className={`text-4xl font-bold ${stressInfo.text}`}>
                {percentage.toFixed(0)}%
              </div>
              <div className="text-sm text-gray-400 mt-1">{stressInfo.label}</div>
            </div>
          </div>

          {/* Status message */}
          <div className={`glass-card px-6 py-3 rounded-xl border ${stressInfo.text} border-current/30`}>
            <p className="text-sm font-medium">Current workload status</p>
          </div>
        </div>

        {/* Stress Factors */}
        {stressData.factors && Object.keys(stressData.factors).length > 0 && (
          <div className="mb-6">
            <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
              <span>⚡</span>
              Stress Factors
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(stressData.factors).map(([factor, value], index) => (
                <div 
                  key={factor} 
                  className="glass-card p-3 rounded-xl border border-white/10 hover-lift animate-fade-in"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400 capitalize">
                      {factor.replace(/_/g, ' ')}
                    </span>
                    <span className="font-semibold text-white">
                      {typeof value === 'number' ? value.toFixed(1) : value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {stressData.recommendations && stressData.recommendations.length > 0 && (
          <div className="glass-card border border-blue-500/30 rounded-xl p-4 animate-fade-in">
            <h4 className="font-semibold text-blue-300 mb-3 flex items-center gap-2">
              <span>💡</span>
              AI Recommendations
            </h4>
            <ul className="space-y-2">
              {stressData.recommendations.map((rec, index) => (
                <li key={index} className="text-blue-200 text-sm flex items-start gap-2 hover:text-blue-100 transition-colors">
                  <span className="text-blue-400 mt-0.5">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Task Statistics Cards */}
      {stressData.taskStats && (
        <div className="grid grid-cols-3 gap-3 animate-fade-in" style={{animationDelay: '0.2s'}}>
          <div className="glass-card p-4 rounded-xl border border-white/10 text-center hover-lift card-hover">
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-1">
              {stressData.taskStats.total || 0}
            </div>
            <div className="text-xs text-gray-400">Total Tasks</div>
          </div>
          <div className="glass-card p-4 rounded-xl border border-white/10 text-center hover-lift card-hover">
            <div className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-1">
              {stressData.taskStats.completed || 0}
            </div>
            <div className="text-xs text-gray-400">Completed</div>
          </div>
          <div className="glass-card p-4 rounded-xl border border-white/10 text-center hover-lift card-hover">
            <div className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent mb-1">
              {stressData.taskStats.pending || 0}
            </div>
            <div className="text-xs text-gray-400">Pending</div>
          </div>
        </div>
      )}

    </div>
  );
};

export default StressIndicator;

// Made with Bob

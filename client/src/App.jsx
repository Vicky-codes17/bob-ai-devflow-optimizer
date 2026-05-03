import React, { useState, useEffect } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import DailyPlan from './components/DailyPlan';
import StressIndicator from './components/StressIndicator';
import TaskMatrix from './components/TaskMatrix';
import TaskInvestments from './components/TaskInvestments';
import SmartTasks from './components/SmartTasks';
import AIWorkspace from './components/AIWorkspace';
import AIChat from './components/AIChat';
import { taskAPI } from './services/api';

function App() {
  const [tasks, setTasks] = useState([]);
  const [dailyPlan, setDailyPlan] = useState(null);
  const [stressData, setStressData] = useState(null);
  const [loading, setLoading] = useState({
    tasks: false,
    plan: false,
    stress: false,
  });
  const [error, setError] = useState('');
  const [activeView, setActiveView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [dbConnected, setDbConnected] = useState(false);
  const [aiConnected, setAiConnected] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, taskId: null, taskTitle: '' });

  // Check connections on mount
  useEffect(() => {
    checkConnections();
    fetchTasks();
    fetchStressAnalysis();
  }, []);

  const checkConnections = async () => {
    // Check database connection
    try {
      await taskAPI.getAllTasks();
      setDbConnected(true);
      addNotification('Database connected successfully', 'success');
    } catch (err) {
      setDbConnected(false);
      addNotification('Database not connected - Please check your configuration', 'warning');
    }

    // Check AI connection (simulated)
    setTimeout(() => {
      setAiConnected(true);
      addNotification('AI service ready', 'success');
    }, 1000);
  };

  const addNotification = (message, type = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  const fetchTasks = async () => {
    setLoading((prev) => ({ ...prev, tasks: true }));
    setError('');
    try {
      const data = await taskAPI.getAllTasks();
      setTasks(data.data || data.tasks || []);
      setDbConnected(true);
    } catch (err) {
      setTasks([]);
      setDbConnected(false);
      addNotification('Failed to fetch tasks - Please check database connection', 'error');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading((prev) => ({ ...prev, tasks: false }));
    }
  };

  const fetchStressAnalysis = async () => {
    setLoading((prev) => ({ ...prev, stress: true }));
    try {
      const data = await taskAPI.getStressAnalysis();
      setStressData(data.data || data);
    } catch (err) {
      setStressData(null);
      console.error('Error fetching stress analysis:', err);
    } finally {
      setLoading((prev) => ({ ...prev, stress: false }));
    }
  };

  const handleTaskAdded = async (taskData) => {
    try {
      if (dbConnected) {
        await taskAPI.createTask(taskData);
        await fetchTasks();
        await fetchStressAnalysis();
      } else {
        const newTask = {
          ...taskData,
          id: Date.now(),
          status: 'pending'
        };
        setTasks(prev => [...prev, newTask]);
      }
      addNotification('Task added successfully! AI is analyzing...', 'success');
    } catch (err) {
      addNotification('Failed to add task', 'error');
      throw err;
    }
  };

  const handleStatusChange = async (taskId, status) => {
    try {
      if (dbConnected) {
        // Convert status to completed field for database
        const updates = { completed: status === 'completed' };
        await taskAPI.updateTask(taskId, updates);
        await fetchTasks();
        await fetchStressAnalysis();
      } else {
        setTasks(prev => prev.map(t => t.id === taskId ? {...t, status} : t));
      }
      addNotification(`Task status updated to ${status}`, 'success');
    } catch (err) {
      setError('Failed to update task status');
      addNotification('Failed to update task status', 'error');
      console.error('Error updating task status:', err);
    }
  };

  const handleDeleteTask = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    setDeleteModal({
      isOpen: true,
      taskId: taskId,
      taskTitle: task?.title || 'this task'
    });
  };

  const confirmDelete = async () => {
    const taskId = deleteModal.taskId;
    setDeleteModal({ isOpen: false, taskId: null, taskTitle: '' });

    try {
      if (dbConnected) {
        await taskAPI.deleteTask(taskId);
        await fetchTasks();
        await fetchStressAnalysis();
      } else {
        setTasks(prev => prev.filter(t => t.id !== taskId));
      }
      if (dailyPlan) {
        setDailyPlan(null);
      }
      addNotification('Task deleted successfully', 'success');
    } catch (err) {
      setError('Failed to delete task');
      addNotification('Failed to delete task', 'error');
      console.error('Error deleting task:', err);
    }
  };

  const cancelDelete = () => {
    setDeleteModal({ isOpen: false, taskId: null, taskTitle: '' });
  };

  const handleGeneratePlan = async () => {
    if (tasks.length === 0) {
      addNotification('Please add tasks before generating a plan', 'warning');
      return;
    }
    
    setLoading((prev) => ({ ...prev, plan: true }));
    setError('');
    addNotification('AI is generating your optimal plan...', 'info');
    try {
      const data = await taskAPI.generatePlan();
      setDailyPlan(data);
      await fetchTasks();
      addNotification('AI plan generated successfully!', 'success');
    } catch (err) {
      setError('Failed to generate plan');
      addNotification('Failed to generate AI plan', 'error');
      console.error('Error generating plan:', err);
    } finally {
      setLoading((prev) => ({ ...prev, plan: false }));
    }
  };

  const handleSimulateDelay = async (taskId) => {
    try {
      if (dbConnected) {
        await taskAPI.simulateDelay(taskId);
        await fetchTasks();
        await fetchStressAnalysis();
      } else {
        setTasks(prev => prev.map(t => t.id === taskId ? {...t, status: 'delayed'} : t));
      }
      if (dailyPlan) {
        await handleGeneratePlan();
      }
      addNotification('Delay simulated - AI recalculating...', 'warning');
    } catch (err) {
      setError('Failed to simulate delay');
      addNotification('Failed to simulate delay', 'error');
      console.error('Error simulating delay:', err);
    }
  };

  const menuItems = [
    { id: 'dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', label: 'Dashboard' },
    { id: 'tasks', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', label: 'Time Analytics' },
    { id: 'smart-tasks', icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z', label: 'AI Insights' },
    { id: 'workspace', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', label: 'Workspace' },
    { id: 'matrix', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4', label: 'Priority Matrix' },
    { id: 'chat', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z', label: 'AI Chat' },
  ];

  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <>
            {/* Dashboard Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="glass-card p-6 rounded-2xl hover-lift card-hover animate-fade-in">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Task Completed</p>
                    <p className="text-3xl font-bold">{completionRate}%</p>
                  </div>
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                    <svg className="w-8 h-8" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="16" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="3"/>
                      <circle cx="18" cy="18" r="16" fill="none" stroke="white" strokeWidth="3"
                        strokeDasharray={`${completionRate} 100`} strokeLinecap="round" transform="rotate(-90 18 18)"/>
                    </svg>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-400">{completedTasks} of {totalTasks} tasks</span>
                </div>
              </div>

              <div className="glass-card p-6 rounded-2xl hover-lift card-hover animate-fade-in" style={{animationDelay: '0.1s'}}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Pending Task</p>
                    <p className="text-3xl font-bold">{tasks.filter(t => t.status === 'pending').length} Task</p>
                  </div>
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-400">Needs attention</span>
                </div>
              </div>

              <div className="glass-card p-6 rounded-2xl hover-lift card-hover animate-fade-in" style={{animationDelay: '0.2s'}}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">In Progress</p>
                    <p className="text-3xl font-bold">{tasks.filter(t => t.status === 'in_progress').length} Task</p>
                  </div>
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-400">Currently active</span>
                </div>
              </div>

              <div className="glass-card p-6 rounded-2xl hover-lift card-hover animate-fade-in" style={{animationDelay: '0.3s'}}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Stress Level</p>
                    <p className="text-3xl font-bold">{stressData ? `${Math.round(stressData.score)}%` : 'N/A'}</p>
                  </div>
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-400">{stressData ? stressData.level : 'No data'}</span>
                </div>
              </div>
            </div>

            <div className="mb-8 animate-fade-in" style={{animationDelay: '0.4s'}}>
              <TaskForm onTaskAdded={handleTaskAdded} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 animate-slide-in-left">
                {loading.tasks ? (
                  <div className="glass-card p-12 rounded-2xl text-center">
                    <div className="inline-block w-16 h-16 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-400">Loading tasks...</p>
                  </div>
                ) : (
                  <TaskList
                    tasks={tasks}
                    onStatusChange={handleStatusChange}
                    onDelete={handleDeleteTask}
                    onSimulateDelay={handleSimulateDelay}
                  />
                )}
              </div>

              <div className="lg:col-span-1 animate-slide-in-right">
                <div className="lg:sticky lg:top-24">
                  <StressIndicator stressData={stressData} />
                </div>
              </div>
            </div>

            <div className="mt-8 animate-fade-in" style={{animationDelay: '0.6s'}}>
              <DailyPlan
                plan={dailyPlan}
                onGeneratePlan={handleGeneratePlan}
                loading={loading.plan}
              />
            </div>
          </>
        );
      
      case 'chat':
        return <AIChat tasks={tasks} />;
      
      case 'matrix':
        return <TaskMatrix tasks={tasks} />;
      
      case 'workspace':
        return <AIWorkspace tasks={tasks} />;
      
      case 'smart-tasks':
        return <SmartTasks tasks={tasks} stressData={stressData} />;
      
      case 'tasks':
        return <TaskInvestments tasks={tasks} />;
      
      case 'settings':
        return (
          <div className="glass-card rounded-2xl p-8 border border-white/10 animate-fade-in">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <svg className="w-8 h-8 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Settings
            </h2>
            <div className="space-y-6">
              <div className="glass-card p-6 rounded-xl border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4">Connection Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Database</span>
                    <span className={`px-3 py-1 rounded-lg text-sm font-medium ${dbConnected ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                      {dbConnected ? '✓ Connected' : '✗ Disconnected'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">AI Service</span>
                    <span className={`px-3 py-1 rounded-lg text-sm font-medium ${aiConnected ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                      {aiConnected ? '✓ Connected' : '✗ Disconnected'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="glass-card p-6 rounded-xl border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4">Appearance</h3>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Dark Mode</span>
                  <button
                    onClick={() => setDarkMode(!darkMode)}
                    className={`relative w-14 h-7 rounded-full transition-colors ${darkMode ? 'bg-primary-600' : 'bg-gray-600'}`}
                  >
                    <span className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${darkMode ? 'translate-x-7' : 'translate-x-0'}`}></span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'help':
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="glass-card rounded-2xl p-8 border border-white/10">
              <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                <svg className="w-8 h-8 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Help & Documentation
              </h2>
              <p className="text-gray-400">Complete guide to using CLYNO AI DevFlow Optimizer</p>
            </div>

            {/* Quick Start Guide */}
            <div className="glass-card rounded-2xl p-6 border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">🚀</span>
                Quick Start Guide
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <h4 className="font-semibold text-white mb-2">1. Add Your Tasks</h4>
                  <p className="text-sm text-gray-300">Use the "Create New Task" form on the Dashboard to add tasks with title, description, priority, duration, and deadline.</p>
                </div>
                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <h4 className="font-semibold text-white mb-2">2. Generate AI Plan</h4>
                  <p className="text-sm text-gray-300">Click "Generate Plan" to let AI create an optimized daily schedule divided into Morning, Afternoon, and Evening slots.</p>
                </div>
                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <h4 className="font-semibold text-white mb-2">3. Monitor Stress Levels</h4>
                  <p className="text-sm text-gray-300">Track your workload stress in real-time. The AI analyzes task urgency and volume to calculate stress scores.</p>
                </div>
                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <h4 className="font-semibold text-white mb-2">4. Use AI Features</h4>
                  <p className="text-sm text-gray-300">Explore AI Chat for task advice, Priority Matrix for task categorization, and AI Insights for productivity recommendations.</p>
                </div>
              </div>
            </div>

            {/* Features Overview */}
            <div className="glass-card rounded-2xl p-6 border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">✨</span>
                Features Overview
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gradient-to-br from-primary-500/10 to-purple-500/10 rounded-lg border border-primary-500/30">
                  <h4 className="font-semibold text-white mb-2">📊 Dashboard</h4>
                  <p className="text-sm text-gray-300">Central hub showing task completion rates, pending tasks, stress levels, and quick actions.</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-lg border border-blue-500/30">
                  <h4 className="font-semibold text-white mb-2">⏰ Time Analytics</h4>
                  <p className="text-sm text-gray-300">Analyze time investments across tasks, track completion efficiency, and identify high-investment tasks.</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-lg border border-green-500/30">
                  <h4 className="font-semibold text-white mb-2">💡 AI Insights</h4>
                  <p className="text-sm text-gray-300">Get intelligent recommendations, workload alerts, and actionable productivity tips powered by AI.</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-lg border border-yellow-500/30">
                  <h4 className="font-semibold text-white mb-2">🎯 Priority Matrix</h4>
                  <p className="text-sm text-gray-300">Eisenhower Matrix categorization: Do First, Schedule, Delegate, or Eliminate tasks based on urgency and importance.</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/30">
                  <h4 className="font-semibold text-white mb-2">💬 AI Chat</h4>
                  <p className="text-sm text-gray-300">Interactive AI assistant for task queries, productivity advice, and personalized recommendations.</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-indigo-500/10 to-blue-500/10 rounded-lg border border-indigo-500/30">
                  <h4 className="font-semibold text-white mb-2">💼 Workspace</h4>
                  <p className="text-sm text-gray-300">Advanced analytics, team collaboration tools, and task automation features.</p>
                </div>
              </div>
            </div>

            {/* Setup Instructions */}
            <div className="glass-card rounded-2xl p-6 border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">⚙️</span>
                Setup & Configuration
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <h4 className="font-semibold text-white mb-3">Database Setup (PostgreSQL)</h4>
                  <div className="space-y-2 text-sm text-gray-300">
                    <p>1. Install PostgreSQL on your system</p>
                    <p>2. Create a database: <code className="bg-white/10 px-2 py-1 rounded">createdb clyno_db</code></p>
                    <p>3. Configure <code className="bg-white/10 px-2 py-1 rounded">server/.env</code>:</p>
                    <pre className="bg-black/30 p-3 rounded mt-2 overflow-x-auto">
{`DB_HOST=localhost
DB_PORT=5432
DB_NAME=clyno_db
DB_USER=your_username
DB_PASSWORD=your_password`}
                    </pre>
                    <p>4. Run migrations: <code className="bg-white/10 px-2 py-1 rounded">cd server && npm run migrate</code></p>
                  </div>
                </div>
                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <h4 className="font-semibold text-white mb-3">IBM watsonx.ai Setup</h4>
                  <div className="space-y-2 text-sm text-gray-300">
                    <p>1. Create an IBM Cloud account at <a href="https://cloud.ibm.com" className="text-primary-400 hover:underline" target="_blank" rel="noopener noreferrer">cloud.ibm.com</a></p>
                    <p>2. Create a watsonx.ai project and get your API key</p>
                    <p>3. Add to <code className="bg-white/10 px-2 py-1 rounded">server/.env</code>:</p>
                    <pre className="bg-black/30 p-3 rounded mt-2 overflow-x-auto">
{`USE_AI=true
WATSONX_API_KEY=your_api_key_here
WATSONX_URL=https://us-south.ml.cloud.ibm.com
WATSONX_PROJECT_ID=your_project_id`}
                    </pre>
                    <p>4. Restart the server to apply changes</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Troubleshooting */}
            <div className="glass-card rounded-2xl p-6 border border-yellow-500/30">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">🔧</span>
                Troubleshooting
              </h3>
              <div className="space-y-3">
                <div className="p-3 bg-white/5 rounded-lg">
                  <h4 className="font-semibold text-white mb-1">Tasks not saving?</h4>
                  <p className="text-sm text-gray-300">Check database connection in Settings. Ensure PostgreSQL is running and credentials are correct.</p>
                </div>
                <div className="p-3 bg-white/5 rounded-lg">
                  <h4 className="font-semibold text-white mb-1">AI features not working?</h4>
                  <p className="text-sm text-gray-300">Verify watsonx.ai API key in server/.env. The system will use fallback responses if AI is unavailable.</p>
                </div>
                <div className="p-3 bg-white/5 rounded-lg">
                  <h4 className="font-semibold text-white mb-1">Plan generation fails?</h4>
                  <p className="text-sm text-gray-300">Ensure you have at least one task added. Check server logs for detailed error messages.</p>
                </div>
                <div className="p-3 bg-white/5 rounded-lg">
                  <h4 className="font-semibold text-white mb-1">Connection errors?</h4>
                  <p className="text-sm text-gray-300">Verify both frontend (port 3000) and backend (port 5000) servers are running.</p>
                </div>
              </div>
            </div>

            {/* Support */}
            <div className="glass-card rounded-2xl p-6 border border-primary-500/30 bg-gradient-to-br from-primary-500/10 to-purple-500/10">
              <h3 className="text-2xl font-bold text-white mb-3 flex items-center gap-2">
                <span className="text-2xl">💬</span>
                Need More Help?
              </h3>
              <p className="text-gray-300 mb-4">For additional support, check our documentation or reach out to the development team.</p>
              <div className="flex gap-3">
                <button className="btn-primary px-6 py-3 rounded-xl text-white font-medium hover:opacity-90 transition-opacity">
                  📚 View Full Documentation
                </button>
                <button className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white font-medium transition-all">
                  💡 Report Issue
                </button>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gradient-to-br from-background-primary via-background-secondary to-background-tertiary text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={cancelDelete}
          ></div>
          
          {/* Modal */}
          <div className="relative glass-card rounded-2xl p-8 max-w-md w-full border border-red-500/30 animate-scale-in shadow-2xl">
            <div className="text-center">
              {/* Icon */}
              <div className="mx-auto w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              
              {/* Title */}
              <h3 className="text-2xl font-bold text-white mb-2">Delete Task?</h3>
              
              {/* Message */}
              <p className="text-gray-300 mb-2">
                Are you sure you want to delete
              </p>
              <p className="text-white font-semibold mb-6 px-4 py-2 bg-white/5 rounded-lg">
                "{deleteModal.taskTitle}"
              </p>
              <p className="text-gray-400 text-sm mb-6">
                This action cannot be undone.
              </p>
              
              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={cancelDelete}
                  className="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-medium transition-all hover-lift"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-xl text-white font-medium transition-all hover-lift shadow-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map(notif => (
          <div
            key={notif.id}
            className={`glass-card px-6 py-4 rounded-xl border animate-slide-in-right shadow-lg ${
              notif.type === 'success' ? 'border-green-500/50 bg-green-500/10' :
              notif.type === 'error' ? 'border-red-500/50 bg-red-500/10' :
              notif.type === 'warning' ? 'border-orange-500/50 bg-orange-500/10' :
              'border-blue-500/50 bg-blue-500/10'
            }`}
          >
            <div className="flex items-center gap-3">
              <svg className={`w-5 h-5 ${
                notif.type === 'success' ? 'text-green-400' :
                notif.type === 'error' ? 'text-red-400' :
                notif.type === 'warning' ? 'text-orange-400' :
                'text-blue-400'
              }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {notif.type === 'success' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />}
                {notif.type === 'error' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />}
                {notif.type === 'warning' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />}
                {notif.type === 'info' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />}
              </svg>
              <span className="text-sm font-medium">{notif.message}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-full ${darkMode ? 'bg-dark-900/50' : 'bg-white'} backdrop-blur-xl border-r ${darkMode ? 'border-white/10' : 'border-gray-200'} transition-all duration-300 z-50 ${sidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 flex items-center gap-3 border-b border-white/10">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            {sidebarOpen && (
              <span className="text-2xl font-bold gradient-text animate-fade-in tracking-wider">CLYNO</span>
            )}
          </div>

          {/* Welcome Message */}
          {sidebarOpen && (
            <div className="px-6 py-4 border-b border-white/10 animate-fade-in">
              <p className="text-sm text-gray-400">Welcome Back,</p>
              <p className="text-lg font-semibold">Developer!</p>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
            {menuItems.map((item, index) => (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 hover-lift ${
                  activeView === item.id
                    ? 'bg-gradient-to-r from-primary-600 to-secondary-600 shadow-glow'
                    : 'hover:bg-white/5'
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                </svg>
                {sidebarOpen && (
                  <span className="text-sm font-medium truncate">{item.label}</span>
                )}
              </button>
            ))}
          </nav>

          {/* Settings & Help */}
          <div className="p-3 border-t border-white/10 space-y-2">
            <button
              onClick={() => setActiveView('settings')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {sidebarOpen && <span className="text-sm">Settings</span>}
            </button>
            <button
              onClick={() => setActiveView('help')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {sidebarOpen && <span className="text-sm">Help Center</span>}
            </button>
          </div>

          {/* Toggle Button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="absolute -right-3 top-20 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center hover:bg-primary-700 transition-all shadow-lg"
          >
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sidebarOpen ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
            </svg>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Header */}
        <header className={`sticky top-0 z-40 ${darkMode ? 'bg-dark-900/30' : 'bg-white/80'} backdrop-blur-xl border-b ${darkMode ? 'border-white/10' : 'border-gray-200'}`}>
          <div className="px-8 py-4 flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-1">
                {activeView === 'dashboard' ? 'Dashboard Overview' :
                 activeView === 'chat' ? 'AI Chat Assistant' :
                 activeView === 'matrix' ? 'Priority Matrix' :
                 activeView === 'workspace' ? 'Workspace' :
                 activeView === 'smart-tasks' ? 'AI Insights' :
                 activeView === 'tasks' ? 'Time Analytics' :
                 activeView === 'settings' ? 'Settings' :
                 activeView === 'help' ? 'Help Center' : 'CLYNO'}
              </h1>
              <p className="text-sm text-gray-400">
                AI-powered workflow optimization and stress analysis
              </p>
            </div>
            
            {/* Search Bar */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className={`w-64 px-4 py-2 pl-10 ${darkMode ? 'bg-white/5 border-white/10' : 'bg-gray-100 border-gray-300'} border rounded-xl focus:outline-none focus:border-primary-500 transition-all`}
                />
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              
              {/* Notification Icon */}
              <button className="relative p-2 hover:bg-white/5 rounded-xl transition-all">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {notifications.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                )}
              </button>
              
              {/* Theme Toggle */}
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 hover:bg-white/5 rounded-xl transition-all"
              >
                {darkMode ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-8">
          {/* Error Message */}
          {error && (
            <div className="mb-6 glass-card border-red-500/50 p-4 rounded-xl animate-scale-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-red-300">{error}</span>
                </div>
                <button
                  onClick={() => setError('')}
                  className="text-red-300 hover:text-red-100 transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {renderContent()}
        </div>
      </main>

      {/* Footer */}
      <footer className={`${darkMode ? 'bg-dark-900/30' : 'bg-white/80'} backdrop-blur-xl border-t ${darkMode ? 'border-white/10' : 'border-gray-200'} transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <div className="px-8 py-6 text-center">
          <p className="text-gray-400 text-sm">
            CLYNO - Powered by IBM watsonx.ai | Built with ❤️ for IBM Hackathon 2026
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;

// Made with Bob

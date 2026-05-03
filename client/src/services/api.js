import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Task API endpoints
export const taskAPI = {
  // Get all tasks
  getAllTasks: async () => {
    const response = await api.get('/tasks');
    return response.data;
  },

  // Create a new task
  createTask: async (taskData) => {
    const response = await api.post('/tasks', taskData);
    return response.data;
  },

  // Update task
  updateTask: async (taskId, updates) => {
    const response = await api.put(`/tasks/${taskId}`, updates);
    return response.data;
  },

  // Delete a task
  deleteTask: async (taskId) => {
    const response = await api.delete(`/tasks/${taskId}`);
    return response.data;
  },

  // Generate daily plan
  generatePlan: async () => {
    const response = await api.post('/tasks/generate-plan');
    return response.data;
  },

  // Simulate delay for a task
  simulateDelay: async (taskId, delayDays = 1) => {
    const response = await api.post('/tasks/simulate-delay', { taskId, delayDays });
    return response.data;
  },

  // Get stress analysis
  getStressAnalysis: async () => {
    const response = await api.get('/tasks/stress-level');
    return response.data;
  },

  // Get task stats
  getTaskStats: async () => {
    const response = await api.get('/tasks/stats');
    return response.data;
  },

  // AI Chat
  sendChatMessage: async (message, tasks) => {
    const response = await api.post('/tasks/ai-chat', { message, tasks });
    return response.data;
  }
};

export default api;

// Made with Bob

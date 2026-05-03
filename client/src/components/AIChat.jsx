import React, { useState, useRef, useEffect } from 'react';

const AIChat = ({ tasks }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: "👋 Hi! I'm your AI task assistant. I can help you with task management, planning, and productivity tips. What would you like to know?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickReplies = [
    { text: 'How many tasks do I have?', icon: '📊' },
    { text: 'Generate a daily plan', icon: '📅' },
    { text: 'Show high priority tasks', icon: '🔴' },
    { text: 'Give productivity tips', icon: '💡' }
  ];

  const generateAIResponse = (userMessage) => {
    const message = userMessage.toLowerCase();

    // Greetings
    if (message.match(/^(hi|hello|hey|greetings|good morning|good afternoon|good evening)$/i)) {
      const greetings = [
        "👋 Hello! I'm your AI task assistant. How can I help you manage your tasks today?",
        "Hi there! 😊 Ready to boost your productivity? What would you like to know about your tasks?",
        "Hey! 🌟 I'm here to help you stay organized. What can I do for you?",
        "Hello! 👋 Let's make your day more productive. How can I assist you?"
      ];
      return greetings[Math.floor(Math.random() * greetings.length)];
    }

    // Thank you
    if (message.includes('thank') || message.includes('thanks')) {
      return "You're welcome! 😊 I'm always here to help you stay productive. Feel free to ask me anything!";
    }

    // How are you
    if (message.includes('how are you')) {
      return "I'm doing great, thank you for asking! 🤖 I'm here and ready to help you manage your tasks efficiently. How are you doing today?";
    }

    // Task count
    if (message.includes('how many tasks')) {
      const total = tasks.length;
      const completed = tasks.filter(t => t.completed).length;
      const pending = total - completed;
      return `📊 You have ${total} total tasks: ${completed} completed and ${pending} pending. ${pending > 0 ? "Let's tackle them together!" : "Great job! 🎉"}`;
    }

    // High priority
    if (message.includes('high priority') || message.includes('urgent')) {
      const highPriority = tasks.filter(t => t.priority === 'high' && !t.completed);
      if (highPriority.length === 0) {
        return '✅ Excellent! You have no high-priority pending tasks. Keep up the great work!';
      }
      return `🔴 You have ${highPriority.length} high-priority tasks:\n${highPriority.map(t => `• ${t.title}`).join('\n')}\n\nI recommend tackling these first!`;
    }

    // Planning
    if (message.includes('plan') || message.includes('schedule')) {
      const pendingTasks = tasks.filter(t => !t.completed).length;
      if (pendingTasks === 0) {
        return '🎉 You have no pending tasks! Enjoy your free time or plan ahead for upcoming work.';
      }
      return `📅 I'd recommend focusing on your ${pendingTasks} pending tasks. Start with high-priority items, break down large tasks into smaller chunks, and use the "Generate Plan" feature for an optimized schedule!`;
    }

    // Productivity tips
    if (message.includes('productivity') || message.includes('tips') || message.includes('advice')) {
      const tips = [
        '🎯 Break large tasks into smaller, manageable sub-tasks',
        '⏰ Use time-blocking to focus on one task at a time',
        '📱 Turn off notifications while working on important tasks',
        '🎯 Prioritize using the Eisenhower Matrix (urgent vs important)',
        '💪 Take regular breaks to maintain focus (try Pomodoro technique)',
        '🌅 Tackle your most challenging tasks in the morning',
        '📝 Review your progress at the end of each day'
      ];
      const selectedTips = tips.sort(() => 0.5 - Math.random()).slice(0, 3);
      return `Here are some productivity tips for you:\n\n${selectedTips.join('\n')}\n\nWould you like more specific advice?`;
    }

    // Stress/overwhelmed
    if (message.includes('stress') || message.includes('overwhelm') || message.includes('tired')) {
      return `I understand you're feeling stressed. 🧘 Here's what I recommend:\n\n• Take a 5-minute break to clear your mind\n• Focus on just ONE task at a time\n• Break down large tasks into smaller steps\n• Consider delegating or postponing less critical items\n• Remember: Progress over perfection!\n\nYou've got this! 💪`;
    }

    // Help
    if (message.includes('help') || message.includes('what can you do')) {
      return `I'm your AI task management assistant! 🤖 I can help you with:\n\n📊 Task Statistics - Count, status, priorities\n📅 Planning & Scheduling - Daily plan recommendations\n🎯 Priority Analysis - Identify urgent tasks\n💡 Productivity Tips - Boost your efficiency\n🧘 Stress Management - Stay balanced\n\nJust ask me anything about your tasks!`;
    }

    // Default intelligent response
    const responses = [
      `I understand you're asking about "${userMessage}". Could you be more specific? I can help with task counts, priorities, planning, or productivity tips!`,
      `Interesting question! 🤔 I can provide better assistance if you ask about:\n• Your task statistics\n• Planning recommendations\n• Priority analysis\n• Productivity advice\n\nWhat would you like to know?`,
      `I'm here to help! 😊 Try asking me:\n• "How many tasks do I have?"\n• "Show high priority tasks"\n• "Give me productivity tips"\n• "Help me plan my day"\n\nWhat interests you most?`
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      sender: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const userInput = input;
    setInput('');
    setLoading(true);

    try {
      // Call AI service
      const { taskAPI } = require('../services/api');
      const response = await taskAPI.sendChatMessage(userInput, tasks);
      
      const aiResponse = {
        id: messages.length + 2,
        sender: 'ai',
        text: response.data?.response || generateAIResponse(userInput),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('AI Chat error:', error);
      // Fallback to local response
      const aiResponse = {
        id: messages.length + 2,
        sender: 'ai',
        text: generateAIResponse(userInput),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickReply = (text) => {
    setInput(text);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="glass-card rounded-2xl border border-white/10 overflow-hidden flex flex-col h-[600px] animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600/20 to-purple-600/20 border-b border-white/10 p-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          AI Chat Assistant
        </h2>
        <p className="text-sm text-gray-400 mt-1">Your intelligent task management companion</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map(message => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                message.sender === 'user'
                  ? 'bg-primary-600 text-white rounded-br-none'
                  : 'bg-white/10 text-gray-100 rounded-bl-none border border-white/20'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.text}</p>
              <p className="text-xs opacity-70 mt-2">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white/10 text-gray-100 px-4 py-3 rounded-2xl rounded-bl-none border border-white/20">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies */}
      {messages.length <= 1 && (
        <div className="px-6 py-4 border-t border-white/10">
          <p className="text-xs text-gray-400 mb-3">Quick suggestions:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {quickReplies.map((reply, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickReply(reply.text)}
                className="text-left p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all text-sm text-gray-300 hover:text-white"
              >
                <span className="mr-2">{reply.icon}</span>
                {reply.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="border-t border-white/10 p-4 bg-white/5">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about your tasks..."
            className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-primary-400/50 focus:bg-white/15 transition-all"
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="btn-primary px-6 py-2 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChat;

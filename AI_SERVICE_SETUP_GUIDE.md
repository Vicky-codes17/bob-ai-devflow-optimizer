# AI Service Setup & Configuration Guide

## Overview
This guide explains how to set up and configure the IBM watsonx.ai integration for the CLYNO AI DevFlow Optimizer.

---

## 🚀 Quick Start

### Option 1: Use with IBM watsonx.ai (Recommended)

1. **Get IBM Cloud Account**
   - Visit: https://cloud.ibm.com
   - Sign up for a free account
   - Navigate to watsonx.ai service

2. **Create watsonx.ai Project**
   - Go to watsonx.ai dashboard
   - Create a new project
   - Note your Project ID

3. **Get API Credentials**
   - Generate an API key from IBM Cloud
   - Copy your API key securely

4. **Configure Environment Variables**
   
   Edit `server/.env`:
   ```env
   # Enable AI Service
   USE_AI=true
   
   # IBM watsonx.ai Configuration
   WATSONX_API_KEY=your_api_key_here
   WATSONX_PROJECT_ID=your_project_id_here
   WATSONX_URL=https://us-south.ml.cloud.ibm.com
   WATSONX_MODEL_ID=ibm/granite-13b-chat-v2
   
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=clyno_db
   DB_USER=your_username
   DB_PASSWORD=your_password
   ```

5. **Restart Server**
   ```bash
   cd server
   npm start
   ```

### Option 2: Use Intelligent Fallback Mode

If you don't have IBM watsonx.ai credentials, the system will use intelligent fallback responses:

Edit `server/.env`:
```env
# Disable AI Service (use fallback)
USE_AI=false
```

The system will still provide intelligent responses using rule-based logic!

---

## 🔧 AI Service Features

### 1. AI Chat Assistant
- **Location**: AI Chat tab
- **Functionality**: Interactive chat with AI about tasks
- **How it works**:
  - User sends message
  - System calls `/api/tasks/ai-chat` endpoint
  - Backend uses watsonx.ai or fallback logic
  - AI responds with personalized advice

**Example Queries**:
- "How many tasks do I have?"
- "Show high priority tasks"
- "Give me productivity tips"
- "I'm feeling overwhelmed"

### 2. AI Plan Generation
- **Location**: Dashboard → Time Schedule
- **Functionality**: Generate optimized daily schedule
- **How it works**:
  - User clicks "Generate Plan"
  - System analyzes all pending tasks
  - AI creates time-slot based schedule (Morning/Afternoon/Evening)
  - Returns optimized plan with recommendations

**Features**:
- Priority-based scheduling
- Deadline awareness
- Time slot optimization
- AI recommendations

### 3. Stress Analysis
- **Location**: Dashboard → Stress Indicator
- **Functionality**: Real-time stress level calculation
- **How it works**:
  - Analyzes task count, deadlines, priorities
  - Calculates stress score (0-100)
  - Provides stress level (Low/Medium/High/Critical)
  - Offers recommendations

### 4. Workspace AI Insights
- **Location**: Workspace tab
- **Functionality**: Get AI insights for different categories
- **Categories**:
  - Productivity Dashboard
  - Team Collaboration
  - Advanced Analytics
  - Task Automation

**How to use**:
1. Select a category
2. Click "Get AI Insights"
3. AI analyzes your tasks
4. Provides personalized recommendations

---

## 📊 AI Service Architecture

```
Frontend (React)
    ↓
API Layer (client/src/services/api.js)
    ↓
Backend Routes (server/routes/tasks.js)
    ↓
Controllers (server/controllers/taskController.js)
    ↓
AI Service (server/services/watsonxService.js)
    ↓
IBM watsonx.ai API OR Fallback Logic
```

---

## 🔍 Testing AI Features

### Test AI Chat
```bash
# Using curl
curl -X POST http://localhost:5000/api/tasks/ai-chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "How many tasks do I have?",
    "tasks": []
  }'
```

### Test Plan Generation
```bash
curl -X POST http://localhost:5000/api/tasks/generate-plan \
  -H "Content-Type: application/json"
```

### Test Stress Analysis
```bash
curl -X GET http://localhost:5000/api/tasks/stress-level
```

---

## 🎯 AI Response Types

### 1. Real AI Response (watsonx.ai)
```json
{
  "success": true,
  "data": {
    "response": "Based on your 5 tasks, I recommend...",
    "source": "ai"
  }
}
```

### 2. Fallback Response
```json
{
  "success": true,
  "data": {
    "response": "📊 You have 5 total tasks: 2 completed and 3 pending.",
    "source": "fallback"
  }
}
```

Both provide intelligent, helpful responses!

---

## 🛠️ Troubleshooting

### Issue: AI not responding

**Check 1: Environment Variables**
```bash
cd server
cat .env | grep WATSONX
```

**Check 2: Server Logs**
```bash
# Look for these messages:
# ✅ "Calling IBM watsonx.ai..."
# ❌ "AI Error: ..."
# 🔄 "Falling back to mock response"
```

**Check 3: API Key**
- Verify API key is valid
- Check IBM Cloud dashboard
- Ensure project ID is correct

### Issue: Fallback mode always active

**Solution**: Set `USE_AI=true` in `.env`

### Issue: Slow AI responses

**Causes**:
- Network latency to IBM Cloud
- Model processing time
- Large task lists

**Solutions**:
- Increase timeout in `watsonxService.js`
- Use faster model
- Optimize prompts

---

## 📈 Performance Optimization

### 1. Caching
Consider implementing response caching for similar queries:
```javascript
// Example: Cache AI responses for 5 minutes
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
```

### 2. Prompt Optimization
Keep prompts concise and specific:
```javascript
// Good
"Analyze 5 tasks and provide stress level"

// Bad
"Please analyze all of my tasks in detail and tell me everything about stress..."
```

### 3. Batch Processing
Process multiple requests together when possible.

---

## 🔐 Security Best Practices

1. **Never commit API keys**
   - Use `.env` files
   - Add `.env` to `.gitignore`
   - Use environment variables in production

2. **Rotate API keys regularly**
   - Generate new keys monthly
   - Revoke old keys

3. **Rate Limiting**
   - Implement rate limiting on AI endpoints
   - Prevent abuse

4. **Input Validation**
   - Sanitize user inputs
   - Validate message length
   - Check for malicious content

---

## 📚 API Endpoints Reference

### POST /api/tasks/ai-chat
**Request**:
```json
{
  "message": "string",
  "tasks": [...]
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "response": "string",
    "source": "ai|fallback"
  }
}
```

### POST /api/tasks/generate-plan
**Response**:
```json
{
  "success": true,
  "data": {
    "date": "2026-05-03",
    "schedule": {
      "morning": [...],
      "afternoon": [...],
      "evening": [...]
    },
    "summary": "string",
    "recommendations": [...]
  }
}
```

### GET /api/tasks/stress-level
**Response**:
```json
{
  "success": true,
  "data": {
    "level": "LOW|MEDIUM|HIGH|CRITICAL",
    "score": 45,
    "factors": {...},
    "recommendations": [...]
  }
}
```

---

## 🎓 Advanced Configuration

### Custom Model Selection
Edit `server/config/watsonx.js`:
```javascript
model: {
  id: 'ibm/granite-13b-chat-v2', // Change model here
  parameters: {
    max_new_tokens: 500,
    temperature: 0.7,
    top_p: 0.9
  }
}
```

### Timeout Adjustment
```javascript
timeout: 30000, // 30 seconds
```

### Retry Logic
```javascript
retry: {
  maxAttempts: 3,
  delay: 1000
}
```

---

## ✅ Verification Checklist

- [ ] Environment variables configured
- [ ] Server starts without errors
- [ ] AI Chat responds to messages
- [ ] Plan generation works
- [ ] Stress analysis displays
- [ ] Workspace insights functional
- [ ] Fallback mode works when AI disabled
- [ ] Error handling works properly

---

## 🆘 Support

### Common Questions

**Q: Do I need IBM watsonx.ai to use the app?**
A: No! The app works with intelligent fallback responses if AI is not configured.

**Q: Is the fallback mode smart?**
A: Yes! It uses rule-based logic to provide helpful, context-aware responses.

**Q: How much does IBM watsonx.ai cost?**
A: IBM offers free tier and pay-as-you-go pricing. Check IBM Cloud for details.

**Q: Can I use a different AI service?**
A: Yes! You can modify `watsonxService.js` to integrate other AI services.

---

## 📝 Summary

The CLYNO AI DevFlow Optimizer provides:
- ✅ Full IBM watsonx.ai integration
- ✅ Intelligent fallback responses
- ✅ Multiple AI-powered features
- ✅ Easy configuration
- ✅ Production-ready architecture

**Both modes (AI and Fallback) provide excellent user experience!**

---

*Last Updated: May 3, 2026*
*Version: 1.0.0*
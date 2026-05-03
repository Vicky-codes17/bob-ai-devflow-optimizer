# TaskMind AI - API Documentation

## Base URL
```
http://localhost:5000/api
```

## Response Format
All API responses follow this structure:
```json
{
  "success": true/false,
  "message": "Description of the result",
  "data": { ... },
  "errors": [ ... ] // Only present on validation errors
}
```

---

## Endpoints

### 1. Health Check

#### GET `/health`
Check if the API is running.

**Response:**
```json
{
  "success": true,
  "message": "TaskMind AI Backend is running",
  "timestamp": "2026-05-01T18:00:00.000Z",
  "environment": "development",
  "aiMode": "Mock"
}
```

---

### 2. Task Management

#### GET `/tasks`
Get all tasks with calculated metadata.

**Response:**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "id": 1,
      "title": "Complete Math Assignment",
      "deadline": "2026-05-03T23:59:59Z",
      "duration": 3,
      "completed": 0,
      "created_at": "2026-05-01T10:00:00Z",
      "daysRemaining": 2,
      "isOverdue": false,
      "priority": "medium"
    }
  ]
}
```

---

#### GET `/tasks/:id`
Get a single task by ID.

**Parameters:**
- `id` (path) - Task ID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Complete Math Assignment",
    "deadline": "2026-05-03T23:59:59Z",
    "duration": 3,
    "completed": 0,
    "created_at": "2026-05-01T10:00:00Z",
    "daysRemaining": 2,
    "isOverdue": false,
    "priority": "medium"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Task not found"
}
```

---

#### POST `/tasks/add-task`
Create a new task.

**Request Body:**
```json
{
  "title": "Complete Math Assignment",
  "deadline": "2026-05-03T23:59:59Z",
  "duration": 3
}
```

**Validation Rules:**
- `title`: Required, string, 1-200 characters
- `deadline`: Required, valid ISO date string, must be in the future
- `duration`: Optional, number, 0.5-24 hours (default: 2)

**Response (201):**
```json
{
  "success": true,
  "message": "Task added successfully",
  "data": {
    "id": 1,
    "title": "Complete Math Assignment",
    "deadline": "2026-05-03T23:59:59Z",
    "duration": 3,
    "completed": false,
    "created_at": "2026-05-01T10:00:00Z"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "Title is required and must be a string",
    "Deadline must be in the future"
  ]
}
```

---

#### PUT `/tasks/:id`
Update an existing task.

**Parameters:**
- `id` (path) - Task ID

**Request Body (all fields optional):**
```json
{
  "title": "Updated Title",
  "deadline": "2026-05-04T23:59:59Z",
  "duration": 4,
  "completed": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Task updated successfully"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Task not found"
}
```

---

#### DELETE `/tasks/:id`
Delete a task.

**Parameters:**
- `id` (path) - Task ID

**Response:**
```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Task not found"
}
```

---

#### GET `/tasks/stats`
Get task statistics.

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 10,
    "incomplete": 7,
    "completed": 3,
    "overdue": 2,
    "urgent": 3
  }
}
```

---

### 3. AI Features

#### POST `/tasks/generate-plan`
Generate a smart daily plan based on incomplete tasks.

**Response:**
```json
{
  "success": true,
  "message": "Plan generated successfully",
  "data": {
    "date": "2026-05-01",
    "morning": [
      {
        "id": 1,
        "title": "Complete Math Assignment",
        "duration": 3,
        "timeSlot": "9:00 AM - 12:00 PM"
      }
    ],
    "afternoon": [
      {
        "id": 2,
        "title": "Project Report",
        "duration": 2,
        "timeSlot": "2:00 PM - 4:00 PM"
      }
    ],
    "evening": [],
    "totalHours": 5,
    "aiRecommendation": "Focus on urgent tasks first. Take breaks between sessions."
  }
}
```

**Empty Response:**
```json
{
  "success": true,
  "message": "No tasks to plan",
  "data": {
    "date": "2026-05-01",
    "morning": [],
    "afternoon": [],
    "evening": [],
    "totalHours": 0,
    "aiRecommendation": "🎉 No tasks! Enjoy your free time."
  }
}
```

---

#### GET `/tasks/stress-level`
Calculate current stress level based on tasks.

**Response:**
```json
{
  "success": true,
  "data": {
    "currentLevel": "MEDIUM",
    "score": 55,
    "factors": {
      "taskCount": 5,
      "urgentTasks": 2,
      "totalHoursNeeded": 12,
      "availableHours": 24,
      "workloadDensity": "moderate"
    },
    "forecast": [
      {
        "date": "2026-05-01",
        "level": "MEDIUM",
        "score": 55,
        "tasksDue": 2
      },
      {
        "date": "2026-05-02",
        "level": "HIGH",
        "score": 75,
        "tasksDue": 3
      }
    ],
    "recommendation": "🟡 MODERATE STRESS: Stay focused on your 2 urgent task(s). You can manage this workload.",
    "aiInsight": "📅 Your next task \"Complete Math Assignment\" is due in 2 days. Plan your time wisely."
  }
}
```

**Stress Levels:**
- `LOW`: Score 0-29 (🟢)
- `MEDIUM`: Score 30-59 (🟡)
- `HIGH`: Score 60-100 (🔴)

---

#### POST `/tasks/simulate-delay`
Simulate the impact of delaying a task.

**Request Body:**
```json
{
  "taskId": 1,
  "delayDays": 2
}
```

**Validation Rules:**
- `taskId`: Required, valid task ID
- `delayDays`: Required, number, 1-30

**Response:**
```json
{
  "success": true,
  "message": "Delay simulation completed",
  "data": {
    "task": {
      "id": 1,
      "title": "Complete Math Assignment",
      "currentDeadline": "2026-05-03T23:59:59Z",
      "newDeadline": "2026-05-05T23:59:59Z"
    },
    "impact": {
      "stressBefore": 45,
      "stressAfter": 65,
      "stressIncrease": 20,
      "severity": "MODERATE"
    },
    "conflicts": [
      {
        "taskId": 2,
        "title": "Project Report",
        "deadline": "2026-05-05T23:59:59Z",
        "message": "Will overlap with this task"
      }
    ],
    "recommendation": "⚠️ Delaying this task will increase stress by 20 points. Consider alternative solutions.",
    "aiAdvice": "This delay will create conflicts with 1 other task(s). Try to complete it on time or reschedule other tasks."
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Task not found"
}
```

---

## Error Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 404 | Not Found |
| 429 | Too Many Requests (rate limit) |
| 500 | Internal Server Error |

---

## Rate Limiting

- **Limit**: 100 requests per minute per IP
- **Response when exceeded**:
```json
{
  "success": false,
  "message": "Too many requests, please try again later"
}
```

---

## Examples

### Using cURL

**Get all tasks:**
```bash
curl http://localhost:5000/api/tasks
```

**Create a task:**
```bash
curl -X POST http://localhost:5000/api/tasks/add-task \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete Assignment",
    "deadline": "2026-05-05T23:59:59Z",
    "duration": 3
  }'
```

**Update a task:**
```bash
curl -X PUT http://localhost:5000/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'
```

**Delete a task:**
```bash
curl -X DELETE http://localhost:5000/api/tasks/1
```

**Generate plan:**
```bash
curl -X POST http://localhost:5000/api/tasks/generate-plan
```

**Get stress level:**
```bash
curl http://localhost:5000/api/tasks/stress-level
```

---

### Using JavaScript (Axios)

```javascript
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Get all tasks
const tasks = await axios.get(`${API_URL}/tasks`);

// Create task
const newTask = await axios.post(`${API_URL}/tasks/add-task`, {
  title: 'Complete Assignment',
  deadline: '2026-05-05T23:59:59Z',
  duration: 3
});

// Update task
await axios.put(`${API_URL}/tasks/1`, {
  completed: true
});

// Delete task
await axios.delete(`${API_URL}/tasks/1`);

// Generate plan
const plan = await axios.post(`${API_URL}/tasks/generate-plan`);

// Get stress level
const stress = await axios.get(`${API_URL}/tasks/stress-level`);
```

---

## Notes

- All dates should be in ISO 8601 format (e.g., `2026-05-05T23:59:59Z`)
- Duration is in hours (can be decimal, e.g., 1.5 for 1 hour 30 minutes)
- Completed status is boolean (true/false) in requests, but stored as integer (0/1) in database
- Priority is automatically calculated based on deadline proximity
- AI features use mock responses when `USE_AI=false` in environment variables

---

**Made with Bob**
# Clyno – Project Folder Structure

## 📁 Root Directory Structure

```
clyno/
├── client/                 # Frontend React application
├── server/                 # Backend Node.js application
├── docs/                   # Project documentation
├── .gitignore             # Git ignore file
├── README.md              # Project overview and setup
├── MIGRATION_SUMMARY.md   # Database migration guide
└── PROJECT_STRUCTURE.md   # This file
```

---

## 🎨 Frontend Structure (`client/`)

```
client/
├── public/                 # Static files (index.html, favicon, etc.)
│   ├── index.html
│   └── favicon.ico
│
├── src/                    # Source code
│   ├── components/         # Reusable UI components
│   │   ├── common/         # Generic components (Button, Card, etc.)
│   │   ├── TaskCard.jsx    # Individual task display
│   │   ├── TaskForm.jsx    # Add/Edit task form
│   │   ├── StressIndicator.jsx  # Visual stress level display
│   │   └── PlanSuggestion.jsx   # AI-generated plan display
│   │
│   ├── pages/              # Full page components
│   │   ├── Dashboard.jsx   # Main dashboard with tasks
│   │   ├── TaskDetails.jsx # Single task view
│   │   └── Settings.jsx    # User settings
│   │
│   ├── services/           # API communication layer
│   │   ├── api.js          # Axios instance and base config
│   │   └── taskService.js  # Task-related API calls
│   │
│   ├── utils/              # Helper functions
│   │   ├── dateUtils.js    # Date formatting helpers
│   │   └── stressUtils.js  # Stress calculation helpers
│   │
│   ├── styles/             # CSS/styling files
│   │   ├── App.css
│   │   └── index.css
│   │
│   ├── App.jsx             # Main app component
│   ├── index.js            # Entry point
│   └── config.js           # Frontend configuration
│
├── package.json            # Dependencies and scripts
├── .env                    # Environment variables
└── README.md               # Frontend setup instructions
```

### Frontend Folder Purposes:

- **`public/`**: Contains static assets that don't need processing (HTML, images, icons)
- **`components/`**: Reusable UI pieces that can be used across multiple pages
- **`pages/`**: Complete page views that combine multiple components
- **`services/`**: Handles all API calls to the backend, keeping data logic separate
- **`utils/`**: Helper functions for common operations (date formatting, calculations)
- **`styles/`**: CSS files for styling the application

---

## ⚙️ Backend Structure (`server/`)

```
server/
├── config/                 # Configuration files
│   ├── database.js         # PostgreSQL database connection setup
│   └── watsonx.js          # Watson AI configuration
│
├── database/               # Database files
│   └── init.sql            # Database initialization script
│
├── models/                 # Database schemas and queries
│   ├── schema.sql          # Table definitions (PostgreSQL)
│   └── taskModel.js        # Task database operations (CRUD)
│
├── routes/                 # API endpoint definitions
│   └── tasks.js            # Task-related routes (/api/tasks)
│
├── controllers/            # Request handlers (business logic)
│   └── taskController.js   # Handle task operations
│
├── services/               # Core business logic
│   ├── stressCalculator.js # Calculate stress levels
│   ├── planGenerator.js    # Generate task plans
│   └── watsonxService.js   # Watson AI integration
│
├── middleware/             # Express middleware
│   ├── errorHandler.js     # Global error handling
│   └── validator.js        # Input validation
│
├── utils/                  # Helper functions
│   ├── dateHelper.js       # Date calculations
│   └── logger.js           # Logging utility
│
├── docs/                   # API documentation
│   └── API.md              # API endpoint documentation
│
├── server.js               # Main application entry point
├── package.json            # Dependencies and scripts
├── .env                    # Environment variables (API keys, DB config)
├── .env.example            # Example environment file
├── .gitignore              # Files to ignore in git
├── README.md               # Backend setup instructions
└── SETUP.md                # Detailed setup guide
```

### Backend Folder Purposes:

- **`config/`**: Stores configuration for database, AI services, and other external connections
- **`database/`**: Contains database initialization scripts
- **`models/`**: Defines database structure and provides functions to interact with data
- **`routes/`**: Maps HTTP endpoints (URLs) to controller functions
- **`controllers/`**: Handles incoming requests, calls services, and sends responses
- **`services/`**: Contains core business logic (stress calculation, AI integration)
- **`middleware/`**: Functions that run before/after request handling (error handling, validation)
- **`utils/`**: Reusable helper functions used across the application

---

## 📚 Documentation Structure (`docs/`)

```
docs/
├── API.md                  # API endpoint documentation
├── DATABASE.md             # Database schema documentation
├── SETUP.md                # Development setup guide
└── DEPLOYMENT.md           # Deployment instructions
```

---

## 🔄 Data Flow

```
User Request → Frontend (React)
    ↓
API Call (services/api.js)
    ↓
Backend Route (routes/tasks.js)
    ↓
Controller (controllers/taskController.js)
    ↓
Service Layer (services/stressCalculator.js)
    ↓
Model (models/taskModel.js)
    ↓
PostgreSQL Database
    ↓
Response back through the same chain
```

---

## 🚀 Quick Start Files

### Root `.gitignore`
```
# Dependencies
node_modules/
client/node_modules/
server/node_modules/

# Environment variables
.env
client/.env
server/.env

# Database
*.db
*.db-journal

# Build files
client/build/
dist/

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db
```

### Root `README.md` Structure
```markdown
# Clyno – Smart Deadline & Stress Manager

## Overview
AI-powered task management system that helps manage deadlines and reduce stress

## Features
- Task management with deadlines
- AI-powered stress level calculation
- Smart task planning suggestions

## Tech Stack
- Frontend: React + Tailwind CSS
- Backend: Node.js + Express
- Database: PostgreSQL
- AI: IBM watsonx.ai

## Setup
1. Clone the repository
2. Setup backend (see server/README.md)
3. Setup frontend (see client/README.md)

## Running the Project
- Backend: `cd server && npm run dev`
- Frontend: `cd client && npm start`
```

---

## 📝 Key Files Explained

### Backend Key Files:

1. **`server.js`**: Main entry point, sets up Express server, connects middleware and routes
2. **`config/database.js`**: Establishes PostgreSQL connection pool, exports database instance
3. **`models/taskModel.js`**: Functions like `getAllTasks()`, `createTask()`, `updateTask()`
4. **`routes/tasks.js`**: Defines endpoints like `GET /api/tasks`, `POST /api/tasks`
5. **`controllers/taskController.js`**: Handles request/response logic, calls services
6. **`services/stressCalculator.js`**: Calculates stress based on deadlines and workload
7. **`middleware/errorHandler.js`**: Catches and formats errors consistently

### Frontend Key Files:

1. **`index.js`**: React app entry point, renders App component
2. **`App.jsx`**: Main component, sets up routing and layout
3. **`services/api.js`**: Axios configuration, base URL, interceptors
4. **`services/taskService.js`**: Functions like `fetchTasks()`, `createTask()`
5. **`pages/Dashboard.jsx`**: Main page showing all tasks and stress levels
6. **`components/TaskCard.jsx`**: Displays individual task with deadline and priority

---

## 🎯 Hackathon Tips

### Keep It Simple:
- Start with basic CRUD operations for tasks
- Add AI features incrementally
- Use mock AI responses if Watson integration is complex

### Priority Order:
1. ✅ Backend API (tasks CRUD)
2. ✅ Database setup (PostgreSQL)
3. ✅ Frontend basic UI
4. ✅ Connect frontend to backend
5. ✅ Add stress calculation
6. ✅ Integrate AI suggestions
7. ✅ Polish UI/UX

### Time Management:
- **Day 1 Morning**: Backend + Database
- **Day 1 Afternoon**: Frontend structure + API integration
- **Day 2 Morning**: AI features + stress calculation
- **Day 2 Afternoon**: Testing + UI polish + presentation prep

---

## 🔧 Environment Variables

### Backend (`.env`)
```
PORT=5000
NODE_ENV=development

# PostgreSQL Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=clyno_db
DB_USER=postgres
DB_PASSWORD=your_password

# IBM watsonx.ai
WATSONX_API_KEY=your_api_key_here
WATSONX_PROJECT_ID=your_project_id_here
USE_AI=false
```

### Frontend (`.env`)
```
REACT_APP_API_URL=http://localhost:5000/api
```

---

## 📦 Dependencies

### Backend (`server/package.json`)
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "pg": "^8.11.3",
    "dotenv": "^16.3.1",
    "cors": "^2.8.5",
    "axios": "^1.6.0"
  }
}
```

### Frontend (`client/package.json`)
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "axios": "^1.4.0",
    "react-router-dom": "^6.11.0"
  }
}
```

---

## 🎨 Beginner-Friendly Notes

- **Separation of Concerns**: Each folder has a specific job (routes handle URLs, controllers handle logic, models handle data)
- **Modular Design**: Small, focused files are easier to understand and debug
- **Clear Naming**: File names describe what they do (`taskController.js`, `stressCalculator.js`)
- **Scalable**: Easy to add new features by adding new files in the right folders

---

## 💾 Database Information

### PostgreSQL vs SQLite
- **PostgreSQL**: Production-ready, supports concurrent connections, better for scaling
- **Connection Pooling**: Manages multiple database connections efficiently
- **ACID Compliance**: Ensures data integrity
- **Advanced Features**: JSON support, full-text search, complex queries

### Database Schema
```sql
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  deadline TIMESTAMP NOT NULL,
  duration INTEGER DEFAULT 2,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

**Good luck with your hackathon! 🚀**

---

**Made with Bob** 🤖
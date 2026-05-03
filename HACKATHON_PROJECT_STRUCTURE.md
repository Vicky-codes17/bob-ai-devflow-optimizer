# TaskMind AI - Complete Project Structure 📁

**Project**: TaskMind AI – Smart Deadline & Stress Manager  
**Stack**: React + Node.js + SQLite + IBM watsonx.ai  
**Timeline**: 48-hour Hackathon

---

## 🎯 Complete Folder Structure

```
taskmind-ai/
│
├── 📄 README.md                          # Main project documentation
├── 📄 .gitignore                         # Git ignore file
├── 📄 HACKATHON_PLAN.md                  # Hackathon timeline and phases
│
├── 📁 server/                            # Backend (Node.js + Express)
│   ├── 📄 package.json                   # Backend dependencies
│   ├── 📄 .env                           # Environment variables (API keys, DB config)
│   ├── 📄 .gitignore                     # Backend-specific ignores
│   ├── 📄 server.js                      # Main server entry point
│   ├── 📄 README.md                      # Backend setup instructions
│   │
│   ├── 📁 config/                        # Configuration files
│   │   ├── database.js                   # SQLite database connection setup
│   │   └── watsonx.js                    # IBM watsonx.ai configuration
│   │
│   ├── 📁 database/                      # Database files
│   │   ├── init.sql                      # Database initialization script
│   │   └── tasks.db                      # SQLite database file (auto-generated)
│   │
│   ├── 📁 models/                        # Database models/schemas
│   │   ├── taskModel.js                  # Task CRUD operations
│   │   └── schema.sql                    # Database table definitions
│   │
│   ├── 📁 routes/                        # API route definitions
│   │   └── tasks.js                      # Task-related API endpoints
│   │
│   ├── 📁 controllers/                   # Request handlers (business logic)
│   │   └── taskController.js             # Task operations (create, read, update, delete)
│   │
│   ├── 📁 services/                      # Core business logic
│   │   ├── watsonxService.js             # IBM watsonx.ai integration
│   │   ├── planGenerator.js              # AI-powered daily plan generation
│   │   └── stressCalculator.js           # Stress level calculation logic
│   │
│   ├── 📁 middleware/                    # Express middleware
│   │   ├── errorHandler.js               # Global error handling
│   │   └── validator.js                  # Input validation
│   │
│   └── 📁 utils/                         # Helper functions
│       ├── logger.js                     # Logging utility
│       └── dateHelper.js                 # Date/time formatting helpers
│
├── 📁 client/                            # Frontend (React)
│   ├── 📄 package.json                   # Frontend dependencies
│   ├── 📄 .gitignore                     # Frontend-specific ignores
│   ├── 📄 README.md                      # Frontend setup instructions
│   ├── 📄 tailwind.config.js             # Tailwind CSS configuration
│   ├── 📄 postcss.config.js              # PostCSS configuration
│   │
│   ├── 📁 public/                        # Static files
│   │   └── index.html                    # HTML template
│   │
│   └── 📁 src/                           # React source code
│       ├── 📄 index.js                   # React entry point
│       ├── 📄 App.jsx                    # Main App component
│       ├── 📄 index.css                  # Global styles (Tailwind)
│       │
│       ├── 📁 components/                # Reusable UI components
│       │   ├── TaskForm.jsx              # Task input form
│       │   ├── TaskList.jsx              # Task list display
│       │   ├── DailyPlan.jsx             # Daily plan viewer
│       │   └── StressIndicator.jsx       # Stress level display
│       │
│       └── 📁 services/                  # API integration
│           └── api.js                    # Axios API calls to backend
│
└── 📁 docs/                              # Additional documentation (optional)
    ├── API.md                            # API endpoint documentation
    ├── SETUP.md                          # Detailed setup guide
    └── DEPLOYMENT.md                     # Deployment instructions
```

---

## 📂 Detailed Folder Explanations

### 🔷 Root Level

| File/Folder | Purpose |
|-------------|---------|
| `README.md` | Main project overview, features, and quick start guide |
| `.gitignore` | Specifies files to ignore in version control (node_modules, .env, etc.) |
| `HACKATHON_PLAN.md` | Timeline, phases, and task breakdown for the hackathon |

---

### 🔷 Backend (`server/`)

**Purpose**: Handles all server-side logic, database operations, and AI integration

#### Core Files
| File | Purpose |
|------|---------|
| `server.js` | Main entry point - starts Express server, connects routes and middleware |
| `package.json` | Lists backend dependencies (express, sqlite3, axios, dotenv, etc.) |
| `.env` | Stores sensitive data (API keys, database path, port number) |

#### `config/` - Configuration
| File | Purpose |
|------|---------|
| `database.js` | Sets up SQLite connection and provides database instance |
| `watsonx.js` | Configures IBM watsonx.ai API credentials and settings |

#### `database/` - Database Files
| File | Purpose |
|------|---------|
| `init.sql` | SQL script to create tables on first run |
| `tasks.db` | SQLite database file (auto-generated, stores all data) |

#### `models/` - Data Models
| File | Purpose |
|------|---------|
| `taskModel.js` | Functions for CRUD operations (create, read, update, delete tasks) |
| `schema.sql` | SQL table definitions (tasks table structure) |

#### `routes/` - API Routes
| File | Purpose |
|------|---------|
| `tasks.js` | Defines all task-related API endpoints (GET, POST, PATCH, DELETE) |

#### `controllers/` - Business Logic
| File | Purpose |
|------|---------|
| `taskController.js` | Handles HTTP requests, calls models/services, sends responses |

#### `services/` - Core Features
| File | Purpose |
|------|---------|
| `watsonxService.js` | Communicates with IBM watsonx.ai API for AI features |
| `planGenerator.js` | Generates smart daily plans using AI and task data |
| `stressCalculator.js` | Calculates stress levels based on tasks and deadlines |

#### `middleware/` - Express Middleware
| File | Purpose |
|------|---------|
| `errorHandler.js` | Catches and formats errors globally |
| `validator.js` | Validates incoming request data |

#### `utils/` - Helper Functions
| File | Purpose |
|------|---------|
| `logger.js` | Logs messages to console/file for debugging |
| `dateHelper.js` | Formats dates and calculates time differences |

---

### 🔷 Frontend (`client/`)

**Purpose**: User interface built with React and styled with Tailwind CSS

#### Core Files
| File | Purpose |
|------|---------|
| `package.json` | Lists frontend dependencies (react, axios, tailwindcss, etc.) |
| `tailwind.config.js` | Customizes Tailwind CSS (colors, spacing, etc.) |
| `postcss.config.js` | Configures PostCSS for Tailwind processing |

#### `public/` - Static Files
| File | Purpose |
|------|---------|
| `index.html` | HTML template where React app mounts |

#### `src/` - React Source Code
| File | Purpose |
|------|---------|
| `index.js` | React entry point - renders App component |
| `App.jsx` | Main component - manages state and layout |
| `index.css` | Global styles and Tailwind imports |

#### `src/components/` - UI Components
| File | Purpose |
|------|---------|
| `TaskForm.jsx` | Form to add new tasks (title, priority, deadline, etc.) |
| `TaskList.jsx` | Displays all tasks with status, priority, and actions |
| `DailyPlan.jsx` | Shows AI-generated daily schedule (morning/afternoon/evening) |
| `StressIndicator.jsx` | Visual stress level display with color coding |

#### `src/services/` - API Integration
| File | Purpose |
|------|---------|
| `api.js` | Axios functions to call backend APIs (fetch tasks, create task, etc.) |

---

## 🎯 Key Features by Folder

### Backend Features
```
config/          → Database & AI setup
models/          → Task data operations
services/        → AI planning & stress calculation
routes/          → API endpoints
controllers/     → Request handling
```

### Frontend Features
```
components/      → UI elements (forms, lists, displays)
services/        → Backend communication
App.jsx          → Main app logic & state
```

---

## 🚀 Quick Start Commands

### Backend Setup
```bash
cd server
npm install
cp .env.example .env    # Add your API keys
npm start               # Runs on http://localhost:3001
```

### Frontend Setup
```bash
cd client
npm install
npm start               # Runs on http://localhost:3000
```

---

## 📊 File Count Summary

| Category | Count | Purpose |
|----------|-------|---------|
| **Backend Files** | 15 | Server logic, database, AI integration |
| **Frontend Files** | 8 | React UI components and API calls |
| **Config Files** | 6 | Setup and configuration |
| **Documentation** | 5+ | Guides and instructions |
| **Total** | ~34 files | Complete hackathon project |

---

## 🎨 Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: SQLite3
- **AI**: IBM watsonx.ai
- **Utilities**: axios, dotenv, cors

### Frontend
- **Library**: React 18
- **Styling**: Tailwind CSS
- **HTTP Client**: axios
- **Build Tool**: Create React App

---

## 💡 Beginner Tips

### 1. **Start with Backend**
   - Set up database first
   - Test API endpoints with Postman/curl
   - Then connect frontend

### 2. **Use .env for Secrets**
   - Never commit API keys to Git
   - Use `.env.example` as template

### 3. **Test Incrementally**
   - Build one feature at a time
   - Test each API endpoint before moving on

### 4. **Keep It Simple**
   - Don't over-engineer
   - Focus on core features first
   - Add polish later if time permits

---

## 🔄 Development Workflow

```
1. Backend Setup
   ├── Install dependencies
   ├── Configure .env
   ├── Initialize database
   └── Test API endpoints

2. Frontend Setup
   ├── Install dependencies
   ├── Create components
   ├── Connect to backend APIs
   └── Style with Tailwind

3. Integration
   ├── Test full flow
   ├── Fix bugs
   └── Add final touches
```

---

## 📝 Essential Files to Create First

### Day 1 (Backend)
1. `server/server.js` - Start server
2. `server/config/database.js` - Database connection
3. `server/models/taskModel.js` - Task operations
4. `server/routes/tasks.js` - API routes
5. `server/controllers/taskController.js` - Logic

### Day 2 (Frontend)
1. `client/src/App.jsx` - Main component
2. `client/src/components/TaskForm.jsx` - Add tasks
3. `client/src/components/TaskList.jsx` - Show tasks
4. `client/src/services/api.js` - API calls
5. `client/src/components/DailyPlan.jsx` - AI features

---

## ✅ Hackathon Checklist

- [ ] Backend server running
- [ ] Database initialized
- [ ] API endpoints working
- [ ] Frontend displaying data
- [ ] Task CRUD operations
- [ ] AI plan generation
- [ ] Stress calculation
- [ ] UI styled with Tailwind
- [ ] Error handling
- [ ] README documentation

---

## 🎯 This Structure is Perfect For:

✅ **48-hour hackathons** - Simple and focused  
✅ **Beginners** - Clear separation of concerns  
✅ **Team collaboration** - Easy to divide work  
✅ **Quick prototyping** - Minimal setup required  
✅ **Scalability** - Can be extended later  

---

**Happy Hacking! 🚀**
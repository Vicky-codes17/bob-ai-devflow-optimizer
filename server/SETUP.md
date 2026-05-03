# Clyno Backend - Setup Guide

Complete setup instructions for the Clyno backend server.

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm (v8 or higher)
- PostgreSQL (v12 or higher)
- Terminal/Command Prompt

## 🚀 Installation Steps

### Step 1: Install PostgreSQL

#### On Ubuntu/Debian:
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### On macOS:
```bash
brew install postgresql
brew services start postgresql
```

#### On Windows:
Download and install from [PostgreSQL Official Website](https://www.postgresql.org/download/windows/)

### Step 2: Create Database

```bash
# Switch to postgres user (Linux/Mac)
sudo -u postgres psql

# Or connect directly (if configured)
psql -U postgres

# Create database
CREATE DATABASE clyno_db;

# Create user (optional, if not using default postgres user)
CREATE USER clyno_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE clyno_db TO clyno_user;

# Exit psql
\q
```

### Step 3: Navigate to Server Directory
```bash
cd server
```

### Step 4: Install Dependencies
```bash
npm install
```

This will install:
- express (Web framework)
- cors (Cross-origin resource sharing)
- dotenv (Environment variables)
- pg (PostgreSQL client)
- axios (HTTP client for AI integration)
- nodemon (Development auto-reload)

### Step 5: Verify Installation
```bash
npm list
```

You should see all dependencies listed without errors.

## ⚙️ Configuration

### Environment Setup

Update the `.env` file with your PostgreSQL credentials:

```bash
# Server Configuration
PORT=5000
NODE_ENV=development

# PostgreSQL Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=clyno_db
DB_USER=postgres
DB_PASSWORD=your_password_here
DB_SSL=false

# IBM watsonx.ai Configuration
WATSONX_API_KEY=your_api_key_here
WATSONX_URL=https://api.watsonx.ai/v1
WATSONX_PROJECT_ID=your_project_id
USE_AI=false
```

**For Development:** Keep `USE_AI=false` to use mock AI responses.

**For Production with IBM watsonx.ai:**
1. Get credentials from IBM Cloud
2. Update `WATSONX_API_KEY` and `WATSONX_PROJECT_ID`
3. Set `USE_AI=true`

### Database Initialization

Run the database schema:

```bash
# Option 1: Using psql
psql -U postgres -d clyno_db -f models/schema.sql

# Option 2: Using init script
psql -U postgres -f database/init.sql
```

## 🏃 Running the Server

### Development Mode (Recommended)
```bash
npm run dev
```

Features:
- Auto-reload on file changes
- Detailed error messages
- Console logging

### Production Mode
```bash
npm start
```

Features:
- Optimized performance
- Minimal logging

## ✅ Verification

### 1. Check PostgreSQL Status
```bash
# Linux/Mac
sudo systemctl status postgresql

# Or check connection
psql -U postgres -d clyno_db -c "SELECT version();"
```

### 2. Check Server Status
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "success": true,
  "message": "Clyno Backend is running",
  "timestamp": "2026-05-02T10:00:00.000Z",
  "environment": "development",
  "database": "PostgreSQL",
  "aiMode": "Mock"
}
```

### 3. Test Database Connection

Check if tables are created:
```bash
psql -U postgres -d clyno_db -c "\dt"
```

You should see the `tasks` table.

### 4. Test API Endpoints

#### Add a Task
```bash
curl -X POST http://localhost:5000/api/tasks/add-task \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Task",
    "deadline": "2026-05-10T23:59:59Z",
    "duration": 2
  }'
```

#### Get All Tasks
```bash
curl http://localhost:5000/api/tasks
```

#### Generate Plan
```bash
curl -X POST http://localhost:5000/api/tasks/generate-plan
```

#### Get Stress Level
```bash
curl http://localhost:5000/api/tasks/stress-level
```

## 🧪 Testing Workflow

### Complete Test Sequence

```bash
# 1. Add multiple tasks
curl -X POST http://localhost:5000/api/tasks/add-task \
  -H "Content-Type: application/json" \
  -d '{"title":"Math Assignment","deadline":"2026-05-03T23:59:59Z","duration":3}'

curl -X POST http://localhost:5000/api/tasks/add-task \
  -H "Content-Type: application/json" \
  -d '{"title":"Project Report","deadline":"2026-05-04T23:59:59Z","duration":4}'

curl -X POST http://localhost:5000/api/tasks/add-task \
  -H "Content-Type: application/json" \
  -d '{"title":"Presentation","deadline":"2026-05-02T14:00:00Z","duration":2}'

# 2. View all tasks
curl http://localhost:5000/api/tasks

# 3. Generate smart plan
curl -X POST http://localhost:5000/api/tasks/generate-plan

# 4. Check stress level
curl http://localhost:5000/api/tasks/stress-level

# 5. Simulate delay (replace 1 with actual task ID)
curl -X POST http://localhost:5000/api/tasks/simulate-delay \
  -H "Content-Type: application/json" \
  -d '{"taskId":1,"delayDays":1}'

# 6. Mark task complete (replace 1 with actual task ID)
curl -X PUT http://localhost:5000/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"completed":true}'

# 7. Delete task (replace 1 with actual task ID)
curl -X DELETE http://localhost:5000/api/tasks/1
```

## 🐛 Troubleshooting

### Issue: Port Already in Use

**Error:** `EADDRINUSE: address already in use :::5000`

**Solution:**
```bash
# Find process using port 5000
lsof -ti:5000

# Kill the process
lsof -ti:5000 | xargs kill -9

# Or use different port
PORT=3000 npm start
```

### Issue: PostgreSQL Connection Failed

**Error:** `ECONNREFUSED` or `password authentication failed`

**Solution:**
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Start PostgreSQL
sudo systemctl start postgresql

# Reset password
sudo -u postgres psql
ALTER USER postgres PASSWORD 'new_password';
\q

# Update .env file with correct credentials
```

### Issue: Database Does Not Exist

**Error:** `database "clyno_db" does not exist`

**Solution:**
```bash
# Create database
psql -U postgres -c "CREATE DATABASE clyno_db;"

# Run schema
psql -U postgres -d clyno_db -f models/schema.sql
```

### Issue: Module Not Found

**Error:** `Cannot find module 'pg'`

**Solution:**
```bash
# Delete and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: Permission Denied

**Error:** `EACCES: permission denied`

**Solution:**
```bash
# Fix permissions
chmod -R 755 .

# Or run with sudo (not recommended for development)
sudo npm start
```

## 📊 Expected Console Output

When server starts successfully:
```
==================================================
🚀 Clyno Backend Server
   Smart Deadline & Stress Manager
==================================================
📡 Server running on http://localhost:5000
📊 Environment: development
🤖 AI Mode: Mock (Development)
💾 Database: PostgreSQL (clyno_db)
🔌 DB Host: localhost:5432
==================================================
📚 API Endpoints:
   GET    /api/health
   GET    /api/tasks
   POST   /api/tasks/add-task
   POST   /api/tasks/generate-plan
   GET    /api/tasks/stress-level
   POST   /api/tasks/simulate-delay
   PUT    /api/tasks/:id
   DELETE /api/tasks/:id
==================================================
✅ Connected to PostgreSQL database
✅ Tasks table ready
```

## 🔄 Development Workflow

### 1. Start Development Server
```bash
npm run dev
```

### 2. Make Code Changes

Files will auto-reload on save.

### 3. Test Changes
```bash
curl http://localhost:5000/api/health
```

### 4. Check Logs

Watch terminal for:
- Request logs
- Error messages
- Database operations

### 5. Database Management

```bash
# View all tasks
psql -U postgres -d clyno_db -c "SELECT * FROM tasks;"

# Clear all tasks
psql -U postgres -d clyno_db -c "TRUNCATE tasks RESTART IDENTITY;"

# Drop and recreate database
psql -U postgres -c "DROP DATABASE clyno_db;"
psql -U postgres -c "CREATE DATABASE clyno_db;"
psql -U postgres -d clyno_db -f models/schema.sql
```

## 📦 Project Structure Verification

```bash
# Check all files exist
ls -R server/

# Expected structure:
server/
├── config/
│   ├── database.js
│   └── watsonx.js
├── routes/
│   └── tasks.js
├── controllers/
│   └── taskController.js
├── services/
│   ├── planGenerator.js
│   ├── stressCalculator.js
│   └── watsonxService.js
├── middleware/
│   ├── errorHandler.js
│   └── validator.js
├── models/
│   ├── schema.sql
│   └── taskModel.js
├── utils/
│   ├── dateHelper.js
│   └── logger.js
├── database/
│   └── init.sql
├── .env
├── .gitignore
├── package.json
├── server.js
├── README.md
└── SETUP.md
```

## 🎯 Next Steps

1. ✅ PostgreSQL is installed
2. ✅ Database is created
3. ✅ Server is running
4. ✅ APIs are working
5. 🔜 Connect frontend
6. 🔜 Deploy to production

## 📞 Support

If you encounter issues:
1. Check this guide
2. Review error messages
3. Check server logs
4. Verify PostgreSQL is running
5. Ensure database exists
6. Check .env configuration

## 🎉 Success!

If all tests pass, your backend is ready for:
- Frontend integration
- Demo preparation
- Hackathon presentation

**Happy coding! 🚀**

---

**Made with Bob** 🤖
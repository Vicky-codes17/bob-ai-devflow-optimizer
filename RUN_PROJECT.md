# 🚀 How to Run Clyno Project

Complete guide to run both backend and frontend.

## 📋 Prerequisites

- Node.js (v16+)
- PostgreSQL (v12+)
- npm or yarn

## 🔧 One-Time Setup

### 1. Install PostgreSQL

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# macOS
brew install postgresql
brew services start postgresql

# Windows
# Download from https://www.postgresql.org/download/windows/
```

### 2. Setup Backend

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Run PostgreSQL setup script
./setup-postgres.sh

# OR manually create database
createdb clyno_db
psql -U postgres -d clyno_db -f models/schema.sql

# Update .env with your PostgreSQL password
nano .env
# Set: DB_PASSWORD=your_password
```

### 3. Setup Frontend

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Create .env file (optional, defaults work)
cp .env.example .env
```

## 🏃 Running the Project

### Option 1: Run Both Separately (Recommended for Development)

#### Terminal 1 - Backend:
```bash
cd server
./start.sh
# OR
npm run dev
```

Backend runs on: `http://localhost:5000`

#### Terminal 2 - Frontend:
```bash
cd client
npm start
```

Frontend runs on: `http://localhost:3000`

### Option 2: Quick Start Script

Create a file `run-all.sh` in the root directory:

```bash
#!/bin/bash

echo "🚀 Starting Clyno Project"
echo ""

# Start backend in background
echo "📡 Starting backend server..."
cd server
./start.sh &
BACKEND_PID=$!
cd ..

# Wait for backend to start
sleep 3

# Start frontend
echo "🎨 Starting frontend..."
cd client
npm start

# Cleanup on exit
trap "kill $BACKEND_PID" EXIT
```

Then run:
```bash
chmod +x run-all.sh
./run-all.sh
```

## ✅ Verify Everything Works

### 1. Check Backend
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "success": true,
  "message": "Clyno Backend is running",
  "database": "PostgreSQL"
}
```

### 2. Check Frontend
Open browser: `http://localhost:3000`

### 3. Test API Connection
```bash
# Add a task
curl -X POST http://localhost:5000/api/tasks/add-task \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Task","deadline":"2026-05-10T10:00:00Z","duration":2}'

# Get all tasks
curl http://localhost:5000/api/tasks
```

## 🐛 Troubleshooting

### Backend Issues

#### Port 5000 Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or use different port
PORT=3001 npm run dev
```

#### PostgreSQL Connection Error
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql  # Linux
brew services list                # macOS

# Start PostgreSQL
sudo systemctl start postgresql   # Linux
brew services start postgresql    # macOS

# Check database exists
psql -U postgres -l | grep clyno_db

# Create if missing
createdb clyno_db
psql -U postgres -d clyno_db -f server/models/schema.sql
```

#### Password Authentication Failed
```bash
# Update .env with correct password
cd server
nano .env
# Set: DB_PASSWORD=your_actual_password

# Or reset PostgreSQL password
sudo -u postgres psql
ALTER USER postgres PASSWORD 'newpassword';
\q
```

### Frontend Issues

#### Port 3000 Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or React will offer to use different port
```

#### Cannot Connect to Backend
1. Ensure backend is running on port 5000
2. Check `client/.env` has correct API URL
3. Check browser console for CORS errors

### Database Issues

#### Database Does Not Exist
```bash
createdb clyno_db
cd server
psql -U postgres -d clyno_db -f models/schema.sql
```

#### Reset Database
```bash
# Drop and recreate
dropdb clyno_db
createdb clyno_db
cd server
psql -U postgres -d clyno_db -f models/schema.sql
```

## 📊 Project Structure

```
clyno/
├── server/              # Backend (Port 5000)
│   ├── config/          # Database & AI config
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── .env             # Environment config
│   ├── start.sh         # Startup script
│   └── setup-postgres.sh # Database setup
│
├── client/              # Frontend (Port 3000)
│   ├── src/
│   │   ├── components/  # React components
│   │   └── services/    # API calls
│   ├── .env             # Frontend config
│   └── package.json
│
└── RUN_PROJECT.md       # This file
```

## 🔗 Important URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health**: http://localhost:5000/api/health
- **API Docs**: http://localhost:5000/api

## 📝 Environment Variables

### Backend (.env)
```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=clyno_db
DB_USER=postgres
DB_PASSWORD=your_password
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 🎯 Quick Commands Reference

```bash
# Backend
cd server
npm install              # Install dependencies
./setup-postgres.sh      # Setup database
./start.sh              # Start server
npm run dev             # Start in dev mode

# Frontend
cd client
npm install             # Install dependencies
npm start               # Start dev server
npm run build           # Build for production

# Database
createdb clyno_db                                    # Create database
psql -U postgres -d clyno_db -f server/models/schema.sql  # Initialize schema
psql -U postgres -d clyno_db                        # Connect to database
dropdb clyno_db                                     # Delete database
```

## 🎉 Success!

If everything is working:
- ✅ Backend running on port 5000
- ✅ Frontend running on port 3000
- ✅ PostgreSQL database connected
- ✅ API calls working

You're ready to develop! 🚀

---

**Made with Bob** 🤖
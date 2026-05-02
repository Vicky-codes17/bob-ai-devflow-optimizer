# Clyno - Quick Start Guide 🚀

Get your Clyno backend running in 5 minutes!

## ⚡ Super Quick Start

```bash
# 1. Install PostgreSQL (if not already installed)
# Ubuntu/Debian:
sudo apt install postgresql postgresql-contrib

# macOS:
brew install postgresql

# 2. Create database
createdb clyno_db

# 3. Navigate to server directory
cd server

# 4. Install dependencies (one-time)
npm install

# 5. Configure environment
# Edit server/.env with your PostgreSQL credentials
nano .env

# 6. Initialize database
psql -U postgres -d clyno_db -f models/schema.sql

# 7. Start the server
npm run dev

# 8. Test it works
curl http://localhost:5000/api/health
```

That's it! Your backend is running on `http://localhost:5000`

---

## 📝 Test the APIs

### Add a Task
```bash
curl -X POST http://localhost:5000/api/tasks/add-task \
  -H "Content-Type: application/json" \
  -d '{"title":"Math Assignment","deadline":"2026-05-03T23:59:59Z","duration":3}'
```

### Get All Tasks
```bash
curl http://localhost:5000/api/tasks
```

### Generate Smart Plan
```bash
curl -X POST http://localhost:5000/api/tasks/generate-plan
```

### Get Stress Level
```bash
curl http://localhost:5000/api/tasks/stress-level
```

---

## 🧪 Run All Tests

```bash
cd server
./test-api.sh
```

This will test all 7 API endpoints automatically.

---

## 📚 Full Documentation

- **Setup Guide:** [server/SETUP.md](server/SETUP.md)
- **API Documentation:** [server/README.md](server/README.md)
- **Migration Guide:** [MIGRATION_SUMMARY.md](MIGRATION_SUMMARY.md)

---

## 🎯 What You Get

✅ **7 API Endpoints** - Complete task management  
✅ **Smart Daily Planner** - AI-powered scheduling  
✅ **Stress Intelligence** - Real-time stress tracking  
✅ **Delay Simulator** - Impact analysis  
✅ **PostgreSQL Database** - Production-ready database  
✅ **IBM watsonx.ai** - AI integration ready  
✅ **Production Ready** - Error handling, validation  

---

## 🔧 Troubleshooting

### Port Already in Use?
```bash
PORT=3000 npm run dev
```

### PostgreSQL Not Running?
```bash
# Ubuntu/Debian
sudo systemctl start postgresql

# macOS
brew services start postgresql
```

### Database Connection Error?
```bash
# Check PostgreSQL is running
psql -U postgres -c "SELECT version();"

# Update .env with correct credentials
nano server/.env
```

### Dependencies Issue?
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 🎉 Next Steps

1. ✅ Backend is running
2. 🔜 Build React frontend
3. 🔜 Connect to backend
4. 🔜 Demo preparation

**Happy coding! 🚀**

---

**Made with Bob** 🤖
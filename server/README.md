# Clyno - Backend Server

Smart Deadline & Stress Manager Backend API

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Setup PostgreSQL Database

Make sure PostgreSQL is installed and running on your system.

```bash
# Create database
createdb clyno_db

# Or using psql
psql -U postgres
CREATE DATABASE clyno_db;
\q
```

### 3. Configure Environment
```bash
# Copy .env file and update values
cp .env.example .env

# Edit .env with your PostgreSQL credentials
nano .env
```

Update the following in `.env`:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=clyno_db
DB_USER=postgres
DB_PASSWORD=your_password
```

### 4. Initialize Database Schema
```bash
# Run schema file
psql -U postgres -d clyno_db -f models/schema.sql
```

### 5. Start Server
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

Server will run on `http://localhost:5000`

## 📁 Project Structure

```
server/
├── config/
│   ├── database.js          # PostgreSQL database configuration
│   └── watsonx.js           # IBM watsonx.ai configuration
├── routes/
│   └── tasks.js             # API route handlers
├── controllers/
│   └── taskController.js    # Business logic controllers
├── services/
│   ├── planGenerator.js     # Smart plan generation logic
│   ├── stressCalculator.js  # Stress level calculation
│   └── watsonxService.js    # IBM watsonx.ai integration
├── middleware/
│   ├── errorHandler.js      # Error handling middleware
│   └── validator.js         # Request validation
├── models/
│   ├── schema.sql           # PostgreSQL database schema
│   └── taskModel.js         # Database operations
├── utils/
│   ├── dateHelper.js        # Date utility functions
│   └── logger.js            # Logging utility
├── database/
│   └── init.sql             # Database initialization
├── .env                     # Environment variables
├── package.json             # Dependencies
└── server.js                # Main entry point
```

## 🔌 API Endpoints

### Health Check
```bash
GET /api/health
```

### Tasks
```bash
# Get all tasks
GET /api/tasks

# Add new task
POST /api/tasks/add-task
Body: {
  "title": "Math Assignment",
  "deadline": "2026-05-03T23:59:59Z",
  "duration": 3
}

# Update task
PUT /api/tasks/:id
Body: {
  "completed": true
}

# Delete task
DELETE /api/tasks/:id
```

### Smart Features
```bash
# Generate daily plan
POST /api/tasks/generate-plan

# Get stress level
GET /api/tasks/stress-level

# Simulate delay
POST /api/tasks/simulate-delay
Body: {
  "taskId": 1,
  "delayDays": 1
}
```

## 🧪 Testing

### Using cURL

```bash
# Health check
curl http://localhost:5000/api/health

# Add task
curl -X POST http://localhost:5000/api/tasks/add-task \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Task","deadline":"2026-05-05T10:00:00Z","duration":2}'

# Get all tasks
curl http://localhost:5000/api/tasks

# Generate plan
curl -X POST http://localhost:5000/api/tasks/generate-plan

# Get stress level
curl http://localhost:5000/api/tasks/stress-level

# Simulate delay
curl -X POST http://localhost:5000/api/tasks/simulate-delay \
  -H "Content-Type: application/json" \
  -d '{"taskId":1,"delayDays":1}'
```

### Using Postman

Import the following collection:
1. Create new collection "Clyno API"
2. Add requests for each endpoint above
3. Set base URL: `http://localhost:5000`

## 🤖 IBM watsonx.ai Integration

### Setup

1. Get API credentials from IBM Cloud
2. Update `.env` file:
```bash
WATSONX_API_KEY=your_api_key_here
WATSONX_URL=https://api.watsonx.ai/v1
WATSONX_PROJECT_ID=your_project_id
USE_AI=true
```

### Mock Mode (Development)

For development without watsonx.ai:
```bash
USE_AI=false
```

The system will use rule-based algorithms as fallback.

## 💾 Database

### PostgreSQL Schema

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

### Database Operations

```bash
# Connect to database
psql -U postgres -d clyno_db

# View all tasks
SELECT * FROM tasks;

# Reset database
DROP TABLE tasks;
\i models/schema.sql

# Backup database
pg_dump -U postgres clyno_db > backup.sql

# Restore database
psql -U postgres clyno_db < backup.sql
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` |
| `DB_HOST` | PostgreSQL host | `localhost` |
| `DB_PORT` | PostgreSQL port | `5432` |
| `DB_NAME` | Database name | `clyno_db` |
| `DB_USER` | Database user | `postgres` |
| `DB_PASSWORD` | Database password | - |
| `DB_SSL` | Enable SSL | `false` |
| `WATSONX_API_KEY` | IBM watsonx.ai API key | - |
| `WATSONX_URL` | IBM watsonx.ai URL | - |
| `WATSONX_PROJECT_ID` | IBM watsonx.ai project ID | - |
| `USE_AI` | Enable AI features | `false` |

## 📊 Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Detail 1", "Detail 2"]
}
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or use different port
PORT=3000 npm start
```

### Database Connection Error
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Start PostgreSQL
sudo systemctl start postgresql

# Check connection
psql -U postgres -d clyno_db
```

### Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## 📝 Development

### Adding New Endpoint

1. Add route in `routes/tasks.js`
2. Add controller in `controllers/taskController.js`
3. Add business logic in `services/`
4. Test with cURL or Postman
5. Update documentation

### Code Style

- Use async/await for asynchronous operations
- Add error handling with try-catch
- Use meaningful variable names
- Add comments for complex logic
- Follow PostgreSQL best practices

## 🚢 Deployment

### Local
```bash
npm start
```

### Production (PM2)
```bash
npm install -g pm2
pm2 start server.js --name clyno-api
pm2 save
pm2 startup
```

### Docker
```bash
# Build image
docker build -t clyno-backend .

# Run container
docker run -p 5000:5000 \
  -e DB_HOST=host.docker.internal \
  -e DB_NAME=clyno_db \
  clyno-backend
```

### Heroku
```bash
# Login to Heroku
heroku login

# Create app
heroku create clyno-api

# Add PostgreSQL addon
heroku addons:create heroku-postgresql:hobby-dev

# Deploy
git push heroku main
```

## 📄 License

MIT License - See LICENSE file for details

## 👥 Team

Clyno Team - Hackathon 2026

## 🔗 Links

- Frontend Repository: [Link to frontend repo]
- Documentation: [Link to docs]
- Demo: [Link to demo]

---

**Made with Bob** 🤖
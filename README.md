# Clyno - Smart Deadline & Stress Manager

AI-powered task management system that helps you manage deadlines and reduce stress.

## 🚀 Features

- **Smart Task Management**: Add, edit, and track tasks with deadlines
- **AI-Powered Planning**: Automatically generate optimal daily schedules
- **Stress Intelligence**: Real-time stress level monitoring and prediction
- **Delay Impact Simulator**: See how postponing tasks affects your workload
- **IBM watsonx.ai Integration**: Advanced AI capabilities for intelligent planning

## 🏗️ Tech Stack

### Backend
- Node.js + Express
- PostgreSQL Database
- IBM watsonx.ai
- RESTful API

### Frontend
- React.js
- Tailwind CSS
- Axios for API calls

## 📦 Project Structure

```
clyno/
├── server/          # Backend API
│   ├── config/      # Database & AI configuration
│   ├── controllers/ # Business logic
│   ├── models/      # Database models
│   ├── routes/      # API routes
│   ├── services/    # Core services (AI, stress calc)
│   └── middleware/  # Error handling, validation
├── client/          # Frontend React app
│   ├── src/
│   │   ├── components/
│   │   └── services/
│   └── public/
└── docs/           # Documentation
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- PostgreSQL (v12+)
- npm or yarn

### Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create PostgreSQL database
createdb clyno_db

# Configure environment
cp .env.example .env
# Edit .env with your database credentials

# Initialize database
psql -U postgres -d clyno_db -f models/schema.sql

# Start server
npm run dev
```

Server runs on `http://localhost:5000`

### Frontend Setup

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Configure environment
cp .env.example .env

# Start development server
npm start
```

Client runs on `http://localhost:3000`

## 📚 Documentation

- [Backend Setup Guide](server/SETUP.md)
- [API Documentation](server/docs/API.md)
- [Project Structure](PROJECT_STRUCTURE.md)
- [Quick Start Guide](QUICKSTART.md)

## 🧪 Testing

```bash
# Test backend API
cd server
npm test

# Or use the test script
./test-api.sh
```

## 🤖 IBM watsonx.ai Integration

1. Get API credentials from IBM Cloud
2. Update `.env` file:
```env
WATSONX_API_KEY=your_api_key
WATSONX_PROJECT_ID=your_project_id
USE_AI=true
```

## 📄 License

MIT License

## 👥 Team

Clyno Team - Hackathon 2026

---

**Made with Bob** 🤖

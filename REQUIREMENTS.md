# CLYNO - Project Requirements

## Overview
CLYNO is an AI-powered workflow optimization and stress analysis tool built for the IBM Hackathon 2026. This document outlines all the requirements needed to run the application.

## System Requirements

### Backend Requirements

#### 1. Node.js Environment
- **Node.js**: v16.x or higher
- **npm**: v8.x or higher

#### 2. Database - PostgreSQL
- **PostgreSQL**: v13.x or higher
- **Database Name**: `clyno_db` (configurable)
- **Required Tables**: 
  - `tasks` - Stores task information
  - `stress_analysis` - Stores stress analysis data
  - `daily_plans` - Stores generated daily plans

**Database Configuration** (in `server/.env`):
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=clyno_db
DB_USER=postgres
DB_PASSWORD=07042006
```

#### 3. IBM watsonx.ai API
- **IBM Cloud Account**: Required
- **watsonx.ai Service**: Must be provisioned
- **API Key**: From IBM Cloud IAM
- **Project ID**: From watsonx.ai project

**API Configuration** (in `server/.env`):
```env
WATSONX_API_KEY=your_ibm_cloud_api_key
WATSONX_PROJECT_ID=your_watsonx_project_id
WATSONX_URL=https://us-south.ml.cloud.ibm.com
```

**How to Get IBM watsonx.ai Credentials:**
1. Create an IBM Cloud account at https://cloud.ibm.com
2. Provision watsonx.ai service
3. Create a project in watsonx.ai
4. Get API key from IBM Cloud IAM (Manage > Access (IAM) > API keys)
5. Get Project ID from watsonx.ai project settings

#### 4. Server Environment Variables
Create a `server/.env` file with the following:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=clyno_db
DB_USER=postgres
DB_PASSWORD=your_password

# IBM watsonx.ai Configuration
WATSONX_API_KEY=your_api_key_here
WATSONX_PROJECT_ID=your_project_id_here
WATSONX_URL=https://us-south.ml.cloud.ibm.com

# CORS Configuration (optional)
CORS_ORIGIN=http://localhost:3000
```

### Frontend Requirements

#### 1. Node.js Environment
- **Node.js**: v16.x or higher
- **npm**: v8.x or higher

#### 2. React Dependencies
All dependencies are listed in `client/package.json`:
- React v18.x
- React Router DOM
- Axios for API calls
- Tailwind CSS for styling

#### 3. Client Environment Variables
Create a `client/.env` file:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

## Installation Steps

### 1. Clone the Repository
```bash
git clone <repository-url>
cd bob-ai-devflow-optimizer
```

### 2. Setup Database
```bash
# Install PostgreSQL (if not installed)
# On Ubuntu/Debian:
sudo apt-get install postgresql postgresql-contrib

# On macOS:
brew install postgresql

# Create database
psql -U postgres
CREATE DATABASE clyno_db;
\q

# Run database initialization script
cd server
psql -U postgres -d clyno_db -f database/init.sql
```

### 3. Setup Backend
```bash
cd server

# Install dependencies
npm install

# Create .env file (copy from .env.example if available)
cp .env.example .env
# Edit .env with your credentials

# Test database connection
npm run test-db

# Start server
npm start
# or for development with auto-reload:
npm run dev
```

### 4. Setup Frontend
```bash
cd client

# Install dependencies
npm install

# Create .env file
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env

# Start development server
npm start
```

## Required API Keys and Credentials

### 1. IBM watsonx.ai API Key
- **Purpose**: AI-powered task planning and stress analysis
- **How to obtain**: 
  1. Sign up at https://cloud.ibm.com
  2. Navigate to Manage > Access (IAM) > API keys
  3. Create new API key
  4. Copy and save securely

### 2. IBM watsonx.ai Project ID
- **Purpose**: Identify your watsonx.ai project
- **How to obtain**:
  1. Go to https://dataplatform.cloud.ibm.com/wx/home
  2. Open your project
  3. Go to Manage > General
  4. Copy Project ID

### 3. Database Credentials
- **Purpose**: Store and retrieve task data
- **Default**: PostgreSQL local installation
- **Production**: Use managed database service (e.g., IBM Cloud Databases for PostgreSQL)

## Optional Configuration

### 1. CORS Settings
If deploying frontend and backend on different domains:
```env
CORS_ORIGIN=https://your-frontend-domain.com
```

### 2. Port Configuration
Change default ports if needed:
```env
# Backend
PORT=5000

# Frontend (in package.json)
"start": "PORT=3000 react-scripts start"
```

### 3. Database Pool Settings
For production, adjust connection pool:
```env
DB_POOL_MIN=2
DB_POOL_MAX=10
```

## Verification Checklist

- [ ] Node.js and npm installed
- [ ] PostgreSQL installed and running
- [ ] Database created and initialized
- [ ] IBM Cloud account created
- [ ] watsonx.ai service provisioned
- [ ] API key obtained
- [ ] Project ID obtained
- [ ] Backend .env file configured
- [ ] Frontend .env file configured
- [ ] Backend dependencies installed
- [ ] Frontend dependencies installed
- [ ] Backend server starts without errors
- [ ] Frontend server starts without errors
- [ ] Database connection successful
- [ ] API endpoints responding
- [ ] AI features working

## Troubleshooting

### Database Connection Issues
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Test connection
psql -U postgres -d clyno_db -c "SELECT 1;"
```

### API Key Issues
- Verify API key is valid and not expired
- Check API key has proper permissions
- Ensure no extra spaces in .env file

### CORS Issues
- Add frontend URL to CORS_ORIGIN in backend .env
- Clear browser cache
- Check browser console for specific errors

## Production Deployment

### Environment Variables for Production
```env
NODE_ENV=production
DB_SSL=true
WATSONX_URL=https://us-south.ml.cloud.ibm.com
```

### Security Considerations
- Never commit .env files to version control
- Use environment-specific .env files
- Rotate API keys regularly
- Use SSL/TLS for database connections
- Enable HTTPS for production deployment

## Support

For issues or questions:
1. Check the documentation in `/docs` folder
2. Review error logs in `server/logs`
3. Consult IBM watsonx.ai documentation
4. Contact project maintainers

## License

Built for IBM Hackathon 2026

---
Last Updated: May 2, 2026
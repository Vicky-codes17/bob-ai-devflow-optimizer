#!/bin/bash

# Clyno Server Startup Script
# Handles common issues and starts the server

echo "=========================================="
echo "🚀 Starting Clyno Server"
echo "=========================================="
echo ""

# Kill any process using port 5000
echo "🔍 Checking port 5000..."
if lsof -ti:5000 > /dev/null 2>&1; then
    echo "⚠️  Port 5000 is in use. Killing process..."
    lsof -ti:5000 | xargs kill -9 2>/dev/null
    sleep 1
    echo "✅ Port 5000 is now free"
else
    echo "✅ Port 5000 is available"
fi

echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found!"
    echo "📝 Creating .env from .env.example..."
    cp .env.example .env
    echo "✅ .env file created"
    echo ""
    echo "⚠️  IMPORTANT: Update .env with your PostgreSQL password!"
    echo "   Edit: nano .env"
    echo ""
fi

# Check if node_modules exists
if [ ! -d node_modules ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo "✅ Dependencies installed"
    echo ""
fi

# Check PostgreSQL connection
echo "🔍 Checking PostgreSQL connection..."
if psql -U postgres -d clyno_db -c "SELECT 1" > /dev/null 2>&1; then
    echo "✅ PostgreSQL connection successful"
else
    echo "⚠️  Cannot connect to PostgreSQL database 'clyno_db'"
    echo ""
    echo "Run setup script first:"
    echo "  ./setup-postgres.sh"
    echo ""
    echo "Or create database manually:"
    echo "  createdb clyno_db"
    echo "  psql -U postgres -d clyno_db -f models/schema.sql"
    echo ""
    exit 1
fi

echo ""
echo "=========================================="
echo "✅ All checks passed!"
echo "=========================================="
echo ""
echo "Starting server..."
echo ""

# Start the server
npm run dev

# Made with Bob

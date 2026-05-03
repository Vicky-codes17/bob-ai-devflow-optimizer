#!/bin/bash

# Clyno PostgreSQL Setup Script
# This script helps set up PostgreSQL database for Clyno

echo "=========================================="
echo "Clyno PostgreSQL Setup"
echo "=========================================="
echo ""

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed!"
    echo ""
    echo "Install PostgreSQL:"
    echo "  Ubuntu/Debian: sudo apt install postgresql postgresql-contrib"
    echo "  macOS: brew install postgresql"
    echo "  Windows: Download from https://www.postgresql.org/download/windows/"
    exit 1
fi

echo "✅ PostgreSQL is installed"
echo ""

# Check if PostgreSQL is running
if ! pg_isready &> /dev/null; then
    echo "⚠️  PostgreSQL is not running"
    echo ""
    echo "Start PostgreSQL:"
    echo "  Ubuntu/Debian: sudo systemctl start postgresql"
    echo "  macOS: brew services start postgresql"
    exit 1
fi

echo "✅ PostgreSQL is running"
echo ""

# Database configuration
DB_NAME="clyno_db"
DB_USER="postgres"

echo "Creating database: $DB_NAME"
echo ""

# Create database
psql -U $DB_USER -c "CREATE DATABASE $DB_NAME;" 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✅ Database '$DB_NAME' created successfully"
else
    echo "⚠️  Database '$DB_NAME' may already exist (this is OK)"
fi

echo ""
echo "Initializing database schema..."
echo ""

# Run schema
psql -U $DB_USER -d $DB_NAME -f models/schema.sql

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Database schema initialized successfully"
else
    echo ""
    echo "❌ Failed to initialize schema"
    exit 1
fi

echo ""
echo "=========================================="
echo "✅ Setup Complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Update .env file with your PostgreSQL credentials"
echo "2. Run: npm run dev"
echo "3. Test: curl http://localhost:5000/api/health"
echo ""
echo "Database Info:"
echo "  Name: $DB_NAME"
echo "  User: $DB_USER"
echo "  Host: localhost"
echo "  Port: 5432"
echo ""

# Made with Bob

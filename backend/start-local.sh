#!/bin/bash

# Start ROTATION Backend Server

echo "🚀 Starting ROTATION Backend Server..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ .env file not found. Please run setup-local.sh first"
    exit 1
fi

# Check if Redis is running
if ! redis-cli ping &> /dev/null; then
    echo "⚠️  Redis is not running. Starting Redis..."
    redis-server --daemonize yes
    sleep 1
fi

# Check if PostgreSQL is accessible
if command -v psql &> /dev/null; then
    if ! psql -U postgres -d rotation_db -c "SELECT 1;" &> /dev/null; then
        echo "⚠️  Database 'rotation_db' not accessible. Please ensure PostgreSQL is running and database exists."
        echo "   You can create it with: createdb -U postgres rotation_db"
        echo "   Or install PostgreSQL: brew install postgresql@14"
    fi
else
    echo "⚠️  PostgreSQL not found. Please install PostgreSQL:"
    echo "   brew install postgresql@14"
    echo "   brew services start postgresql@14"
    echo "   createdb -U postgres rotation_db"
fi

# Start the server
echo "📦 Starting Node.js server..."
npm run dev


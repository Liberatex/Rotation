#!/bin/bash

# ROTATION Backend Local Setup Script

echo "🚀 Setting up ROTATION backend for local development..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOF
# Server Configuration
NODE_ENV=development
PORT=3000
API_VERSION=v1

# Database Configuration
DATABASE_URL=postgresql://postgres:password@localhost:5432/rotation_db
DB_HOST=localhost
DB_PORT=5432
DB_NAME=rotation_db
DB_USER=postgres
DB_PASSWORD=password

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT Configuration
JWT_SECRET=dev-secret-key-change-in-production-12345
JWT_REFRESH_SECRET=dev-refresh-secret-key-change-in-production-12345
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Firebase Configuration (Optional)
FIREBASE_PROJECT_ID=
FIREBASE_PRIVATE_KEY=
FIREBASE_CLIENT_EMAIL=

# Stripe Configuration (Optional)
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# AWS S3 Configuration (Optional)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=us-east-1
AWS_S3_BUCKET=

# CORS Configuration
CORS_ORIGIN=http://localhost:3000,http://localhost:19006,http://localhost:8081

# WebSocket Configuration
WS_PORT=3001

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
EOF
    echo "✅ .env file created"
else
    echo "✅ .env file already exists"
fi

# Check if PostgreSQL is running
echo "🔍 Checking PostgreSQL..."
if command -v psql &> /dev/null; then
    if psql -U postgres -lqt | cut -d \| -f 1 | grep -qw rotation_db; then
        echo "✅ Database 'rotation_db' already exists"
    else
        echo "📦 Creating database 'rotation_db'..."
        createdb -U postgres rotation_db 2>/dev/null || psql -U postgres -c "CREATE DATABASE rotation_db;" || echo "⚠️  Could not create database. Please create it manually: CREATE DATABASE rotation_db;"
    fi
else
    echo "⚠️  PostgreSQL not found. Using Docker..."
    if command -v docker &> /dev/null; then
        echo "🐳 Starting PostgreSQL with Docker..."
        docker run --name rotation-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=rotation_db -p 5432:5432 -d postgres:14-alpine 2>/dev/null || docker start rotation-postgres 2>/dev/null || echo "⚠️  Could not start PostgreSQL container"
    else
        echo "❌ PostgreSQL not found and Docker not available. Please install PostgreSQL or Docker."
        exit 1
    fi
fi

# Check if Redis is running
echo "🔍 Checking Redis..."
if command -v redis-server &> /dev/null; then
    if redis-cli ping &> /dev/null; then
        echo "✅ Redis is running"
    else
        echo "📦 Starting Redis..."
        redis-server --daemonize yes 2>/dev/null || echo "⚠️  Could not start Redis. Please start it manually: redis-server"
    fi
else
    echo "⚠️  Redis not found. Please install Redis: brew install redis"
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 2

# Run migrations
echo "🗄️  Running database migrations..."
# For now, we'll use psql directly since node-pg-migrate needs configuration
if command -v psql &> /dev/null; then
    echo "Running SQL migrations..."
    psql -U postgres -d rotation_db -f migrations/001_initial_schema.sql 2>/dev/null || echo "⚠️  Could not run migrations. Please run manually."
else
    echo "⚠️  psql not found. Please run migrations manually when database is ready."
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Make sure PostgreSQL is running on port 5432"
echo "   2. Make sure Redis is running on port 6379"
echo "   3. Run migrations: npm run migrate:up (or manually run migrations/001_initial_schema.sql)"
echo "   4. Start the server: npm run dev"
echo ""
echo "🔗 Server will be available at: http://localhost:3000"
echo "🔌 WebSocket will be available at: ws://localhost:3000"


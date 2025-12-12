#!/bin/bash

# Quick Start Script for ROTATION Backend
# This script will attempt to set up and start everything

set -e

echo "🚀 ROTATION Backend - Quick Start"
echo "=================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js not found. Please install Node.js 18+${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Node.js found: $(node --version)${NC}"

# Check Redis
if redis-cli ping &> /dev/null; then
    echo -e "${GREEN}✅ Redis is running${NC}"
else
    echo -e "${YELLOW}⚠️  Starting Redis...${NC}"
    redis-server --daemonize yes
    sleep 1
    if redis-cli ping &> /dev/null; then
        echo -e "${GREEN}✅ Redis started${NC}"
    else
        echo -e "${RED}❌ Failed to start Redis${NC}"
        exit 1
    fi
fi

# Check PostgreSQL
if command -v psql &> /dev/null; then
    # Try to connect
    if psql -U postgres -d postgres -c "SELECT 1;" &> /dev/null; then
        echo -e "${GREEN}✅ PostgreSQL is accessible${NC}"
        
        # Check if database exists
        if psql -U postgres -lqt | cut -d \| -f 1 | grep -qw rotation_db; then
            echo -e "${GREEN}✅ Database 'rotation_db' exists${NC}"
        else
            echo -e "${YELLOW}📦 Creating database 'rotation_db'...${NC}"
            createdb -U postgres rotation_db || psql -U postgres -c "CREATE DATABASE rotation_db;"
            echo -e "${GREEN}✅ Database created${NC}"
        fi
        
        # Run migrations
        echo -e "${YELLOW}🗄️  Running database migrations...${NC}"
        if psql -U postgres -d rotation_db -f migrations/001_initial_schema.sql &> /dev/null; then
            echo -e "${GREEN}✅ Migrations completed${NC}"
        else
            echo -e "${YELLOW}⚠️  Migrations may have already been run or there was an issue${NC}"
        fi
    else
        echo -e "${YELLOW}⚠️  PostgreSQL is installed but not accessible. Please ensure it's running:${NC}"
        echo "   brew services start postgresql@14"
        echo "   or"
        echo "   brew services start postgresql"
        exit 1
    fi
else
    echo -e "${YELLOW}⚠️  PostgreSQL not found.${NC}"
    echo ""
    echo "Please install PostgreSQL:"
    echo "  brew install postgresql@14"
    echo "  brew services start postgresql@14"
    echo "  createdb -U postgres rotation_db"
    echo ""
    echo "Then run this script again."
    exit 1
fi

# Check dependencies
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing dependencies...${NC}"
    npm install
fi

# Check .env file
if [ ! -f .env ]; then
    echo -e "${YELLOW}📝 Creating .env file...${NC}"
    cat > .env << 'ENVEOF'
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
ENVEOF
    echo -e "${GREEN}✅ .env file created${NC}"
fi

echo ""
echo -e "${GREEN}✅ All checks passed!${NC}"
echo ""
echo "🚀 Starting server..."
echo ""
echo "Server will be available at:"
echo "  📡 API: http://localhost:3000/api/v1"
echo "  🔌 WebSocket: ws://localhost:3000"
echo "  ❤️  Health: http://localhost:3000/health"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Start the server
npm run dev


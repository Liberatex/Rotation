#!/bin/bash

# Railway Deployment Preparation Script
# This script helps prepare your backend for Railway deployment

echo "🚂 Railway Deployment Preparation"
echo "=================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Check if we're in the backend directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: Must run from backend directory${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Backend directory detected${NC}"
echo ""

# Check if railway.json exists
if [ -f "railway.json" ]; then
    echo -e "${GREEN}✅ railway.json found${NC}"
else
    echo -e "${YELLOW}⚠️  railway.json not found, creating...${NC}"
    cat > railway.json << 'EOF'
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm run build"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
EOF
    echo -e "${GREEN}✅ Created railway.json${NC}"
fi

# Check package.json scripts
echo ""
echo "Checking package.json scripts..."
if grep -q '"build"' package.json && grep -q '"start"' package.json; then
    echo -e "${GREEN}✅ Build and start scripts found${NC}"
else
    echo -e "${RED}❌ Missing build or start scripts in package.json${NC}"
    exit 1
fi

# Generate JWT secrets
echo ""
echo "Generating secure JWT secrets..."
echo ""
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
JWT_REFRESH_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")

echo -e "${GREEN}✅ Secrets generated${NC}"
echo ""
echo "Copy these to Railway environment variables:"
echo ""
echo -e "${YELLOW}JWT_SECRET=${JWT_SECRET}${NC}"
echo ""
echo -e "${YELLOW}JWT_REFRESH_SECRET=${JWT_REFRESH_SECRET}${NC}"
echo ""

# Check if .env.example exists
if [ ! -f ".env.example" ]; then
    echo "Creating .env.example for reference..."
    cat > .env.example << 'EOF'
# Server Configuration
NODE_ENV=production
PORT=3000
API_VERSION=v1

# Database (Set by Railway PostgreSQL service)
DATABASE_URL=postgresql://user:password@host:5432/dbname

# Redis (Set by Railway Redis service)
REDIS_HOST=your-redis-host
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT Configuration (Generate secure secrets)
JWT_SECRET=your-secure-secret-here
JWT_REFRESH_SECRET=your-secure-refresh-secret-here
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# CORS Configuration
CORS_ORIGIN=*

# WebSocket Configuration
WS_PORT=3001

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
EOF
    echo -e "${GREEN}✅ Created .env.example${NC}"
fi

# Test build
echo ""
echo "Testing build..."
if npm run build > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Build successful${NC}"
else
    echo -e "${RED}❌ Build failed. Please fix errors before deploying.${NC}"
    exit 1
fi

# Summary
echo ""
echo "=================================="
echo -e "${GREEN}✅ Preparation Complete!${NC}"
echo "=================================="
echo ""
echo "Next steps:"
echo "1. Go to https://railway.app"
echo "2. Create new project → Deploy from GitHub"
echo "3. Set root directory to: backend"
echo "4. Add PostgreSQL database"
echo "5. Add Redis database"
echo "6. Set environment variables (use secrets above)"
echo "7. Deploy!"
echo ""
echo "See RAILWAY_DEPLOYMENT.md for detailed instructions"


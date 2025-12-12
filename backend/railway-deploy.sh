#!/bin/bash

# Railway Deployment Automation Script
# This script helps complete the Railway deployment

set -e

echo "🚂 Railway Deployment Automation"
echo "=================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo -e "${YELLOW}⚠️  Railway CLI not found. Installing...${NC}"
    npm install -g @railway/cli
    echo -e "${GREEN}✅ Railway CLI installed${NC}"
fi

echo -e "${GREEN}✅ Railway CLI ready${NC}"
echo ""

# Check if logged in
echo "Checking Railway login status..."
if railway whoami &> /dev/null; then
    echo -e "${GREEN}✅ Already logged in to Railway${NC}"
    railway whoami
else
    echo -e "${YELLOW}⚠️  Not logged in. Please login...${NC}"
    echo "This will open your browser for authentication"
    railway login
fi

echo ""
echo "=================================="
echo "Railway Project Setup"
echo "=================================="
echo ""

# Link to project
if [ -f ".railway/project.json" ]; then
    echo -e "${GREEN}✅ Already linked to Railway project${NC}"
    cat .railway/project.json
else
    echo -e "${YELLOW}⚠️  Not linked to Railway project${NC}"
    echo "Please select your project:"
    railway link
fi

echo ""
echo "=================================="
echo "Environment Variables"
echo "=================================="
echo ""

# Generate JWT secrets if not set
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
JWT_REFRESH_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")

echo "Generated JWT secrets:"
echo "JWT_SECRET=$JWT_SECRET"
echo "JWT_REFRESH_SECRET=$JWT_REFRESH_SECRET"
echo ""

# Set environment variables
echo "Setting environment variables in Railway..."
echo ""

railway variables set NODE_ENV=production
railway variables set PORT=3000
railway variables set API_VERSION=v1
railway variables set JWT_SECRET="$JWT_SECRET"
railway variables set JWT_REFRESH_SECRET="$JWT_REFRESH_SECRET"
railway variables set JWT_EXPIRES_IN=15m
railway variables set JWT_REFRESH_EXPIRES_IN=7d
railway variables set CORS_ORIGIN="*"
railway variables set WS_PORT=3001
railway variables set RATE_LIMIT_WINDOW_MS=900000
railway variables set RATE_LIMIT_MAX_REQUESTS=100

echo -e "${GREEN}✅ Environment variables set${NC}"
echo ""

# Verify variables
echo "Current environment variables:"
railway variables
echo ""

echo "=================================="
echo "Deployment"
echo "=================================="
echo ""

echo "Deploying to Railway..."
railway up

echo ""
echo -e "${GREEN}✅ Deployment initiated!${NC}"
echo ""
echo "Next steps:"
echo "1. Check Railway dashboard for deployment status"
echo "2. Wait for deployment to complete"
echo "3. Get your API URL from Railway dashboard"
echo "4. Run migrations: railway run psql \$DATABASE_URL -f migrations/001_initial_schema.sql"
echo "5. Test: curl https://your-app.up.railway.app/health"


# 🚂 Railway Deployment Guide - Step by Step

## Complete Guide to Deploy ROTATION Backend on Railway

---

## 📋 Prerequisites

- ✅ GitHub account
- ✅ Railway account (free to sign up)
- ✅ Your code pushed to GitHub

---

## 🚀 Step-by-Step Deployment

### Step 1: Create Railway Account

1. Go to **https://railway.app**
2. Click **"Start a New Project"** or **"Login"**
3. Sign up with **GitHub** (recommended for easy repo connection)
4. Authorize Railway to access your GitHub repositories

### Step 2: Create New Project

1. In Railway dashboard, click **"+ New Project"**
2. Select **"Deploy from GitHub repo"**
3. If prompted, authorize Railway to access your repositories
4. Find and select your **ROTATION** repository
5. Railway will start detecting your project

### Step 3: Configure Service

1. Railway will detect your backend folder
2. **Important**: Set the **Root Directory** to `backend`
   - Click on the service
   - Go to **Settings** tab
   - Under **Root Directory**, enter: `backend`
   - Click **Save**

### Step 4: Add PostgreSQL Database

1. In your Railway project, click **"+ New"**
2. Select **"Database"**
3. Choose **"Add PostgreSQL"**
4. Railway will automatically:
   - Create a PostgreSQL database
   - Generate connection string
   - Add it as `DATABASE_URL` environment variable

**Note**: The `DATABASE_URL` will be automatically available to your service!

### Step 5: Add Redis Database

1. Click **"+ New"** again
2. Select **"Database"**
3. Choose **"Add Redis"**
4. Railway will automatically:
   - Create a Redis instance
   - Generate connection details
   - Add `REDIS_HOST` and `REDIS_PORT` environment variables

### Step 6: Configure Environment Variables

1. Click on your **backend service**
2. Go to **Variables** tab
3. Add the following environment variables:

```bash
# Server Configuration
NODE_ENV=production
PORT=3000
API_VERSION=v1

# Database (Auto-set by Railway, but verify)
# DATABASE_URL should already be set from PostgreSQL
# If not, copy from PostgreSQL service → Connect → DATABASE_URL

# Redis (Auto-set by Railway, but verify)
# REDIS_HOST should already be set from Redis service
# REDIS_PORT should already be set (usually 6379)
# If not, copy from Redis service → Connect

# JWT Secrets (Generate these - see below)
JWT_SECRET=<generate-secure-secret>
JWT_REFRESH_SECRET=<generate-secure-secret>
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# CORS (Update with your frontend domain)
CORS_ORIGIN=*
# Or specific domains:
# CORS_ORIGIN=https://your-app.com,https://www.your-app.com

# WebSocket (Optional)
WS_PORT=3001

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Firebase (If using Firebase Auth)
FIREBASE_PROJECT_ID=
FIREBASE_PRIVATE_KEY=
FIREBASE_CLIENT_EMAIL=

# Stripe (If using payments)
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# AWS S3 (If using file storage)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=us-east-1
AWS_S3_BUCKET=
```

### Step 7: Generate Secure Secrets

Open your terminal and run:

```bash
# Generate JWT Secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Generate Refresh Secret (run again)
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copy the output and paste into Railway environment variables.

### Step 8: Configure Build Settings

1. In your service **Settings** tab
2. Verify **Build Command**: `npm install && npm run build`
3. Verify **Start Command**: `npm start`
4. Railway should auto-detect these from `package.json`

### Step 9: Run Database Migrations

**Option A: Using Railway CLI (Recommended)**

1. Install Railway CLI:
```bash
npm install -g @railway/cli
```

2. Login:
```bash
railway login
```

3. Link to your project:
```bash
railway link
# Select your project and service
```

4. Run migrations:
```bash
cd backend
railway run psql $DATABASE_URL -f migrations/001_initial_schema.sql
```

**Option B: Using Railway Dashboard**

1. Go to your PostgreSQL service
2. Click **"Connect"** tab
3. Copy the connection command
4. Use Railway's built-in PostgreSQL client or connect via external tool

**Option C: Manual SQL Execution**

1. Go to PostgreSQL service → **Connect** tab
2. Copy the `DATABASE_URL`
3. Use a PostgreSQL client (pgAdmin, DBeaver, etc.) to connect
4. Run the SQL from `migrations/001_initial_schema.sql`

### Step 10: Deploy!

Railway will automatically deploy when you:
- Push to your GitHub repository (if connected)
- Or click **"Deploy"** button in Railway dashboard

**Watch the deployment logs:**
- Click on your service
- Go to **Deployments** tab
- Watch the build and deployment process

### Step 11: Get Your API URL

1. After deployment completes, go to **Settings** tab
2. Under **Networking**, you'll see:
   - **Public Domain**: `https://your-app-name.up.railway.app`
   - Or generate a custom domain

3. Your API will be available at:
   ```
   https://your-app-name.up.railway.app
   ```

### Step 12: Test Your Deployment

```bash
# Health check
curl https://your-app-name.up.railway.app/health

# Expected response:
# {"success":true,"message":"ROTATION API is running","timestamp":"..."}
```

---

## 🔧 Railway-Specific Configuration

### Update railway.json (Already Created)

The `railway.json` file is already configured:
```json
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
```

### Verify package.json Scripts

Make sure your `package.json` has:
```json
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js"
  }
}
```

---

## 📱 Update Mobile App

After deployment, update your mobile app configuration:

**File**: `mobile/src/config/env.ts`

```typescript
const ENV = {
  dev: {
    apiUrl: 'http://localhost:3000/api/v1',
    wsUrl: 'http://localhost:3000',
  },
  staging: {
    apiUrl: 'https://your-railway-app.up.railway.app/api/v1',
    wsUrl: 'wss://your-railway-app.up.railway.app',
  },
  prod: {
    apiUrl: 'https://your-railway-app.up.railway.app/api/v1',
    wsUrl: 'wss://your-railway-app.up.railway.app',
  },
};
```

**Important**: Use `wss://` (secure WebSocket) for production!

---

## 🔍 Monitoring & Logs

### View Logs

1. In Railway dashboard, click your service
2. Go to **Deployments** tab
3. Click on latest deployment
4. View **Logs** tab for real-time logs

### Set Up Alerts

1. Go to **Settings** → **Notifications**
2. Configure email/Slack alerts for:
   - Deployment failures
   - Service crashes
   - High resource usage

---

## 🐛 Troubleshooting

### Build Fails

**Issue**: Build command fails
**Solution**: 
- Check logs for specific error
- Verify `npm install` completes
- Ensure TypeScript compiles: `npm run build`

### Database Connection Error

**Issue**: Can't connect to PostgreSQL
**Solution**:
- Verify `DATABASE_URL` is set correctly
- Check PostgreSQL service is running
- Verify connection string format

### Redis Connection Error

**Issue**: Can't connect to Redis
**Solution**:
- Verify `REDIS_HOST` and `REDIS_PORT` are set
- Check Redis service is running
- Test connection: `redis-cli -h $REDIS_HOST -p $REDIS_PORT ping`

### Port Issues

**Issue**: Service won't start
**Solution**:
- Railway sets `PORT` automatically
- Your app should use `process.env.PORT || 3000`
- Verify in your code: `const port = process.env.PORT || 3000`

### WebSocket Not Working

**Issue**: WebSocket connections fail
**Solution**:
- Railway supports WebSocket
- Use `wss://` (secure) for production
- Verify CORS allows WebSocket connections
- Check firewall/network settings

---

## 💰 Railway Pricing

### Free Tier
- ✅ $5 credit/month
- ✅ 500 hours of usage
- ✅ Perfect for development/testing

### Paid Plans
- **Hobby**: $5/month + usage
- **Pro**: $20/month + usage
- **Team**: Custom pricing

**Note**: PostgreSQL and Redis are included in usage costs.

---

## 🔄 Auto-Deploy Setup

Railway automatically deploys when you push to GitHub:

1. **Connect GitHub** (done in Step 2)
2. **Push to main branch**:
   ```bash
   git add .
   git commit -m "Deploy to Railway"
   git push origin main
   ```
3. Railway will automatically:
   - Detect the push
   - Build your application
   - Deploy to production

---

## 📊 Railway Dashboard Features

### Metrics
- CPU usage
- Memory usage
- Network traffic
- Request count

### Environment Variables
- View all variables
- Add/edit/delete variables
- Reference other services (e.g., `${{Postgres.DATABASE_URL}}`)

### Deployments
- View deployment history
- Rollback to previous version
- View deployment logs

---

## ✅ Deployment Checklist

Before going live:

- [ ] Railway account created
- [ ] Project created and connected to GitHub
- [ ] Root directory set to `backend`
- [ ] PostgreSQL database added
- [ ] Redis database added
- [ ] Environment variables configured
- [ ] JWT secrets generated and set
- [ ] Database migrations run
- [ ] Build successful
- [ ] Health endpoint responding
- [ ] API endpoints tested
- [ ] Mobile app API URL updated
- [ ] WebSocket tested (if using)
- [ ] CORS configured correctly
- [ ] Monitoring/alerts set up

---

## 🎯 Quick Reference

### Railway CLI Commands

```bash
# Install CLI
npm install -g @railway/cli

# Login
railway login

# Link to project
railway link

# View logs
railway logs

# Run command in Railway environment
railway run <command>

# Open shell in Railway
railway shell

# Deploy
railway up
```

### Important URLs

- **Railway Dashboard**: https://railway.app
- **Your API**: `https://your-app-name.up.railway.app`
- **Health Check**: `https://your-app-name.up.railway.app/health`

---

## 🚀 You're Ready!

Follow these steps and your ROTATION backend will be live on Railway in about 10-15 minutes!

**Need help?** Check Railway docs: https://docs.railway.app

---

**Next**: After deployment, test your API and update your mobile app! 🎉


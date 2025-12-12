# 🚂 Railway Deployment - Complete Setup Guide

## Current Status
You've completed steps 1-5. Let's complete the rest!

---

## ✅ Steps Completed
- [x] Step 1: Signed up on Railway
- [x] Step 2: Created new project
- [x] Step 3: Connected GitHub repo
- [x] Step 4: Selected ROTATION repository
- [x] Step 5: Started deployment

---

## 🔧 Step 6: Configure Root Directory (CRITICAL)

**This is likely where it failed!**

1. In Railway dashboard, click on your **service** (the one that's deploying)
2. Go to **Settings** tab
3. Scroll down to **Root Directory**
4. **IMPORTANT**: Set it to: `backend`
5. Click **Save**
6. Railway will automatically redeploy

**Why this matters**: Railway needs to know your backend code is in the `backend` folder, not the root.

---

## 🗄️ Step 7: Add PostgreSQL Database

1. In your Railway project dashboard, click **"+ New"**
2. Select **"Database"**
3. Choose **"Add PostgreSQL"**
4. Railway will automatically:
   - Create PostgreSQL database
   - Generate `DATABASE_URL` environment variable
   - Link it to your service

**Verify it's connected:**
- Go to your backend service → **Variables** tab
- You should see `DATABASE_URL` automatically added
- It should look like: `postgresql://postgres:password@host:5432/railway`

---

## 🔴 Step 8: Add Redis Database

1. Click **"+ New"** again
2. Select **"Database"**
3. Choose **"Add Redis"**
4. Railway will automatically:
   - Create Redis instance
   - Generate `REDIS_HOST` and `REDIS_PORT` variables
   - Link it to your service

**Verify it's connected:**
- Go to your backend service → **Variables** tab
- You should see `REDIS_HOST` and `REDIS_PORT` automatically added

---

## 🔑 Step 9: Set Required Environment Variables

1. Click on your **backend service**
2. Go to **Variables** tab
3. Click **"+ New Variable"** for each:

### Required Variables:

```bash
NODE_ENV=production
PORT=3000
API_VERSION=v1
JWT_SECRET=<generate-below>
JWT_REFRESH_SECRET=<generate-below>
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
CORS_ORIGIN=*
WS_PORT=3001
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Generate JWT Secrets:

Open your terminal and run these commands:

```bash
# Generate JWT Secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Generate Refresh Secret (run again)
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copy each output and paste into Railway as `JWT_SECRET` and `JWT_REFRESH_SECRET`.

---

## 🔍 Step 10: Verify Build Settings

1. In your service → **Settings** tab
2. Verify these are set correctly:

**Build Command:**
```
npm install && npm run build
```

**Start Command:**
```
npm start
```

**Root Directory:**
```
backend
```

If any are wrong, fix them and Railway will redeploy.

---

## 📊 Step 11: Monitor Deployment

1. Go to **Deployments** tab
2. Click on the latest deployment
3. Watch the **Logs** tab

**What to look for:**
- ✅ `npm install` completes successfully
- ✅ `npm run build` completes (TypeScript compilation)
- ✅ `npm start` starts the server
- ✅ Server listening on port 3000
- ❌ Any errors (red text)

**Common issues:**
- **Build fails**: Check logs for TypeScript errors
- **Port error**: Railway sets PORT automatically, your code should use `process.env.PORT`
- **Database error**: Verify `DATABASE_URL` is set correctly

---

## 🗄️ Step 12: Run Database Migrations

After deployment succeeds, run migrations:

### Option A: Using Railway CLI (Recommended)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login
# This will open browser for authentication

# Link to your project
railway link
# Select your project and service when prompted

# Run migrations
cd backend
railway run psql $DATABASE_URL -f migrations/001_initial_schema.sql
```

### Option B: Using Railway Dashboard

1. Go to your **PostgreSQL** service
2. Click **"Connect"** tab
3. Copy the connection string
4. Use a PostgreSQL client (pgAdmin, DBeaver, etc.) to connect
5. Run the SQL from `migrations/001_initial_schema.sql`

### Option C: Using Railway Shell

1. In Railway dashboard, go to your backend service
2. Click **"Deployments"** → Latest deployment
3. Click **"Shell"** tab
4. Run:
```bash
psql $DATABASE_URL -f migrations/001_initial_schema.sql
```

---

## 🌐 Step 13: Get Your API URL

1. Go to your backend service → **Settings** tab
2. Scroll to **Networking** section
3. You'll see:
   - **Public Domain**: `https://your-app-name.up.railway.app`
   - Or click **"Generate Domain"** if not visible

**Your API will be at:**
```
https://your-app-name.up.railway.app
```

---

## 🧪 Step 14: Test Your Deployment

```bash
# Health check
curl https://your-app-name.up.railway.app/health

# Expected response:
# {"success":true,"message":"ROTATION API is running","timestamp":"..."}
```

**Test user registration:**
```bash
curl -X POST https://your-app-name.up.railway.app/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "firebaseUid": "test-uid-123",
    "displayName": "Test User"
  }'
```

---

## 🐛 Troubleshooting Common Issues

### Issue: Build Fails

**Symptoms**: Deployment shows "Build Failed"

**Solutions**:
1. Check deployment logs for specific errors
2. Verify `npm run build` works locally:
   ```bash
   cd backend
   npm install
   npm run build
   ```
3. Check for TypeScript errors
4. Verify all dependencies are in `package.json`

### Issue: Service Won't Start

**Symptoms**: Build succeeds but service crashes

**Solutions**:
1. Check logs for runtime errors
2. Verify `DATABASE_URL` is set correctly
3. Verify `REDIS_HOST` and `REDIS_PORT` are set
4. Check if port is correct (Railway sets it automatically)

### Issue: Database Connection Error

**Symptoms**: Logs show "Database connection error"

**Solutions**:
1. Verify PostgreSQL service is running
2. Check `DATABASE_URL` format is correct
3. Verify database exists
4. Check if migrations have been run

### Issue: Root Directory Not Set

**Symptoms**: Railway can't find `package.json`

**Solutions**:
1. Go to Settings → Root Directory
2. Set to: `backend`
3. Save and redeploy

---

## ✅ Deployment Checklist

Before considering deployment complete:

- [ ] Root directory set to `backend`
- [ ] PostgreSQL database added and connected
- [ ] Redis database added and connected
- [ ] All environment variables set
- [ ] JWT secrets generated and set
- [ ] Build completes successfully
- [ ] Service starts without errors
- [ ] Database migrations run
- [ ] Health endpoint responds (`/health`)
- [ ] API endpoints work (test `/api/v1/auth/register`)
- [ ] API URL copied for mobile app

---

## 📱 Step 15: Update Mobile App

After successful deployment, update your mobile app:

**File**: `mobile/src/config/env.ts`

```typescript
const ENV = {
  dev: {
    apiUrl: 'http://localhost:3000/api/v1',
    wsUrl: 'http://localhost:3000',
  },
  staging: {
    apiUrl: 'https://your-app-name.up.railway.app/api/v1',
    wsUrl: 'wss://your-app-name.up.railway.app',  // Note: wss:// for secure WebSocket
  },
  prod: {
    apiUrl: 'https://your-app-name.up.railway.app/api/v1',
    wsUrl: 'wss://your-app-name.up.railway.app',
  },
};
```

**Important**: Use `wss://` (secure WebSocket) for production, not `ws://`

---

## 🎉 Success Indicators

Your deployment is successful when:

1. ✅ Deployment shows "Active" status
2. ✅ Health check returns success
3. ✅ API endpoints respond correctly
4. ✅ Database migrations completed
5. ✅ No errors in logs

---

## 🆘 Still Having Issues?

1. **Check Railway Logs**: Go to Deployments → Latest → Logs
2. **Verify Configuration**: Double-check all environment variables
3. **Test Locally**: Make sure everything works locally first
4. **Railway Support**: Check Railway docs or support

---

## 📞 Quick Reference

- **Railway Dashboard**: https://railway.app
- **Your API**: `https://your-app-name.up.railway.app`
- **Health Check**: `https://your-app-name.up.railway.app/health`
- **Railway Docs**: https://docs.railway.app

---

**Follow these steps carefully and your deployment will succeed!** 🚀


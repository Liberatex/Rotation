# 🚂 Complete Railway Deployment - Automated

## ✅ You've Connected Railway to GitHub - Let's Finish!

Since Railway is already connected to your GitHub repo, let's complete the deployment.

---

## 🎯 Quick Complete Process

### Option 1: Use Railway CLI (Automated)

I've created an automated script. Run this:

```bash
cd /Users/liberatex/Desktop/ROTATION/backend
./railway-deploy.sh
```

This will:
- ✅ Install Railway CLI (if needed)
- ✅ Login to Railway
- ✅ Link to your project
- ✅ Set all environment variables
- ✅ Deploy your app

### Option 2: Manual Steps (If CLI doesn't work)

---

## 📋 Complete Checklist

### Step 1: Verify Root Directory (CRITICAL!)

**In Railway Dashboard:**
1. Click your **service**
2. **Settings** tab
3. **Root Directory** = `backend`
4. **Save**

### Step 2: Add Databases

**PostgreSQL:**
1. Click **"+ New"** → **"Database"** → **"Add PostgreSQL"**
2. Wait for it to create
3. `DATABASE_URL` auto-added to your service

**Redis:**
1. Click **"+ New"** → **"Database"** → **"Add Redis"**
2. Wait for it to create
3. `REDIS_HOST` and `REDIS_PORT` auto-added

### Step 3: Set Environment Variables

**In Railway Dashboard → Your Service → Variables:**

Add these one by one:

```
NODE_ENV=production
PORT=3000
API_VERSION=v1
JWT_SECRET=0c4cc6ca11b300639abc9b73e9c555c4249a8c93a665b50f0af8fb84b6d55388f21486fd1c313ddb1bec3208bc58c780c5bf4fd8997f2eabb7ae56f9344a850f
JWT_REFRESH_SECRET=8304b3437e5ab9e7cc7f1d131c80f815125f8d12ecbb857fe83ff365c12d15118c0b0505420b5d56ba0ce5699d8bc3cc0b3f33a9784ed65945c6d7896939b704
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
CORS_ORIGIN=*
WS_PORT=3001
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Step 4: Monitor Deployment

1. Go to **Deployments** tab
2. Watch the latest deployment
3. Check **Logs** tab
4. Wait for "Active" status

### Step 5: Get API URL

1. **Settings** tab → **Networking**
2. Copy **Public Domain**: `https://your-app.up.railway.app`

### Step 6: Run Migrations

```bash
cd /Users/liberatex/Desktop/ROTATION/backend

# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to project
railway link

# Run migrations
railway run psql $DATABASE_URL -f migrations/001_initial_schema.sql
```

### Step 7: Test

```bash
curl https://your-app.up.railway.app/health
```

---

## 🚀 Fastest Way: Use the Script

Just run:

```bash
cd /Users/liberatex/Desktop/ROTATION/backend
./railway-deploy.sh
```

This automates most of the process!

---

## ✅ Success Indicators

- ✅ Deployment shows "Active"
- ✅ Health endpoint responds
- ✅ No errors in logs
- ✅ Database migrations completed

---

**Ready? Run the script or follow the manual steps above!** 🚀


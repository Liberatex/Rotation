# 🚂 Railway Deployment - Step by Step (Visual Guide)

## 🎯 Follow These Exact Steps

---

## Step 1-5: ✅ Already Done
You've completed connecting Railway to GitHub. Great!

---

## Step 6: 🔴 CRITICAL - Set Root Directory

**This is the #1 reason deployments fail!**

### Visual Guide:

```
Railway Dashboard
├── Your Project
    └── Your Service (backend)
        └── Settings Tab
            └── Root Directory: [backend] ← SET THIS!
```

### Actions:
1. Click on your **service** (should show "Deploying" or "Failed")
2. Click **Settings** tab (left sidebar)
3. Scroll down to **"Root Directory"**
4. **Delete** whatever is there (might be empty or "/")
5. Type: `backend`
6. Click **"Save"** button
7. Railway will automatically redeploy

**✅ Success**: You'll see a new deployment start automatically

---

## Step 7: Add PostgreSQL Database

### Visual Guide:

```
Railway Dashboard
├── Your Project
    └── [+ New] Button (top right)
        └── Database
            └── Add PostgreSQL
```

### Actions:
1. Click **"+ New"** button (top right of project)
2. Select **"Database"**
3. Choose **"Add PostgreSQL"**
4. Wait 30-60 seconds for it to create
5. You'll see a new PostgreSQL service appear

**✅ Success**: You'll see a green PostgreSQL service in your project

**Verify**: 
- Click your backend service → Variables tab
- You should see `DATABASE_URL` automatically added

---

## Step 8: Add Redis Database

### Visual Guide:

```
Railway Dashboard
├── Your Project
    └── [+ New] Button
        └── Database
            └── Add Redis
```

### Actions:
1. Click **"+ New"** again
2. Select **"Database"**
3. Choose **"Add Redis"**
4. Wait 30-60 seconds
5. You'll see a new Redis service appear

**✅ Success**: You'll see a red Redis service in your project

**Verify**:
- Click your backend service → Variables tab
- You should see `REDIS_HOST` and `REDIS_PORT` automatically added

---

## Step 9: Set Environment Variables

### Visual Guide:

```
Backend Service
└── Variables Tab
    └── [+ New Variable] Button
        └── Add each variable one by one
```

### Actions:

1. Click on your **backend service**
2. Click **Variables** tab
3. Click **"+ New Variable"** button
4. For each variable, enter:

**Variable 1:**
- Name: `NODE_ENV`
- Value: `production`
- Click **"Add"**

**Variable 2:**
- Name: `PORT`
- Value: `3000`
- Click **"Add"**

**Variable 3:**
- Name: `API_VERSION`
- Value: `v1`
- Click **"Add"**

**Variable 4:**
- Name: `JWT_SECRET`
- Value: `0c4cc6ca11b300639abc9b73e9c555c4249a8c93a665b50f0af8fb84b6d55388f21486fd1c313ddb1bec3208bc58c780c5bf4fd8997f2eabb7ae56f9344a850f`
- Click **"Add"**

**Variable 5:**
- Name: `JWT_REFRESH_SECRET`
- Value: `8304b3437e5ab9e7cc7f1d131c80f815125f8d12ecbb857fe83ff365c12d15118c0b0505420b5d56ba0ce5699d8bc3cc0b3f33a9784ed65945c6d7896939b704`
- Click **"Add"**

**Variable 6:**
- Name: `JWT_EXPIRES_IN`
- Value: `15m`
- Click **"Add"**

**Variable 7:**
- Name: `JWT_REFRESH_EXPIRES_IN`
- Value: `7d`
- Click **"Add"`

**Variable 8:**
- Name: `CORS_ORIGIN`
- Value: `*`
- Click **"Add"`

**Variable 9:**
- Name: `WS_PORT`
- Value: `3001`
- Click **"Add"`

**Variable 10:**
- Name: `RATE_LIMIT_WINDOW_MS`
- Value: `900000`
- Click **"Add"`

**Variable 11:**
- Name: `RATE_LIMIT_MAX_REQUESTS`
- Value: `100`
- Click **"Add"`

**✅ Success**: You should see all 11 variables listed, plus `DATABASE_URL`, `REDIS_HOST`, `REDIS_PORT` (auto-added)

---

## Step 10: Monitor Deployment

### Visual Guide:

```
Backend Service
└── Deployments Tab
    └── Latest Deployment
        └── Logs Tab (watch here)
```

### Actions:

1. Click **Deployments** tab
2. Click on the **latest deployment** (top of list)
3. Click **Logs** tab
4. Watch the logs scroll

**What you should see:**

```
✓ Installing dependencies...
✓ Building application...
> rotation-backend@1.0.0 build
> tsc

✓ Starting server...
🚀 Server running on port 3000
```

**If you see errors:**
- Copy the error message
- Check what step failed
- Common issues:
  - "Cannot find module" → Root directory not set
  - "Port already in use" → Shouldn't happen, Railway handles ports
  - "Database connection error" → DATABASE_URL not set correctly

---

## Step 11: Get Your API URL

### Visual Guide:

```
Backend Service
└── Settings Tab
    └── Networking Section
        └── Public Domain: https://your-app.up.railway.app
```

### Actions:

1. Go to **Settings** tab
2. Scroll to **Networking** section
3. You'll see **Public Domain**
4. Copy the URL (looks like: `https://rotation-production.up.railway.app`)

**If you don't see a domain:**
- Click **"Generate Domain"** button
- Railway will create one for you

**✅ Success**: You have your API URL!

---

## Step 12: Test Your API

Open terminal and run:

```bash
curl https://your-app-name.up.railway.app/health
```

**Expected response:**
```json
{"success":true,"message":"ROTATION API is running","timestamp":"2024-12-11T..."}
```

**✅ Success**: Your API is live!

**❌ If it fails:**
- Check deployment logs
- Verify service status is "Active"
- Check if deployment completed successfully

---

## Step 13: Run Database Migrations

### Using Railway CLI:

```bash
# 1. Install CLI
npm install -g @railway/cli

# 2. Login (opens browser)
railway login

# 3. Link to project
cd /Users/liberatex/Desktop/ROTATION/backend
railway link
# Select your project when prompted

# 4. Run migrations
railway run psql $DATABASE_URL -f migrations/001_initial_schema.sql
```

**✅ Success**: You'll see "CREATE TABLE" messages

---

## ✅ Final Checklist

Before considering deployment complete:

- [ ] Root directory = `backend` (CRITICAL!)
- [ ] PostgreSQL added and connected
- [ ] Redis added and connected
- [ ] All 11 environment variables set
- [ ] Deployment shows "Active" status
- [ ] Health endpoint works: `/health`
- [ ] Database migrations run
- [ ] API URL copied

---

## 🎉 Success!

Once all steps are complete:

1. ✅ Your API is live at: `https://your-app.up.railway.app`
2. ✅ WebSocket works at: `wss://your-app.up.railway.app`
3. ✅ Database is set up and migrated
4. ✅ Ready to connect mobile app!

---

## 🆘 Need Help?

**Most Common Issues:**

1. **"Cannot find package.json"**
   → Root Directory not set to `backend`

2. **"Build failed"**
   → Check logs for TypeScript errors
   → Verify `npm run build` works locally

3. **"Database connection error"**
   → Verify PostgreSQL is added
   → Check `DATABASE_URL` is in Variables

4. **"Service won't start"**
   → Check all environment variables are set
   → Verify PORT is set (Railway sets it automatically)

---

**Follow these steps exactly and your deployment will succeed!** 🚀


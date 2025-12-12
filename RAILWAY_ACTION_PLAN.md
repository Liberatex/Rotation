# 🚂 Railway Deployment - Action Plan

## ⚠️ Most Common Issue: Root Directory Not Set!

**90% of Railway deployment failures are because Root Directory isn't set to `backend`**

---

## 🎯 Complete These Steps Now

### ✅ Step 6: Fix Root Directory (DO THIS FIRST!)

1. **In Railway Dashboard**:
   - Click on your **service** (the backend service)
   - Go to **Settings** tab
   - Scroll down to **"Root Directory"**
   - **Change it to**: `backend`
   - Click **"Save"**
   - Railway will automatically redeploy

**This single fix solves most deployment issues!**

---

### ✅ Step 7: Add PostgreSQL Database

1. In Railway project, click **"+ New"**
2. Select **"Database"**
3. Choose **"Add PostgreSQL"**
4. Wait for it to create (takes ~30 seconds)
5. Railway automatically adds `DATABASE_URL` to your service

**Verify**: Go to your service → Variables tab → Should see `DATABASE_URL`

---

### ✅ Step 8: Add Redis Database

1. Click **"+ New"** again
2. Select **"Database"**
3. Choose **"Add Redis"**
4. Wait for it to create
5. Railway automatically adds `REDIS_HOST` and `REDIS_PORT`

**Verify**: Go to your service → Variables tab → Should see `REDIS_HOST` and `REDIS_PORT`

---

### ✅ Step 9: Add Environment Variables

1. Go to your **backend service**
2. Click **Variables** tab
3. Click **"+ New Variable"** for each:

**Copy and paste these exactly:**

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

**Important**: 
- Add each variable separately
- Use the exact values above (JWT secrets are pre-generated)
- Don't include the `=` in the variable name field

---

### ✅ Step 10: Monitor Deployment

1. Go to **Deployments** tab
2. Click on the **latest deployment**
3. Watch the **Logs** tab

**What you should see:**
```
✓ Installing dependencies...
✓ Building application...
✓ Starting server...
Server running on port 3000
```

**If you see errors:**
- Copy the error message
- Check `RAILWAY_FIX_CHECKLIST.md` for solutions

---

### ✅ Step 11: Get Your API URL

1. Go to **Settings** tab
2. Scroll to **Networking** section
3. You'll see: **Public Domain**
4. Copy the URL: `https://your-app-name.up.railway.app`

**If you don't see a domain:**
- Click **"Generate Domain"**
- Railway will create one for you

---

### ✅ Step 12: Test Your API

Open your terminal and run:

```bash
curl https://your-app-name.up.railway.app/health
```

**Expected response:**
```json
{"success":true,"message":"ROTATION API is running","timestamp":"..."}
```

**If it works**: ✅ Your API is live!

**If it doesn't work**: Check the deployment logs for errors

---

### ✅ Step 13: Run Database Migrations

**Option 1: Using Railway CLI (Easiest)**

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login (opens browser)
railway login

# Link to your project
railway link
# Select your project when prompted

# Run migrations
cd /Users/liberatex/Desktop/ROTATION/backend
railway run psql $DATABASE_URL -f migrations/001_initial_schema.sql
```

**Option 2: Using Railway Dashboard**

1. Go to your **PostgreSQL** service
2. Click **"Connect"** tab
3. Copy the connection details
4. Use a PostgreSQL client to connect
5. Run the SQL from `migrations/001_initial_schema.sql`

---

## ✅ Success Checklist

Your deployment is successful when:

- [ ] Root directory set to `backend`
- [ ] PostgreSQL database added
- [ ] Redis database added
- [ ] All environment variables set
- [ ] Deployment shows "Active" status
- [ ] Health endpoint responds: `/health`
- [ ] Database migrations run
- [ ] API URL copied

---

## 🐛 If Something Fails

1. **Check Root Directory**: Must be `backend` ⚠️
2. **Check Logs**: Go to Deployments → Latest → Logs
3. **Check Variables**: All required variables must be set
4. **Check Databases**: Both PostgreSQL and Redis must be added

**Most common fixes:**
- Set Root Directory to `backend`
- Verify all environment variables are set
- Check deployment logs for specific errors

---

## 📱 After Deployment Succeeds

Update your mobile app:

**File**: `mobile/src/config/env.ts`

```typescript
prod: {
  apiUrl: 'https://your-app-name.up.railway.app/api/v1',
  wsUrl: 'wss://your-app-name.up.railway.app',
}
```

---

## 🎉 You're Done!

Once all steps are complete, your API will be live and ready to use!

**Need help?** Check `RAILWAY_COMPLETE_SETUP.md` for detailed instructions.


# 🚂 Railway Dashboard - Complete Setup (5 Minutes)

## ✅ Railway is Connected to GitHub - Complete These Steps

---

## 🔴 STEP 1: Set Root Directory (CRITICAL - Do This First!)

**This fixes 90% of deployment issues!**

1. **Go to Railway Dashboard**: https://railway.app
2. **Click on your project** (should show "Rotation" or similar)
3. **Click on your service** (the one that's deploying/failed)
4. **Click "Settings" tab** (left sidebar)
5. **Scroll down** to find "Root Directory"
6. **Click in the field** and type: `backend`
7. **Click "Save"** button
8. Railway will **automatically redeploy**

**✅ Success**: You'll see a new deployment start automatically

---

## 🗄️ STEP 2: Add PostgreSQL Database

1. **In your Railway project**, click **"+ New"** button (top right)
2. **Select "Database"**
3. **Choose "Add PostgreSQL"**
4. **Wait 30-60 seconds** for it to create
5. You'll see a new **green PostgreSQL service** appear

**✅ Verify**: 
- Click your backend service → **Variables** tab
- You should see `DATABASE_URL` automatically added (Railway does this)

---

## 🔴 STEP 3: Add Redis Database

1. **Click "+ New"** again (top right)
2. **Select "Database"**
3. **Choose "Add Redis"**
4. **Wait 30-60 seconds** for it to create
5. You'll see a new **red Redis service** appear

**✅ Verify**:
- Click your backend service → **Variables** tab
- You should see `REDIS_HOST` and `REDIS_PORT` automatically added

---

## 🔑 STEP 4: Set Environment Variables

1. **Click on your backend service**
2. **Click "Variables" tab**
3. **Click "+ New Variable"** button
4. **Add each variable one by one** (copy exactly):

### Variable 1:
- **Name**: `NODE_ENV`
- **Value**: `production`
- Click **"Add"**

### Variable 2:
- **Name**: `PORT`
- **Value**: `3000`
- Click **"Add"**

### Variable 3:
- **Name**: `API_VERSION`
- **Value**: `v1`
- Click **"Add"**

### Variable 4:
- **Name**: `JWT_SECRET`
- **Value**: `0c4cc6ca11b300639abc9b73e9c555c4249a8c93a665b50f0af8fb84b6d55388f21486fd1c313ddb1bec3208bc58c780c5bf4fd8997f2eabb7ae56f9344a850f`
- Click **"Add"**

### Variable 5:
- **Name**: `JWT_REFRESH_SECRET`
- **Value**: `8304b3437e5ab9e7cc7f1d131c80f815125f8d12ecbb857fe83ff365c12d15118c0b0505420b5d56ba0ce5699d8bc3cc0b3f33a9784ed65945c6d7896939b704`
- Click **"Add"**

### Variable 6:
- **Name**: `JWT_EXPIRES_IN`
- **Value**: `15m`
- Click **"Add"**

### Variable 7:
- **Name**: `JWT_REFRESH_EXPIRES_IN`
- **Value**: `7d`
- Click **"Add"`

### Variable 8:
- **Name**: `CORS_ORIGIN`
- **Value**: `*`
- Click **"Add"**

### Variable 9:
- **Name**: `WS_PORT`
- **Value**: `3001`
- Click **"Add"**

### Variable 10:
- **Name**: `RATE_LIMIT_WINDOW_MS`
- **Value**: `900000`
- Click **"Add"**

### Variable 11:
- **Name**: `RATE_LIMIT_MAX_REQUESTS`
- **Value**: `100`
- Click **"Add"**

**✅ Verify**: 
- You should see all 11 variables listed
- Plus `DATABASE_URL`, `REDIS_HOST`, `REDIS_PORT` (auto-added by Railway)

---

## 📊 STEP 5: Monitor Deployment

1. **Click "Deployments" tab**
2. **Click on the latest deployment** (top of list)
3. **Click "Logs" tab**
4. **Watch the logs** scroll

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
- Common fixes:
  - "Cannot find package.json" → Root Directory not set to `backend`
  - "Build failed" → Check logs for TypeScript errors
  - "Database error" → Verify PostgreSQL is added

---

## 🌐 STEP 6: Get Your API URL

1. **Go to "Settings" tab**
2. **Scroll to "Networking" section**
3. **You'll see "Public Domain"**
4. **Copy the URL**: `https://your-app-name.up.railway.app`

**If you don't see a domain:**
- Click **"Generate Domain"** button
- Railway will create one for you

---

## 🧪 STEP 7: Test Your API

Open your terminal and run:

```bash
curl https://your-app-name.up.railway.app/health
```

**Expected response:**
```json
{"success":true,"message":"ROTATION API is running","timestamp":"..."}
```

**✅ If this works**: Your API is live!

---

## 🗄️ STEP 8: Run Database Migrations

### Using Railway Dashboard:

1. **Go to your PostgreSQL service**
2. **Click "Connect" tab**
3. **Copy the connection string** (looks like: `postgresql://postgres:password@host:5432/railway`)

### Then run migrations using Railway CLI:

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login (opens browser)
railway login

# Link to your project
cd /Users/liberatex/Desktop/ROTATION/backend
railway link
# Select your project when prompted

# Run migrations
railway run psql $DATABASE_URL -f migrations/001_initial_schema.sql
```

**✅ Success**: You'll see "CREATE TABLE" messages

---

## ✅ Final Checklist

Before considering deployment complete:

- [ ] Root directory = `backend` (CRITICAL!)
- [ ] PostgreSQL database added
- [ ] Redis database added
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
3. ✅ Database is set up
4. ✅ Ready to connect mobile app!

---

## 📱 Update Mobile App

After deployment succeeds, update `mobile/src/config/env.ts`:

```typescript
prod: {
  apiUrl: 'https://your-app-name.up.railway.app/api/v1',
  wsUrl: 'wss://your-app-name.up.railway.app',
}
```

---

## 🆘 Troubleshooting

**Deployment shows "Failed":**
- Check Root Directory is set to `backend`
- Check all environment variables are set
- Check deployment logs for specific errors

**Health endpoint doesn't work:**
- Verify deployment is "Active"
- Check service is running (not crashed)
- Verify PORT is set correctly

**Database connection error:**
- Verify PostgreSQL is added
- Check `DATABASE_URL` is in Variables
- Verify migrations have been run

---

**Follow these steps exactly and your deployment will succeed!** 🚀


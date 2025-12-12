# 🔧 Railway Deployment Fix Checklist

## Most Common Issue: Root Directory Not Set

### ✅ Fix This First!

1. **Go to Railway Dashboard**
2. **Click on your service** (the one deploying)
3. **Go to Settings tab**
4. **Scroll to "Root Directory"**
5. **Set it to**: `backend`
6. **Click Save**
7. **Railway will auto-redeploy**

This fixes 90% of deployment issues!

---

## Step-by-Step Fix Process

### 1. Verify Root Directory ✅
- [ ] Service Settings → Root Directory = `backend`
- [ ] Saved and redeployed

### 2. Check Build Logs ✅
- [ ] Go to Deployments → Latest → Logs
- [ ] Look for errors (red text)
- [ ] Verify `npm install` completes
- [ ] Verify `npm run build` completes
- [ ] Verify `npm start` runs

### 3. Add Databases ✅
- [ ] PostgreSQL added (+ New → Database → PostgreSQL)
- [ ] Redis added (+ New → Database → Redis)
- [ ] Both show as "Connected" in service

### 4. Set Environment Variables ✅
- [ ] Go to Variables tab
- [ ] Add all required variables (see RAILWAY_ENV_VARS.txt)
- [ ] Generate JWT secrets
- [ ] Verify DATABASE_URL is auto-set
- [ ] Verify REDIS_HOST and REDIS_PORT are auto-set

### 5. Verify Build Settings ✅
- [ ] Build Command: `npm install && npm run build`
- [ ] Start Command: `npm start`
- [ ] Root Directory: `backend`

### 6. Run Migrations ✅
- [ ] Install Railway CLI: `npm install -g @railway/cli`
- [ ] Login: `railway login`
- [ ] Link: `railway link`
- [ ] Run: `railway run psql $DATABASE_URL -f migrations/001_initial_schema.sql`

### 7. Test Deployment ✅
- [ ] Get API URL from Settings → Networking
- [ ] Test: `curl https://your-app.up.railway.app/health`
- [ ] Should return: `{"success":true,"message":"ROTATION API is running"}`

---

## Quick Fix Commands

If you have Railway CLI installed:

```bash
# Check service status
railway status

# View logs
railway logs

# Open shell
railway shell

# Run migrations
railway run psql $DATABASE_URL -f migrations/001_initial_schema.sql
```

---

## What to Check in Railway Dashboard

### Service Status
- Should show: **"Active"** or **"Deploying"**
- If **"Failed"**: Check logs for errors

### Deployment Logs
- Look for: `npm install` → `npm run build` → `npm start`
- Check for: Red error messages
- Verify: Server starts successfully

### Variables Tab
- Must have: `DATABASE_URL` (from PostgreSQL)
- Must have: `REDIS_HOST` (from Redis)
- Must have: `REDIS_PORT` (from Redis)
- Must have: `JWT_SECRET` (you set this)
- Must have: `JWT_REFRESH_SECRET` (you set this)

### Settings Tab
- Root Directory: `backend` ⚠️ CRITICAL
- Build Command: `npm install && npm run build`
- Start Command: `npm start`

---

## Still Not Working?

1. **Check the exact error** in deployment logs
2. **Verify local build works**:
   ```bash
   cd backend
   npm install
   npm run build
   npm start
   ```
3. **Check Railway status page**: https://status.railway.app
4. **Review Railway docs**: https://docs.railway.app

---

**Most likely fix**: Set Root Directory to `backend` in Settings! 🎯


# 🚂 Railway Deployment - Quick Reference Card

## ⚡ Complete in 5 Minutes

---

## 🔴 STEP 1: Root Directory (DO THIS FIRST!)

**Railway Dashboard:**
1. Your Service → **Settings**
2. **Root Directory**: `backend`
3. **Save** → Auto-redeploys

---

## 🗄️ STEP 2: Add Databases

**PostgreSQL:**
- `+ New` → `Database` → `Add PostgreSQL`
- Wait 30 seconds

**Redis:**
- `+ New` → `Database` → `Add Redis`
- Wait 30 seconds

---

## 🔑 STEP 3: Environment Variables

**Your Service → Variables → + New Variable**

Add these 11 variables:

| Name | Value |
|------|-------|
| `NODE_ENV` | `production` |
| `PORT` | `3000` |
| `API_VERSION` | `v1` |
| `JWT_SECRET` | `0c4cc6ca11b300639abc9b73e9c555c4249a8c93a665b50f0af8fb84b6d55388f21486fd1c313ddb1bec3208bc58c780c5bf4fd8997f2eabb7ae56f9344a850f` |
| `JWT_REFRESH_SECRET` | `8304b3437e5ab9e7cc7f1d131c80f815125f8d12ecbb857fe83ff365c12d15118c0b0505420b5d56ba0ce5699d8bc3cc0b3f33a9784ed65945c6d7896939b704` |
| `JWT_EXPIRES_IN` | `15m` |
| `JWT_REFRESH_EXPIRES_IN` | `7d` |
| `CORS_ORIGIN` | `*` |
| `WS_PORT` | `3001` |
| `RATE_LIMIT_WINDOW_MS` | `900000` |
| `RATE_LIMIT_MAX_REQUESTS` | `100` |

**Note**: `DATABASE_URL`, `REDIS_HOST`, `REDIS_PORT` are auto-added by Railway

---

## 📊 STEP 4: Monitor & Get URL

**Monitor:**
- Deployments → Latest → Logs
- Wait for "Active" status

**Get URL:**
- Settings → Networking → Public Domain
- Copy: `https://your-app.up.railway.app`

---

## 🧪 STEP 5: Test

```bash
curl https://your-app.up.railway.app/health
```

Should return: `{"success":true,"message":"ROTATION API is running"}`

---

## 🗄️ STEP 6: Run Migrations

```bash
npm install -g @railway/cli
railway login
cd /Users/liberatex/Desktop/ROTATION/backend
railway link
railway run psql $DATABASE_URL -f migrations/001_initial_schema.sql
```

---

## ✅ Done!

Your API is live! 🎉

---

**Full guide**: `RAILWAY_DASHBOARD_STEPS.md`


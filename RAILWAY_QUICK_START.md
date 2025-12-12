# 🚂 Railway Quick Start - 5 Minute Deploy

## Fastest Way to Deploy ROTATION Backend

---

## ⚡ Quick Steps

### 1. Sign Up (1 minute)
- Go to **https://railway.app**
- Click **"Start a New Project"**
- Sign up with **GitHub**

### 2. Deploy Backend (2 minutes)
- Click **"+ New Project"**
- Select **"Deploy from GitHub repo"**
- Choose your **ROTATION** repository
- **Set root directory**: `backend`
- Railway auto-detects and starts building

### 3. Add Databases (1 minute)
- Click **"+ New"** → **"Add PostgreSQL"**
- Click **"+ New"** → **"Add Redis"**
- Railway auto-configures connection strings

### 4. Set Environment Variables (1 minute)
Click your service → **Variables** tab → Add:

```bash
NODE_ENV=production
PORT=3000
JWT_SECRET=<generate-below>
JWT_REFRESH_SECRET=<generate-below>
CORS_ORIGIN=*
```

**Generate secrets:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 5. Run Migrations
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and link
railway login
railway link

# Run migrations
cd backend
railway run psql $DATABASE_URL -f migrations/001_initial_schema.sql
```

### 6. Done! 🎉
Your API is live at: `https://your-app-name.up.railway.app`

---

## 🧪 Test It

```bash
curl https://your-app-name.up.railway.app/health
```

Should return:
```json
{"success":true,"message":"ROTATION API is running"}
```

---

## 📱 Update Mobile App

Update `mobile/src/config/env.ts`:

```typescript
prod: {
  apiUrl: 'https://your-app-name.up.railway.app/api/v1',
  wsUrl: 'wss://your-app-name.up.railway.app',
}
```

---

## 📚 Full Guide

See `RAILWAY_DEPLOYMENT.md` for complete instructions.

---

**That's it! Your backend is live! 🚀**


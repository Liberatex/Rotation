# 🚂 START HERE - Railway Deployment

## ✅ Everything is Ready for Railway!

Your ROTATION backend is **100% configured** and ready to deploy on Railway.

---

## 🚀 Quick Deploy (5 Minutes)

### 1️⃣ Sign Up & Create Project
1. Go to **https://railway.app**
2. Click **"Start a New Project"** or **"Login"**
3. Sign up with **GitHub** (easiest)
4. Click **"+ New Project"**
5. Select **"Deploy from GitHub repo"**
6. Choose your **ROTATION** repository

### 2️⃣ Configure Service
1. Railway will detect your project
2. **IMPORTANT**: Set **Root Directory** to `backend`
   - Click on the service
   - Go to **Settings** tab
   - Under **Root Directory**, enter: `backend`
   - Click **Save**

### 3️⃣ Add Databases
1. Click **"+ New"** in your project
2. Select **"Database"** → **"Add PostgreSQL"**
   - Railway auto-creates and configures
   - `DATABASE_URL` is automatically set
3. Click **"+ New"** again
4. Select **"Database"** → **"Add Redis"**
   - Railway auto-creates and configures
   - `REDIS_HOST` and `REDIS_PORT` are automatically set

### 4️⃣ Set Environment Variables
1. Click on your **backend service**
2. Go to **Variables** tab
3. Click **"+ New Variable"**
4. Add these variables:

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

**Generate JWT Secrets:**
Open your terminal and run:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```
Run it twice to get two different secrets. Copy and paste into Railway.

### 5️⃣ Deploy!
Railway will automatically:
- ✅ Install dependencies (`npm install`)
- ✅ Build your app (`npm run build`)
- ✅ Start your server (`npm start`)

Watch the deployment in the **Deployments** tab!

### 6️⃣ Get Your API URL
1. After deployment completes, go to **Settings** tab
2. Under **Networking**, you'll see your public URL:
   ```
   https://your-app-name.up.railway.app
   ```

### 7️⃣ Run Database Migrations
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to your project
railway link
# Select your project when prompted

# Run migrations
cd backend
railway run psql $DATABASE_URL -f migrations/001_initial_schema.sql
```

### 8️⃣ Test Your API
```bash
curl https://your-app-name.up.railway.app/health
```

Should return:
```json
{"success":true,"message":"ROTATION API is running","timestamp":"..."}
```

---

## 📱 Update Mobile App

After deployment, update `mobile/src/config/env.ts`:

```typescript
const ENV = {
  dev: {
    apiUrl: 'http://localhost:3000/api/v1',
    wsUrl: 'http://localhost:3000',
  },
  staging: {
    apiUrl: 'https://your-app-name.up.railway.app/api/v1',
    wsUrl: 'wss://your-app-name.up.railway.app',
  },
  prod: {
    apiUrl: 'https://your-app-name.up.railway.app/api/v1',
    wsUrl: 'wss://your-app-name.up.railway.app',
  },
};
```

**Important**: Use `wss://` (secure WebSocket) for production!

---

## ✅ Pre-Deployment Checklist

Before deploying, verify:

- [x] Code pushed to GitHub
- [x] `railway.json` exists (✅ Created)
- [x] `package.json` has build/start scripts (✅ Verified)
- [x] TypeScript compiles successfully (✅ Verified)
- [ ] Railway account created
- [ ] Project created and connected to GitHub
- [ ] Root directory set to `backend`
- [ ] PostgreSQL database added
- [ ] Redis database added
- [ ] Environment variables set
- [ ] JWT secrets generated
- [ ] Database migrations run
- [ ] API URL copied
- [ ] Mobile app updated

---

## 🎯 What Happens Next?

1. **Railway auto-deploys** when you push to GitHub
2. **Your API is live** at `https://your-app-name.up.railway.app`
3. **WebSocket works** automatically (Railway supports it!)
4. **Databases are connected** automatically
5. **Scales automatically** as traffic increases

---

## 📚 Need More Details?

- **Complete Guide**: See `RAILWAY_DEPLOYMENT.md`
- **Quick Start**: See `RAILWAY_QUICK_START.md`
- **Troubleshooting**: See `RAILWAY_DEPLOYMENT.md` → Troubleshooting section

---

## 🆘 Common Issues

### Build Fails
- Check deployment logs in Railway dashboard
- Verify `npm run build` works locally
- Check for TypeScript errors

### Database Connection Error
- Verify `DATABASE_URL` is set (should be auto-set by Railway)
- Check PostgreSQL service is running
- Verify connection string format

### Port Issues
- Railway sets `PORT` automatically
- Your app uses `process.env.PORT || 3000` (already configured)

---

## 💰 Railway Pricing

- **Free**: $5 credit/month (perfect for testing)
- **Hobby**: $5/month + usage
- **Pro**: $20/month + usage

**Note**: PostgreSQL and Redis usage counts toward your credit.

---

## 🎉 You're Ready!

Everything is configured. Just follow the steps above and your backend will be live!

**Estimated time**: 5-10 minutes

**Start here**: https://railway.app

---

**Questions?** Check `RAILWAY_DEPLOYMENT.md` for detailed instructions.


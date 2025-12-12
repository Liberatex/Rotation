# 🚀 Quick Deploy Guide

## Fastest Deployment: Railway (Recommended)

### Step 1: Create Railway Account
1. Go to https://railway.app
2. Sign up with GitHub
3. Get $5 free credit

### Step 2: Deploy Backend
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your ROTATION repository
4. Set root directory to: `backend`

### Step 3: Add Databases
1. Click "+ New" → "Database" → "PostgreSQL"
2. Click "+ New" → "Database" → "Redis"

### Step 4: Set Environment Variables
In Railway dashboard → Variables tab, add:

```bash
NODE_ENV=production
DATABASE_URL=${{Postgres.DATABASE_URL}}
REDIS_HOST=${{Redis.REDIS_HOST}}
REDIS_PORT=${{Redis.REDIS_PORT}}
JWT_SECRET=<generate-with-command-below>
JWT_REFRESH_SECRET=<generate-with-command-below>
CORS_ORIGIN=*
PORT=3000
```

Generate secrets:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Step 5: Deploy
Railway auto-deploys! Your API will be live at:
```
https://<your-app-name>.railway.app
```

---

## Alternative: Firebase Functions

### Step 1: Install Firebase CLI
```bash
npm install -g firebase-tools
firebase login
```

### Step 2: Initialize Firebase
```bash
cd backend
firebase init functions
```

### Step 3: Deploy
```bash
firebase deploy --only functions
```

Your API will be at:
```
https://us-central1-<project-id>.cloudfunctions.net/api
```

---

## Update Mobile App

After deployment, update `mobile/src/config/env.ts`:

```typescript
const ENV = {
  dev: {
    apiUrl: 'http://localhost:3000/api/v1',  // Local
  },
  staging: {
    apiUrl: 'https://your-staging-url.com/api/v1',  // Staging
  },
  prod: {
    apiUrl: 'https://your-production-url.com/api/v1',  // Production
  },
};
```

---

## Test Production

```bash
# Health check
curl https://your-api-url.com/health

# Should return:
# {"success":true,"message":"ROTATION API is running"}
```

---

**Ready to deploy?** Choose Railway for easiest setup, or Firebase if you're already using Firebase!


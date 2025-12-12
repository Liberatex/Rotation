# 🚀 ROTATION App - Deployment Guide

## Deployment Options

This guide covers multiple deployment options for the ROTATION backend API.

---

## Option 1: Firebase Functions (Recommended for Firebase Integration)

### Prerequisites
- Firebase CLI: `npm install -g firebase-tools`
- Firebase project created at https://console.firebase.google.com/

### Setup Steps

1. **Install Firebase CLI**
```bash
npm install -g firebase-tools
firebase login
```

2. **Initialize Firebase in backend directory**
```bash
cd backend
firebase init functions
# Select: Use existing project → Choose your project
# Language: TypeScript
# ESLint: Yes
# Install dependencies: Yes
```

3. **Install Firebase Functions dependencies**
```bash
cd backend
npm install firebase-functions firebase-admin
npm install --save-dev @types/node
```

4. **Configure Firebase project**
```bash
# Update .firebaserc with your project ID
firebase use --add
```

5. **Set environment variables**
```bash
firebase functions:config:set \
  database.url="your-postgres-url" \
  redis.host="your-redis-host" \
  jwt.secret="your-jwt-secret" \
  jwt.refresh_secret="your-refresh-secret"
```

6. **Deploy**
```bash
firebase deploy --only functions
```

### Firebase Functions URL
After deployment, your API will be available at:
```
https://us-central1-<project-id>.cloudfunctions.net/api
```

### Limitations
- ⚠️ WebSocket (Socket.io) not supported in Firebase Functions
- 💡 Solution: Use Firebase Realtime Database or deploy WebSocket server separately

---

## Option 2: Railway (Recommended - Easiest)

### Why Railway?
- ✅ Free tier available
- ✅ PostgreSQL + Redis included
- ✅ Automatic deployments from GitHub
- ✅ WebSocket support
- ✅ Simple setup

### Setup Steps

1. **Create Railway account**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Create new project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your ROTATION repository
   - Select `backend` directory

3. **Add PostgreSQL**
   - Click "+ New" → "Database" → "PostgreSQL"
   - Railway will auto-generate connection string

4. **Add Redis**
   - Click "+ New" → "Database" → "Redis"
   - Railway will auto-generate connection string

5. **Configure Environment Variables**
   In Railway dashboard, add these variables:
   ```
   NODE_ENV=production
   DATABASE_URL=<railway-postgres-url>
   REDIS_HOST=<railway-redis-host>
   REDIS_PORT=<railway-redis-port>
   JWT_SECRET=<generate-secure-secret>
   JWT_REFRESH_SECRET=<generate-secure-secret>
   CORS_ORIGIN=https://your-frontend-domain.com
   ```

6. **Deploy**
   - Railway auto-deploys on git push
   - Or click "Deploy" in dashboard

### Railway URL
Your API will be available at:
```
https://<your-app-name>.railway.app
```

---

## Option 3: Render (Free Tier Available)

### Setup Steps

1. **Create Render account**
   - Go to https://render.com
   - Sign up with GitHub

2. **Create Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select `backend` directory

3. **Configure Build**
   ```
   Build Command: npm install && npm run build
   Start Command: npm start
   ```

4. **Add PostgreSQL Database**
   - Click "New +" → "PostgreSQL"
   - Note the connection string

5. **Add Redis (Optional)**
   - Use Upstash Redis (free tier)
   - Or Render's Redis (paid)

6. **Set Environment Variables**
   ```
   NODE_ENV=production
   DATABASE_URL=<render-postgres-url>
   REDIS_HOST=<redis-host>
   REDIS_PORT=6379
   JWT_SECRET=<secure-secret>
   JWT_REFRESH_SECRET=<secure-secret>
   PORT=10000
   ```

7. **Deploy**
   - Render auto-deploys on git push

### Render URL
```
https://rotation-backend.onrender.com
```

---

## Option 4: DigitalOcean App Platform

### Setup Steps

1. **Create DigitalOcean account**
   - Go to https://www.digitalocean.com
   - Sign up

2. **Create App**
   - Go to App Platform
   - Click "Create App"
   - Connect GitHub repository

3. **Configure**
   - Select `backend` directory
   - Build command: `npm install && npm run build`
   - Run command: `npm start`

4. **Add Databases**
   - Add PostgreSQL managed database
   - Add Redis managed database

5. **Set Environment Variables**
   - Add all required env vars in App Settings

6. **Deploy**
   - DigitalOcean auto-deploys

---

## Option 5: Vercel (For Serverless)

### Setup Steps

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Create vercel.json**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "dist/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "dist/index.js"
    }
  ]
}
```

3. **Deploy**
```bash
vercel --prod
```

### Limitations
- ⚠️ WebSocket not supported
- ⚠️ Requires serverless-friendly code

---

## Environment Variables for Production

Create a `.env.production` file with:

```bash
NODE_ENV=production
PORT=3000
API_VERSION=v1

# Database (from your hosting provider)
DATABASE_URL=postgresql://user:password@host:5432/rotation_db

# Redis (from your hosting provider)
REDIS_HOST=your-redis-host
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password

# JWT (generate secure secrets)
JWT_SECRET=<generate-strong-secret>
JWT_REFRESH_SECRET=<generate-strong-secret>
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# CORS (your frontend domain)
CORS_ORIGIN=https://your-app.com,https://www.your-app.com

# Firebase (if using Firebase)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email

# Stripe (if using payments)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# AWS S3 (if using file storage)
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name
```

---

## Generate Secure Secrets

```bash
# Generate JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Generate refresh secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## Database Migrations in Production

### Railway/Render/DigitalOcean
```bash
# SSH into your instance or use CLI
railway run psql $DATABASE_URL -f migrations/001_initial_schema.sql
```

### Firebase
```bash
# Run migrations before deploying
# Or use Firebase Functions to run migrations on first deploy
```

---

## WebSocket Deployment

Since Firebase Functions doesn't support WebSocket, deploy WebSocket server separately:

### Option A: Separate WebSocket Server on Railway
1. Create separate Railway service for WebSocket
2. Use same codebase, different entry point
3. Connect to same database/Redis

### Option B: Use Firebase Realtime Database
- Replace Socket.io with Firebase Realtime Database
- Update mobile app to use Firebase SDK

### Option C: Use Pusher or Ably
- Third-party WebSocket service
- Update backend to use their SDK

---

## Recommended Setup

### For Firebase Users
1. **API**: Firebase Functions
2. **Database**: Cloud SQL (PostgreSQL) or Firestore
3. **WebSocket**: Firebase Realtime Database or separate Railway service
4. **Storage**: Firebase Storage

### For Non-Firebase Users
1. **API + WebSocket**: Railway (single service)
2. **Database**: Railway PostgreSQL
3. **Cache**: Railway Redis
4. **Storage**: AWS S3 or Cloudflare R2

---

## Testing Production Deployment

```bash
# Health check
curl https://your-api-url.com/health

# Register user
curl -X POST https://your-api-url.com/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","firebaseUid":"test-123","displayName":"Test"}'
```

---

## Monitoring & Logs

### Railway
- View logs in Railway dashboard
- Set up alerts for errors

### Firebase
```bash
firebase functions:log
```

### Render
- View logs in Render dashboard
- Set up webhooks for alerts

---

## Cost Comparison

| Platform | Free Tier | Paid Tier | Best For |
|----------|-----------|-----------|----------|
| Railway | ✅ $5 credit/month | $20+/month | Full-stack apps |
| Render | ✅ Free (limited) | $7+/month | Simple deployments |
| Firebase | ✅ Free tier | Pay-as-you-go | Firebase users |
| DigitalOcean | ❌ | $12+/month | Production apps |
| Vercel | ✅ Free tier | $20+/month | Serverless |

---

## Next Steps

1. Choose your deployment platform
2. Follow the setup steps above
3. Update mobile app API URL
4. Test production deployment
5. Set up monitoring and alerts

---

**Need help?** Check platform-specific documentation or open an issue.


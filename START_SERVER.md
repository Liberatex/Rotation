# 🚀 Quick Start Guide

## Prerequisites Check

✅ Node.js installed  
✅ Dependencies installed  
✅ Redis running  
⚠️ PostgreSQL needed  

## Start Server (3 Steps)

### Step 1: Install PostgreSQL
```bash
brew install postgresql@14
brew services start postgresql@14
createdb -U postgres rotation_db
```

### Step 2: Run Database Migrations
```bash
cd backend
psql -U postgres -d rotation_db -f migrations/001_initial_schema.sql
```

### Step 3: Start Server
```bash
cd backend
npm run dev
```

## Verify It's Working

```bash
curl http://localhost:3000/health
```

You should see:
```json
{
  "success": true,
  "message": "ROTATION API is running"
}
```

## Or Use Automated Script

```bash
cd backend
./quick-start.sh
```

This will check everything and start the server automatically!

---
**Server will run on**: http://localhost:3000

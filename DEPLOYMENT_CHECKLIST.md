# Local Deployment Checklist

## ✅ Pre-Deployment Checks

### 1. Backend Dependencies
- [x] Node.js installed (v18+)
- [x] npm dependencies installed
- [x] .env file created

### 2. Database Setup
- [ ] PostgreSQL installed and running
- [ ] Database `rotation_db` created
- [ ] Migrations run successfully

### 3. Redis Setup
- [x] Redis installed
- [ ] Redis running on port 6379

### 4. Services Status
- [ ] PostgreSQL: `psql -U postgres -d rotation_db -c "SELECT 1;"`
- [ ] Redis: `redis-cli ping` (should return PONG)

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)
```bash
cd backend
./setup-local.sh
./start-local.sh
```

### Option 2: Manual Setup

1. **Install PostgreSQL** (if not installed):
```bash
brew install postgresql@14
brew services start postgresql@14
createdb -U postgres rotation_db
```

2. **Start Redis**:
```bash
redis-server
# Or in background:
redis-server --daemonize yes
```

3. **Run Database Migrations**:
```bash
cd backend
psql -U postgres -d rotation_db -f migrations/001_initial_schema.sql
```

4. **Start Backend Server**:
```bash
cd backend
npm run dev
```

## ✅ Verification

### Test Backend Health
```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "success": true,
  "message": "ROTATION API is running",
  "timestamp": "2024-12-11T..."
}
```

### Test API Endpoint
```bash
# Register a test user
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "firebaseUid": "test-uid-123",
    "displayName": "Test User"
  }'
```

## 🔧 Troubleshooting

### PostgreSQL Issues
- **Database doesn't exist**: `createdb -U postgres rotation_db`
- **Connection refused**: Check if PostgreSQL is running: `brew services list`
- **Permission denied**: Check PostgreSQL user permissions

### Redis Issues
- **Redis not running**: `redis-server --daemonize yes`
- **Connection refused**: Check Redis is on port 6379: `redis-cli ping`

### Port Already in Use
- **Port 3000 in use**: Change PORT in .env file
- **Port 5432 in use**: PostgreSQL already running (this is fine)
- **Port 6379 in use**: Redis already running (this is fine)

## 📱 Mobile App Connection

Update `mobile/src/config/env.ts`:
```typescript
const ENV = {
  dev: {
    apiUrl: 'http://localhost:3000/api/v1',  // iOS Simulator
    // apiUrl: 'http://10.0.2.2:3000/api/v1',  // Android Emulator
    wsUrl: 'http://localhost:3000',
  },
  // ...
};
```

**Note**: 
- iOS Simulator: Use `localhost` or `127.0.0.1`
- Android Emulator: Use `10.0.2.2` instead of `localhost`
- Physical Device: Use your computer's IP address (e.g., `192.168.1.100:3000`)

## 🎯 Next Steps After Deployment

1. ✅ Backend running on http://localhost:3000
2. ✅ Health check passing
3. ✅ Database migrations complete
4. ✅ Redis connected
5. ⏭️ Start mobile app: `cd mobile && npm start`
6. ⏭️ Test full flow: Register → Login → Create Session → Start Rotation


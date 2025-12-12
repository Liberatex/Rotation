# 🚀 ROTATION Backend Server - DEPLOYED

## ✅ Deployment Status: LIVE

**Server Status**: ✅ **RUNNING**  
**Deployment Time**: $(date)  
**URL**: http://localhost:3000  
**WebSocket**: ws://localhost:3000  

---

## 📊 Service Status

| Service | Status | Port | Details |
|---------|--------|------|---------|
| **Backend API** | ✅ Running | 3000 | Express.js + TypeScript |
| **PostgreSQL** | ✅ Connected | 5432 | Database: rotation_db |
| **Redis** | ✅ Connected | 6379 | Cache & Sessions |
| **WebSocket** | ✅ Ready | 3000 | Socket.io Server |

---

## 🔗 API Endpoints

### Health Check
```bash
GET /health
```
**Response**: `{"success": true, "message": "ROTATION API is running"}`

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/refresh` - Refresh token
- `POST /api/v1/auth/logout` - Logout user

### Sessions
- `POST /api/v1/sessions` - Create session
- `GET /api/v1/sessions/:id` - Get session
- `PUT /api/v1/sessions/:id` - Update session (MBA only)
- `DELETE /api/v1/sessions/:id` - Delete session (MBA only)
- `POST /api/v1/sessions/:id/join` - Join session
- `POST /api/v1/sessions/:id/leave` - Leave session
- `GET /api/v1/sessions/:id/participants` - Get participants

### Rotations
- `POST /api/v1/rotations` - Create rotation
- `GET /api/v1/rotations/:id` - Get rotation
- `POST /api/v1/rotations/:id/start` - Start rotation (MBA only)
- `POST /api/v1/rotations/:id/pause` - Pause rotation (MBA only)
- `POST /api/v1/rotations/:id/resume` - Resume rotation (MBA only)
- `POST /api/v1/rotations/:id/end` - End rotation (MBA only)
- `POST /api/v1/rotations/:id/pass` - Pass turn
- `GET /api/v1/rotations/:id/turns` - Get turn history
- `GET /api/v1/rotations/:id/history` - Get rotation history

---

## 🧪 Quick Test

### Test Health Endpoint
```bash
curl http://localhost:3000/health
```

### Test User Registration
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "firebaseUid": "test-uid-123",
    "displayName": "Test User"
  }'
```

### Expected Response
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "...",
      "email": "test@example.com"
    },
    "tokens": {
      "accessToken": "...",
      "refreshToken": "..."
    }
  }
}
```

---

## 📱 Mobile App Connection

The mobile app is configured to connect to:
- **API**: `http://localhost:3000/api/v1`
- **WebSocket**: `http://localhost:3000`

### Start Mobile App
```bash
cd mobile
npm start
```

---

## 🔍 Monitoring

### View Server Logs
The server is running in the background. Logs will show:
- API requests
- Database queries
- WebSocket connections
- Errors and warnings

### Check Database
```bash
psql -U postgres -d rotation_db
\dt  # List tables
SELECT * FROM users;  # View users
```

### Check Redis
```bash
redis-cli
KEYS *  # View all keys
```

---

## 🛑 Stop Server

To stop the backend server:
```bash
# Find the process
ps aux | grep "npm run dev"

# Kill the process
kill <PID>
```

Or use:
```bash
pkill -f "npm run dev"
```

---

## 🔄 Restart Server

```bash
cd backend
npm run dev
```

---

## ✅ Deployment Verified

- ✅ Server responding to health checks
- ✅ Database connected (10 tables)
- ✅ Redis connected
- ✅ API endpoints accessible
- ✅ WebSocket server ready
- ✅ Authentication working

**Status**: 🎉 **FULLY DEPLOYED AND OPERATIONAL**

---

*Last Updated: $(date)*


# Quick Start Guide

Welcome to ROTATION! This guide will help you get the project up and running quickly.

## Prerequisites

Before you begin, make sure you have installed:

- **Node.js** 18 or higher ([Download](https://nodejs.org/))
- **PostgreSQL** 14 or higher ([Download](https://www.postgresql.org/download/))
- **Redis** 6 or higher ([Download](https://redis.io/download))
- **Docker** (optional, for containerized deployment) ([Download](https://www.docker.com/))

For mobile development:
- **Expo CLI**: `npm install -g expo-cli`
- **iOS**: Xcode (macOS only)
- **Android**: Android Studio

## Backend Setup

### 1. Navigate to backend directory
```bash
cd backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
```bash
# Copy the example file
cp .env.example .env

# Edit .env with your configuration
# At minimum, update:
# - DATABASE_URL or DB_* variables
# - JWT_SECRET and JWT_REFRESH_SECRET
# - REDIS_HOST and REDIS_PORT
```

### 4. Set up PostgreSQL database
```bash
# Create database (if not exists)
createdb rotation_db

# Or using psql:
psql -U postgres
CREATE DATABASE rotation_db;
\q
```

### 5. Run database migrations
```bash
# Make sure PostgreSQL is running, then:
npm run migrate:up
```

### 6. Start Redis
```bash
# On macOS with Homebrew:
brew services start redis

# On Linux:
sudo systemctl start redis

# Or run directly:
redis-server
```

### 7. Start the backend server
```bash
npm run dev
```

The backend API will be available at `http://localhost:3000`

Test it by visiting: `http://localhost:3000/health`

## Mobile App Setup

### 1. Navigate to mobile directory
```bash
cd mobile
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment (optional)
Edit `src/config/env.ts` to point to your backend API URL.

### 4. Start Expo development server
```bash
npm start
```

### 5. Run on device/simulator

**iOS:**
```bash
npm run ios
```

**Android:**
```bash
npm run android
```

Or scan the QR code with Expo Go app on your phone.

## Docker Setup (Alternative)

If you prefer Docker:

### 1. Navigate to backend directory
```bash
cd backend
```

### 2. Start all services
```bash
docker-compose up -d
```

This will start:
- Backend API (port 3000)
- PostgreSQL (port 5432)
- Redis (port 6379)
- Nginx reverse proxy (port 80)

### 3. Run migrations
```bash
docker-compose exec app npm run migrate:up
```

### 4. View logs
```bash
docker-compose logs -f app
```

## Testing the Setup

### Backend Health Check
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
# Register a user (example)
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "firebaseUid": "test-firebase-uid",
    "displayName": "Test User"
  }'
```

## Next Steps

1. **Set up Firebase**: Configure Firebase Auth for authentication
2. **Configure Stripe**: Set up Stripe for payments (when ready)
3. **Build Mobile Screens**: Start implementing UI screens
4. **Test WebSocket**: Test real-time features
5. **Deploy**: Deploy to staging/production

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running: `pg_isready`
- Check connection string in `.env`
- Verify database exists: `psql -l | grep rotation_db`

### Redis Connection Issues
- Ensure Redis is running: `redis-cli ping` (should return PONG)
- Check Redis host/port in `.env`

### Port Already in Use
- Change port in `.env` file
- Or kill the process using the port:
  ```bash
  # Find process
  lsof -i :3000
  # Kill process
  kill -9 <PID>
  ```

### Mobile App Won't Connect to Backend
- Check `src/config/env.ts` has correct API URL
- Ensure backend is running
- Check firewall/network settings
- For iOS simulator, use `localhost`
- For Android emulator, use `10.0.2.2` instead of `localhost`

## Development Tips

1. **Use TypeScript**: All code is TypeScript - leverage type safety
2. **Follow Structure**: Keep code organized in the established directories
3. **Test Locally**: Test API endpoints with Postman or curl before mobile integration
4. **Check Logs**: Monitor backend logs for errors and debugging
5. **Git Workflow**: Use feature branches for new features

## Resources

- [Backend README](./backend/README.md)
- [Mobile README](./mobile/README.md)
- [Technical Specification](./ROTATION_-_Technical_Specification_&_System_Architecture.pdf)
- [Architecture Diagrams](./system-architecture.png)

## Need Help?

Check the documentation files or review the code comments for guidance.

Happy coding! 🚀


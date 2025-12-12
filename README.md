# 🚬 ROTATION - Blunt Rotation Timer App

A mobile application designed to manage and gamify cannabis smoking sessions among friends. The app provides a structured rotation system with timers, notifications, and customizable features to ensure fair turn-taking during group sessions.

![Status](https://img.shields.io/badge/status-in%20development-yellow)
![License](https://img.shields.io/badge/license-Proprietary-red)

## 🎯 Project Overview

ROTATION solves the common problem of people holding onto the blunt too long during group sessions by creating a structured, fair rotation system with automated timers, alerts, and real-time synchronization across all participants' devices.

## ✨ Key Features

- 🎯 **Session Management**: Create and join sessions with unique codes
- ⏱️ **Rotation Timer**: Automated turn-based timing system
- 🔄 **Real-time Sync**: Live updates across all devices via WebSocket
- 🎵 **Custom Sounds**: Personalized alert sounds and custom audio uploads
- 💎 **Premium Features**: Subscription-based premium tier
- 📊 **Statistics**: Track sessions, rotations, and turn history
- 🏆 **Gamification**: Achievements and leaderboards (coming soon)

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js + TypeScript
- **Database**: PostgreSQL 14+
- **Cache**: Redis 6+
- **WebSocket**: Socket.io
- **Authentication**: JWT + Firebase Auth
- **Deployment**: Railway (recommended), Firebase Functions, Render

### Mobile App
- **Framework**: React Native (Expo)
- **Language**: TypeScript
- **State Management**: Redux Toolkit
- **Navigation**: React Navigation
- **UI**: React Native Paper
- **Real-time**: Socket.io Client
- **Authentication**: Firebase Auth
- **Payments**: Stripe React Native SDK

## 📁 Project Structure

```
ROTATION/
├── backend/              # Node.js/Express backend API
│   ├── src/             # Source code
│   │   ├── controllers/ # API controllers
│   │   ├── routes/      # API routes
│   │   ├── middleware/  # Auth, rate limiting, errors
│   │   ├── websocket/   # WebSocket server
│   │   ├── config/      # Database, env config
│   │   └── utils/       # Helpers, JWT, logger
│   ├── migrations/      # Database migrations
│   └── railway.json     # Railway deployment config
│
├── mobile/              # React Native mobile app
│   ├── src/
│   │   ├── screens/     # UI screens
│   │   ├── components/  # Reusable components
│   │   ├── services/    # API, WebSocket clients
│   │   ├── store/       # Redux store and slices
│   │   └── navigation/  # Navigation config
│   └── App.tsx          # App entry point
│
└── docs/                # Documentation and diagrams
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18 or higher
- PostgreSQL 14 or higher
- Redis 6 or higher
- Expo CLI (for mobile development)

### Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Run database migrations
psql -U postgres -d rotation_db -f migrations/001_initial_schema.sql

# Start development server
npm run dev
```

The backend API will be available at `http://localhost:3000`

### Mobile App Setup

```bash
# Navigate to mobile
cd mobile

# Install dependencies
npm install

# Start Expo development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android
```

## 📚 Documentation

- **[Railway Deployment Guide](RAILWAY_DEPLOYMENT.md)** - Deploy to Railway
- **[Quick Start Guide](QUICK_START.md)** - Local development setup
- **[Deployment Guide](DEPLOYMENT_GUIDE.md)** - All deployment options
- **[API Documentation](backend/README.md)** - Backend API reference
- **[Mobile App Guide](mobile/README.md)** - Mobile app setup

## 🌐 Deployment

### Railway (Recommended)

1. Go to [Railway.app](https://railway.app)
2. Sign up with GitHub
3. Deploy from GitHub repo
4. Add PostgreSQL and Redis databases
5. Set environment variables
6. Deploy!

See [START_HERE_RAILWAY.md](START_HERE_RAILWAY.md) for detailed instructions.

### Other Options

- **Firebase Functions**: See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
- **Render**: See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
- **Docker**: See `backend/Dockerfile.production`

## 🔗 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/refresh` - Refresh token
- `POST /api/v1/auth/logout` - Logout user

### Sessions
- `POST /api/v1/sessions` - Create session
- `GET /api/v1/sessions/:id` - Get session details
- `POST /api/v1/sessions/:id/join` - Join session
- `POST /api/v1/sessions/:id/leave` - Leave session

### Rotations
- `POST /api/v1/rotations` - Create rotation
- `POST /api/v1/rotations/:id/start` - Start rotation
- `POST /api/v1/rotations/:id/pass` - Pass turn
- `GET /api/v1/rotations/:id/turns` - Get turn history

See [backend/README.md](backend/README.md) for complete API documentation.

## 🧪 Testing

### Backend
```bash
cd backend
npm test
```

### Mobile App
```bash
cd mobile
npm test
```

## 📱 Mobile App Features

- ✅ User authentication (Firebase Auth)
- ✅ Session creation and joining
- ✅ Real-time rotation timer
- ✅ WebSocket synchronization
- ✅ User profiles and statistics
- ✅ Premium subscription flow (ready)
- 🔄 Custom sounds (in progress)
- 🔄 Push notifications (in progress)

## 🔒 Security

- JWT-based authentication
- Rate limiting on API endpoints
- Input validation and sanitization
- HTTPS/TLS encryption
- Secure WebSocket (WSS) connections

## 📊 Database Schema

The database includes:
- Users and user profiles
- Sessions and participants
- Rotations and turns
- Subscriptions
- Custom sounds

See `migrations/001_initial_schema.sql` for complete schema.

## 🗺️ Development Roadmap

### Phase 1: MVP ✅
- [x] Basic authentication
- [x] Session creation and joining
- [x] Single rotation with timer
- [x] Basic alert sounds
- [x] iOS and Android deployment

### Phase 2: Core Features (In Progress)
- [ ] Master Blunt Agent controls
- [ ] Multiple rotations per session
- [ ] Custom timer durations
- [ ] Sound library (5-10 sounds)
- [ ] User profiles with statistics

### Phase 3: Monetization (Planned)
- [ ] Subscription system
- [ ] Premium sound library
- [ ] Custom sound upload
- [ ] Payment processing
- [ ] Ad integration

### Phase 4: Growth (Planned)
- [ ] QR code partnership program
- [ ] Social features (friends, groups)
- [ ] Advanced analytics
- [ ] Gamification (achievements, leaderboards)

## 🤝 Contributing

This is a proprietary project. All rights reserved.

## 📄 License

Proprietary - All rights reserved. Unauthorized copying, distribution, or modification is prohibited.

## 📞 Contact

For questions, support, or partnership inquiries, please contact the development team.

## 🙏 Acknowledgments

This project was conceived by a group of friends who identified a common problem in social smoking sessions and envisioned a technological solution.

---

**Version**: 1.0.0  
**Last Updated**: December 2024  
**Status**: In Development 🚧

---

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/Liberatex/Rotation.git
   cd Rotation
   ```

2. **Set up backend** (see [QUICK_START.md](QUICK_START.md))
3. **Set up mobile app** (see [mobile/README.md](mobile/README.md))
4. **Deploy to Railway** (see [START_HERE_RAILWAY.md](START_HERE_RAILWAY.md))

---

**Ready to build?** Check out the [Quick Start Guide](QUICK_START.md)!

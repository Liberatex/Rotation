# ROTATION Mobile App

React Native mobile application for the ROTATION app.

## Tech Stack

- **Framework**: React Native (Expo)
- **Language**: TypeScript
- **Navigation**: React Navigation
- **State Management**: Redux Toolkit
- **UI Library**: React Native Paper
- **Real-time**: Socket.io Client
- **Authentication**: Firebase Auth
- **Payments**: Stripe React Native SDK

## Setup

### Prerequisites

- Node.js 18 or higher
- Expo CLI
- iOS: Xcode (macOS only)
- Android: Android Studio

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `src/config/env.ts`

3. Start the development server:
```bash
npm start
```

4. Run on iOS:
```bash
npm run ios
```

5. Run on Android:
```bash
npm run android
```

## Project Structure

```
src/
├── screens/          # Screen components
├── components/       # Reusable components
├── services/         # API and WebSocket services
├── store/            # Redux store and slices
├── navigation/       # Navigation configuration
├── utils/            # Utility functions
├── types/            # TypeScript types
└── config/           # Configuration files
```

## Features

- ✅ Authentication (Firebase Auth)
- ✅ Session Management
- ✅ Rotation Timer
- ✅ Real-time Synchronization (WebSocket)
- ✅ User Profiles
- ✅ Premium Subscriptions
- ✅ Custom Sounds
- ✅ Push Notifications

## Development

### Running Tests
```bash
npm test
```

### Linting
```bash
npm run lint
```

## License

Proprietary - All rights reserved


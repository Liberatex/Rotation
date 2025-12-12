# Mobile App Setup Guide

## Firebase Configuration

1. Create a Firebase project at https://console.firebase.google.com/
2. Enable Authentication → Email/Password
3. Download `google-services.json` (Android) and `GoogleService-Info.plist` (iOS)
4. Place them in the appropriate directories:
   - Android: `android/app/google-services.json`
   - iOS: `ios/GoogleService-Info.plist`

5. Update `app.json` with your Firebase configuration or use environment variables

## Environment Setup

1. Update `src/config/env.ts` with your backend API URL
2. For local development, use `http://localhost:3000` (iOS) or `http://10.0.2.2:3000` (Android emulator)

## Running the App

### Development
```bash
npm start
```

### iOS
```bash
npm run ios
```

### Android
```bash
npm run android
```

## Notes

- Firebase Auth is currently using mock UIDs for development
- To enable real Firebase Auth, uncomment the Firebase code in `src/services/authApi.ts`
- Make sure your backend is running before testing the app
- WebSocket connection requires authentication token


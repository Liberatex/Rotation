// Firebase Configuration Example
// Copy this file to firebase-config.js and add your Firebase credentials

import { initializeApp } from '@react-native-firebase/app';

const firebaseConfig = {
  apiKey: 'your-api-key',
  authDomain: 'your-project.firebaseapp.com',
  projectId: 'your-project-id',
  storageBucket: 'your-project.appspot.com',
  messagingSenderId: '123456789',
  appId: 'your-app-id',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;


import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthTokens } from '../types';

const STORAGE_KEYS = {
  AUTH_TOKENS: '@rotation/auth_tokens',
  USER_DATA: '@rotation/user_data',
  SETTINGS: '@rotation/settings',
};

export const getAuthTokens = async (): Promise<AuthTokens | null> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKENS);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting auth tokens:', error);
    return null;
  }
};

export const setAuthTokens = async (tokens: AuthTokens): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKENS, JSON.stringify(tokens));
  } catch (error) {
    console.error('Error setting auth tokens:', error);
  }
};

export const clearAuthTokens = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKENS);
  } catch (error) {
    console.error('Error clearing auth tokens:', error);
  }
};

export const getUserData = async (): Promise<any | null> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

export const setUserData = async (userData: any): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
  } catch (error) {
    console.error('Error setting user data:', error);
  }
};

export const clearUserData = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
  } catch (error) {
    console.error('Error clearing user data:', error);
  }
};


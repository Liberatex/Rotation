import { apiClient } from './apiClient';
import { User, AuthTokens } from '../types';
import { getAuthTokens, setAuthTokens } from '../utils/storage';
// Note: Firebase Auth will be initialized when Firebase is configured
// For now, using a placeholder that will work with the backend

class AuthApi {
  async register(credentials: { email: string; password: string; displayName?: string }): Promise<{ user: User; tokens: AuthTokens }> {
    // TODO: Integrate Firebase Auth when configured
    // For now, using a mock Firebase UID for development
    // In production, uncomment Firebase code:
    // const firebaseUser = await auth().createUserWithEmailAndPassword(credentials.email, credentials.password);
    const mockFirebaseUid = `firebase_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Register with backend
    const result = await apiClient.post<{ user: User; tokens: AuthTokens }>('/auth/register', {
      email: credentials.email,
      firebaseUid: mockFirebaseUid,
      displayName: credentials.displayName,
    });

    await setAuthTokens(result.tokens);
    return result;
  }

  async login(credentials: { email: string; password: string }): Promise<{ user: User; tokens: AuthTokens }> {
    // TODO: Integrate Firebase Auth when configured
    // For now, using a mock Firebase UID for development
    // In production, uncomment Firebase code:
    // const firebaseUser = await auth().signInWithEmailAndPassword(credentials.email, credentials.password);
    const mockFirebaseUid = `firebase_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Login with backend
    const result = await apiClient.post<{ user: User; tokens: AuthTokens }>('/auth/login', {
      email: credentials.email,
      firebaseUid: mockFirebaseUid,
    });

    await setAuthTokens(result.tokens);
    return result;
  }

  async logout(): Promise<void> {
    // TODO: Logout from Firebase when configured
    // await auth().signOut();
    
    // Logout from backend
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      // Continue even if backend logout fails
      console.error('Backend logout error:', error);
    }
  }

  async getCurrentUser(): Promise<User> {
    return await apiClient.get<User>('/users/me');
  }

  async getStoredTokens(): Promise<AuthTokens | null> {
    return await getAuthTokens();
  }

  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    return await apiClient.post<AuthTokens>('/auth/refresh', { refreshToken });
  }
}

export const authApi = new AuthApi();


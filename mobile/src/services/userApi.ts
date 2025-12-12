import { apiClient } from './apiClient';
import { UserProfile } from '../types';

class UserApi {
  async getProfile(): Promise<UserProfile> {
    return await apiClient.get<UserProfile>('/users/me');
  }

  async updateProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    return await apiClient.put<UserProfile>('/users/me', updates);
  }

  async getStats(): Promise<any> {
    return await apiClient.get('/users/me/stats');
  }
}

export const userApi = new UserApi();


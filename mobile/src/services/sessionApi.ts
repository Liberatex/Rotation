import { apiClient } from './apiClient';
import { Session, SessionParticipant } from '../types';

class SessionApi {
  async create(settings?: any): Promise<Session> {
    return await apiClient.post<Session>('/sessions', { settings });
  }

  async getById(sessionId: string): Promise<Session> {
    return await apiClient.get<Session>(`/sessions/${sessionId}`);
  }

  async update(sessionId: string, updates: any): Promise<Session> {
    return await apiClient.put<Session>(`/sessions/${sessionId}`, updates);
  }

  async delete(sessionId: string): Promise<void> {
    return await apiClient.delete(`/sessions/${sessionId}`);
  }

  async join(sessionId: string, code?: string): Promise<void> {
    return await apiClient.post(`/sessions/${sessionId}/join`, { code });
  }

  async leave(sessionId: string): Promise<void> {
    return await apiClient.post(`/sessions/${sessionId}/leave`);
  }

  async getParticipants(sessionId: string): Promise<SessionParticipant[]> {
    return await apiClient.get<SessionParticipant[]>(`/sessions/${sessionId}/participants`);
  }

  async addParticipant(sessionId: string, userId: string): Promise<void> {
    return await apiClient.post(`/sessions/${sessionId}/participants`, { userId });
  }

  async removeParticipant(sessionId: string, userId: string): Promise<void> {
    return await apiClient.delete(`/sessions/${sessionId}/participants/${userId}`);
  }
}

export const sessionApi = new SessionApi();


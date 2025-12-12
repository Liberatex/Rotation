import { apiClient } from './apiClient';
import { Rotation, RotationTurn } from '../types';

class RotationApi {
  async create(data: { sessionId: string; name?: string; timerDuration?: number; turnOrder?: string[] }): Promise<Rotation> {
    return await apiClient.post<Rotation>('/rotations', data);
  }

  async getById(rotationId: string): Promise<Rotation> {
    return await apiClient.get<Rotation>(`/rotations/${rotationId}`);
  }

  async update(rotationId: string, updates: any): Promise<Rotation> {
    return await apiClient.put<Rotation>(`/rotations/${rotationId}`, updates);
  }

  async start(rotationId: string): Promise<void> {
    return await apiClient.post(`/rotations/${rotationId}/start`);
  }

  async pause(rotationId: string): Promise<void> {
    return await apiClient.post(`/rotations/${rotationId}/pause`);
  }

  async resume(rotationId: string): Promise<void> {
    return await apiClient.post(`/rotations/${rotationId}/resume`);
  }

  async end(rotationId: string): Promise<void> {
    return await apiClient.post(`/rotations/${rotationId}/end`);
  }

  async pass(rotationId: string): Promise<{ nextUserId: string }> {
    return await apiClient.post(`/rotations/${rotationId}/pass`);
  }

  async getTurns(rotationId: string): Promise<RotationTurn[]> {
    return await apiClient.get<RotationTurn[]>(`/rotations/${rotationId}/turns`);
  }

  async getHistory(rotationId: string): Promise<any[]> {
    return await apiClient.get<any[]>(`/rotations/${rotationId}/history`);
  }
}

export const rotationApi = new RotationApi();


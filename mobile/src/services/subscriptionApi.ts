import { apiClient } from './apiClient';
import { Subscription } from '../types';

class SubscriptionApi {
  async getSubscription(): Promise<Subscription> {
    return await apiClient.get<Subscription>('/subscriptions/me');
  }

  async subscribe(planId: string): Promise<Subscription> {
    return await apiClient.post<Subscription>('/subscriptions', { planId });
  }

  async cancel(): Promise<Subscription> {
    return await apiClient.post<Subscription>('/subscriptions/cancel');
  }
}

export const subscriptionApi = new SubscriptionApi();


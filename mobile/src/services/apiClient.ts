import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import env from '../config/env';
import { ApiResponse } from '../types';
import { getAuthTokens, clearAuthTokens } from '../utils/storage';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: env.apiUrl,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor - add auth token
    this.client.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        const tokens = await getAuthTokens();
        if (tokens?.accessToken && config.headers) {
          config.headers.Authorization = `Bearer ${tokens.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - handle errors
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError<ApiResponse>) => {
        if (error.response) {
          const { status, data } = error.response;

          // Handle 401 - Unauthorized
          if (status === 401) {
            // Try to refresh token
            const refreshed = await this.refreshToken();
            if (refreshed && error.config) {
              // Retry original request
              return this.client.request(error.config);
            } else {
              // Clear tokens and redirect to login
              await clearAuthTokens();
              // Navigate to login (handled by navigation)
            }
          }

          // Handle 403 - Forbidden
          if (status === 403) {
            throw new Error(data?.error || 'Access forbidden');
          }

          // Handle 400 - Bad Request
          if (status === 400) {
            throw new Error(data?.error || 'Invalid request');
          }

          // Handle 500 - Server Error
          if (status >= 500) {
            throw new Error(data?.error || 'Server error. Please try again later.');
          }
        } else if (error.request) {
          // Network error
          throw new Error('Network error. Please check your connection.');
        }

        return Promise.reject(error);
      }
    );
  }

  private async refreshToken(): Promise<boolean> {
    try {
      const tokens = await getAuthTokens();
      if (!tokens?.refreshToken) {
        return false;
      }

      const response = await axios.post(`${env.apiUrl}/auth/refresh`, {
        refreshToken: tokens.refreshToken,
      });

      if (response.data.success && response.data.data?.tokens) {
        // Store new tokens
        // Implementation depends on storage utility
        return true;
      }

      return false;
    } catch (error) {
      return false;
    }
  }

  async get<T = any>(url: string, config?: any): Promise<T> {
    const response = await this.client.get<ApiResponse<T>>(url, config);
    if (response.data.success && response.data.data !== undefined) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'Request failed');
  }

  async post<T = any>(url: string, data?: any, config?: any): Promise<T> {
    const response = await this.client.post<ApiResponse<T>>(url, data, config);
    if (response.data.success && response.data.data !== undefined) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'Request failed');
  }

  async put<T = any>(url: string, data?: any, config?: any): Promise<T> {
    const response = await this.client.put<ApiResponse<T>>(url, data, config);
    if (response.data.success && response.data.data !== undefined) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'Request failed');
  }

  async delete<T = any>(url: string, config?: any): Promise<T> {
    const response = await this.client.delete<ApiResponse<T>>(url, config);
    if (response.data.success && response.data.data !== undefined) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'Request failed');
  }
}

export const apiClient = new ApiClient();


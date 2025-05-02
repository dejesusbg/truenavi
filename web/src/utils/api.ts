import { authToken } from '@/services/auth';

export interface Response {
  success: boolean;
  token: string;
  error: string;
}

export const api = {
  get: async <T>(endpoint: string): Promise<T> => fetchData<T>(endpoint, 'GET'),
  post: async <T>(endpoint: string, body: any): Promise<T> => fetchData<T>(endpoint, 'POST', body),
  put: async <T>(endpoint: string, body: any): Promise<T> => fetchData<T>(endpoint, 'PUT', body),
  del: async <T>(endpoint: string): Promise<T> => fetchData<T>(endpoint, 'DELETE'),
};

async function fetchData<T>(endpoint: string, method: string, body?: any): Promise<T> {
  const NEXT_PUBLIC_API = process.env.NEXT_PUBLIC_API;
  const JWT_TOKEN = authToken.get();

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (JWT_TOKEN) headers.Authorization = `Bearer ${JWT_TOKEN}`;

  const options: RequestInit = { method, headers };
  if (body) options.body = JSON.stringify(body);

  const response = await fetch(`${NEXT_PUBLIC_API}/${endpoint}`, options);
  return response.json();
}

import { api, authToken, Response } from '@/services/api';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

type AuthResponse = Response<any>;

export async function registerUser(name: string, email: string, password: string) {
  return await api.post<AuthResponse>('auth/register', { name, email, password });
}

export async function loginUser(email: string, password: string, router: AppRouterInstance) {
  const res = await api.post<AuthResponse>('auth/login', { email, password });
  if (res.success) authToken.set(res.token, router);
  return res;
}

export async function logoutUser(router: AppRouterInstance) {
  const res = await api.get<AuthResponse>('auth/logout');
  if (res.success) authToken.clear(router);
  return res;
}

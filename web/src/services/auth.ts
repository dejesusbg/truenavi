import { api, Response } from '@/utils/api';
import { redirect } from 'next/navigation';

type AuthResponse = Response<any>;

export const authToken = {
  set: (token: string): void => localStorage.setItem('JWT_TOKEN', token),
  get: (): string => localStorage.getItem('JWT_TOKEN') || '',
  remove: (): void => localStorage.removeItem('JWT_TOKEN'),
};

export const handleAuth = () => !authToken.get() && redirect('/login');

export async function registerUser(name: string, email: string, password: string) {
  const res = await api.post<AuthResponse>('auth/register', { name, email, password });
  if (res.success) authToken.set(res.token);
  return res;
}

export async function loginUser(email: string, password: string) {
  const res = await api.post<AuthResponse>('auth/login', { email, password });
  if (res.success) authToken.set(res.token);
  return res;
}

export async function logoutUser() {
  const res = await api.get<AuthResponse>('auth/logout');
  if (res.success) authToken.remove();
  return res;
}

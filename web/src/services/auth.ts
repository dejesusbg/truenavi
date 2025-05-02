import { api, Response } from '@/utils/api';

export const authToken = {
  set: (token: string): void => localStorage.setItem('JWT_TOKEN', token),
  get: (): string => localStorage.getItem('JWT_TOKEN') || '',
  remove: (): void => localStorage.removeItem('JWT_TOKEN'),
};

export async function registerUser(email: string, password: string) {
  try {
    const res = await api.post<Response>('auth/register', { name: 'New Admin', email, password });
    if (res.success) authToken.set(res.token);
    return res;
  } catch (error) {
    console.error('[Auth] Error during registration:', error);
    return { success: false, error: 'Registration failed. Please try again.' };
  }
}

export async function loginUser(email: string, password: string) {
  try {
    const res = await api.post<Response>('auth/login', { email, password });
    if (res.success) authToken.set(res.token);
    return res;
  } catch (error) {
    console.error('[Auth] Error during login:', error);
    return { success: false, error: 'Login failed. Please try again.' };
  }
}

export async function logoutUser() {
  try {
    const res = await api.get<Response>('auth/logout');
    if (res.success) authToken.remove();
    return res;
  } catch (error) {
    console.error('[Auth] Error during logout:', error);
    return { success: false, error: 'Logout failed. Please try again.' };
  }
}

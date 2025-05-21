import { api, authToken } from '@/services/api';
import { AuthResponse } from '@/services/types';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

/**
 * Registers a new user.
 *
 * @param name - The name of the user.
 * @param email - The email address of the user.
 * @param password - The password for the user account.
 * @returns A promise that resolves to the API response.
 */
export async function registerUser(name: string, email: string, password: string) {
  return await api.post<AuthResponse>('auth/register', { name, email, password });
}

/**
 * Logs in an existing user.
 *
 * @param email - The email address of the user.
 * @param password - The password for the user account.
 * @param router - The router instance for navigation.
 * @returns A promise that resolves to the API response.
 */
export async function loginUser(email: string, password: string, router: AppRouterInstance) {
  const res = await api.post<AuthResponse>('auth/login', { email, password });
  if (res.success) authToken.set(res.token, router);
  return res;
}
/**
 * Logs out the current user.
 *
 * @param router - The router instance for navigation.
 * @returns A promise that resolves to the API response.
 */
export async function logoutUser(router: AppRouterInstance) {
  const res = await api.get<AuthResponse>('auth/logout');
  if (res.success) authToken.clear(router);
  return res;
}

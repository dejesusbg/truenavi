import { parse, serialize } from 'cookie';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

export const api = {
  get: async <T>(endpoint: string): Promise<T> => fetchData<T>(endpoint, 'GET'),
  post: async <T>(endpoint: string, body: any): Promise<T> => fetchData<T>(endpoint, 'POST', body),
  put: async <T>(endpoint: string, body: any): Promise<T> => fetchData<T>(endpoint, 'PUT', body),
  del: async <T>(endpoint: string): Promise<T> => fetchData<T>(endpoint, 'DELETE'),
};

async function fetchData<T>(endpoint: string, method: string, body?: any): Promise<T> {
  const NEXT_PUBLIC_API = process.env.NEXT_PUBLIC_API;
  const JWT_TOKEN = authToken();

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (JWT_TOKEN) headers.Authorization = `Bearer ${JWT_TOKEN}`;

  const options: RequestInit = { method, headers };
  if (body) options.body = JSON.stringify(body);

  try {
    const response = await fetch(`${NEXT_PUBLIC_API}/${endpoint}`, options);
    const data = await response.json();
    if (!response.ok) console.error(`Error fetching from ${endpoint}:`, data.error);
    return data;
  } catch (error) {
    console.error(`Network or unexpected error:`, error);
    return Promise.reject({ success: false, data: [], error });
  }
}

export const authToken = (): string | null => {
  const cookies = parse(document.cookie);
  return cookies.access_token || null;
};

authToken.set = (token: string, router: AppRouterInstance): void => {
  const options = {
    secure: process.env.NODE_ENV === 'production',
    sameSite: true,
    path: '/',
    maxAge: 7200,
  };
  document.cookie = serialize('access_token', token, options);
  router.push('/admin');
};

authToken.clear = (router: AppRouterInstance): void => {
  const options = {
    secure: process.env.NODE_ENV === 'production',
    sameSite: true,
    path: '/',
    expires: new Date(0),
  };
  document.cookie = serialize('access_token', '', options);
  router.push('/');
};

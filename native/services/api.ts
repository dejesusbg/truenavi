import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

export const api = {
  get: async <T>(endpoint: string): Promise<T> => fetchData<T>(endpoint, 'GET'),
  post: async <T>(endpoint: string, body: any): Promise<T> => fetchData<T>(endpoint, 'POST', body),
  put: async <T>(endpoint: string, body: any): Promise<T> => fetchData<T>(endpoint, 'PUT', body),
  del: async <T>(endpoint: string): Promise<T> => fetchData<T>(endpoint, 'DELETE'),
};

async function fetchData<T>(endpoint: string, method: string, body?: T): Promise<T> {
  const EXPO_PUBLIC_API = process.env.EXPO_PUBLIC_API;
  const id = await deviceId();

  const headers: HeadersInit = { 'Content-Type': 'application/json', 'device-id': id };
  const options: RequestInit = { method, headers };
  if (body) options.body = JSON.stringify(body);

  try {
    console.log(`[${method}] Request to ${endpoint}:`, body);
    const response = await fetch(`${EXPO_PUBLIC_API}/${endpoint}`, options);
    return response.json();
  } catch (error) {
    console.error(`[${method}] Error fetching data from ${endpoint}:`, error);
    return Promise.reject(error);
  }
}

export const deviceId = async (): Promise<string> => {
  try {
    const existingId = await AsyncStorage.getItem('device-id');
    if (existingId) return existingId;

    const newId = uuidv4();
    await AsyncStorage.setItem('device-id', newId);
    return newId;
  } catch (error) {
    console.error('[AsyncStorage] Error during setting:', error);
    return '';
  }
};

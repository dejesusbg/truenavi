import { Locale } from '~/utils/text';
import { api } from './api';
import { PreferencesProps, PreferencesResponse } from './types';

export async function getPreferences() {
  return await api.get<PreferencesResponse>('preferences');
}

export async function updatePreferences(preferences: PreferencesProps) {
  return await api.put<PreferencesResponse>('preferences', preferences);
}

export async function resetPreferences() {
  await updatePreferences({ spanish: true, weather: true, vibration: true, isFirstTime: true });
}

export function getLocale(spanish: boolean): Locale {
  return spanish ? 'es-CO' : 'en-GB';
}

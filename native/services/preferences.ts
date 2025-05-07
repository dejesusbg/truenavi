import { api, Response } from '~/services/api';

export interface PreferencesProps {
  spanish?: boolean;
  weather?: boolean;
  vibration?: boolean;
  isFirstTime?: boolean;
}

export const defaultPreferences: PreferencesProps = {
  spanish: true,
  weather: true,
  vibration: true,
  isFirstTime: true,
};

export type PreferencesResponse = Response<PreferencesProps>;

export async function getPreferences() {
  return await api.get<PreferencesResponse>('preferences');
}

export async function updatePreferences(preferences: PreferencesProps) {
  return await api.put<PreferencesResponse>('preferences', preferences);
}

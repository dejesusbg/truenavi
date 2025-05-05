import { api, Response } from '~/utils/api';

export interface PreferencesProps {
  spanish?: boolean;
  weather?: boolean;
  vibration?: boolean;
}

export const emptyPreferences: PreferencesProps = { spanish: true, weather: true, vibration: true };
export type PreferencesResponse = Response<PreferencesProps>;

export async function getPreferences() {
  return await api.get<PreferencesResponse>('preferences');
}

export async function updatePreferences(preferences: PreferencesProps) {
  return await api.put<PreferencesResponse>('preferences', preferences);
}

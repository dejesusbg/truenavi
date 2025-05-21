import { Locale } from '~/utils/text';
import { api } from './api';
import { PreferencesResponse } from './types';

/**
 * Retrieves the user preferences from the API.
 * @returns A promise that resolves to the user's preferences as a `PreferencesResponse`.
 */
export async function getPreferences() {
  return await api.get<PreferencesResponse>('preferences');
}

/**
 * Updates user preferences by sending a PUT request to the 'preferences' endpoint.
 *
 * @param preferences - An object where each key is a preference name and the value is a boolean indicating its state.
 * @returns A promise that resolves to a `PreferencesResponse` object.
 */
export async function updatePreferences(preferences: Record<string, boolean>) {
  return await api.put<PreferencesResponse>('preferences', preferences);
}

/**
 * Resets user preferences to their default values.
 * This function updates the preferences by setting all of them to `true`.
 * @returns A promise that resolves when the preferences have been updated.
 */
export async function resetPreferences() {
  await updatePreferences({ spanish: true, weather: true, vibration: true, isFirstTime: true });
}

/**
 * Returns the locale string based on the provided language preference.
 *
 * @param spanish - If `true`, returns the `es-CO` locale; otherwise, returns the `en-GB` locale.
 * @returns The locale string corresponding to the selected language.
 */
export function getLocale(spanish: boolean): Locale {
  return spanish ? 'es-CO' : 'en-GB';
}

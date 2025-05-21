import { Audio } from 'expo-av';
import * as Location from 'expo-location';
import { useCallback, useEffect, useState } from 'react';

/**
 * Custom hook that requests and manages permissions for location and audio access.
 *
 * This hook asynchronously requests foreground location and audio recording permissions when the component mounts. It returns a boolean indicating whether both permissions have been granted.
 *
 * @returns `true` if both location and audio permissions are granted, otherwise `false`.
 */
export function usePermissions(): boolean {
  const [granted, setGranted] = useState(false);

  const requestPermissions = useCallback(async () => {
    try {
      const locationStatus = await Location.requestForegroundPermissionsAsync();
      const audioStatus = await Audio.requestPermissionsAsync();

      const allGranted = locationStatus.status === 'granted' && audioStatus.status === 'granted';
      setGranted(allGranted);
    } catch (err) {
      console.error('[Permission] Error during request:', err);
      setGranted(false);
    }
  }, []);

  useEffect(() => {
    requestPermissions();
  }, [requestPermissions]);

  return granted;
}

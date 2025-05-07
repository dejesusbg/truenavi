import { useCallback, useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { Audio } from 'expo-av';

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

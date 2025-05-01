import { useEffect, useState, useCallback } from 'react';
import * as Location from 'expo-location';
import { Audio } from 'expo-av';

export default function usePermissions() {
  const [granted, setGranted] = useState(false);

  const requestPermissions = useCallback(async () => {
    try {
      const locationStatus = await Location.requestForegroundPermissionsAsync();
      const audioStatus = await Audio.requestPermissionsAsync();

      const allGranted = locationStatus.status === 'granted' && audioStatus.status === 'granted';
      setGranted(allGranted);
    } catch (err) {
      console.error('[permission]: ', err);
      setGranted(false);
    }
  }, []);

  useEffect(() => {
    requestPermissions();
  }, [requestPermissions]);

  return granted;
}

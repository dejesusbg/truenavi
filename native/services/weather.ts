import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { fetchWeatherApi } from 'openmeteo';

const CACHE_EXPIRATION_TIME = 10 * 60 * 1000;

export async function getWeather(): Promise<Record<string, number>> {
  const cachedWeather = await getCachedWeather();

  if (cachedWeather && !isCacheExpired(cachedWeather.timestamp)) {
    return cachedWeather.data;
  } else {
    const location = await Location.getCurrentPositionAsync();

    const params = { current: ['apparent_temperature', 'precipitation'], ...location.coords };
    const url = 'https://api.open-meteo.com/v1/forecast';
    const responses = await fetchWeatherApi(url, params);
    const weather = responses[0].current()!;

    const data = {
      temperature: Number(weather.variables(0)!.value().toFixed(2)),
      rain: Number((weather.variables(1)!.value() * 100).toFixed(2)),
    };

    await cacheWeather(data);
    return data;
  }
}

async function getCachedWeather() {
  try {
    const cached = await AsyncStorage.getItem('cache-weather');
    return cached ? JSON.parse(cached) : null;
  } catch (error) {
    console.error('[AsyncStorage] Error during getting:', error);
    return null;
  }
}

function isCacheExpired(timestamp: number) {
  return Date.now() - timestamp > CACHE_EXPIRATION_TIME;
}

async function cacheWeather(data: Record<string, number>) {
  const cache = { data, timestamp: Date.now() };
  try {
    await AsyncStorage.setItem('cache-weather', JSON.stringify(cache));
  } catch (error) {
    console.error('[AsyncStorage] Error during setting:', error);
  }
}

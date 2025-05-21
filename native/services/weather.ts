import AsyncStorage from '@react-native-async-storage/async-storage';
import { LocationObjectCoords } from 'expo-location';
import { fetchWeatherApi } from 'openmeteo';

const CACHE_EXPIRATION_TIME = 10 * 60 * 1000;

/**
 * Retrieves the current weather data for the specified coordinates.
 *
 * This function first attempts to return cached weather data if available and not expired.
 * If the cache is expired or unavailable, it fetches the latest weather information from the Open-Meteo API,
 * processes the response, caches the result, and returns the data.
 *
 * @param coords - The geographic coordinates for which to retrieve weather data.
 * @returns A promise that resolves to an object containing the temperature and rain values.
 */
export async function getWeather(coords: LocationObjectCoords): Promise<Record<string, number>> {
  const cachedWeather = await getCachedWeather();

  if (cachedWeather && !isCacheExpired(cachedWeather.timestamp)) {
    return cachedWeather.data;
  } else {
    const params = { current: ['apparent_temperature', 'precipitation'], ...coords };
    const url = 'https://api.open-meteo.com/v1/forecast';
    const responses = await fetchWeatherApi(url, params);
    const weather = responses[0].current()!;

    const data = {
      temperature: Math.round(weather.variables(0)!.value()),
      rain: Math.round(weather.variables(1)!.value() * 100),
    };

    await cacheWeather(data);
    return data;
  }
}

/**
 * Retrieves cached weather data from AsyncStorage.
 *
 * Attempts to fetch the weather data stored under the key 'cache-weather'.
 * If the data exists, it is parsed from JSON and returned. If not found or if an error occurs,
 * the function returns `null`.
 *
 * @returns A promise that resolves to the cached weather data object, or `null` if not found or on error.
 */
async function getCachedWeather() {
  try {
    const cached = await AsyncStorage.getItem('cache-weather');
    return cached ? JSON.parse(cached) : null;
  } catch (error) {
    console.error('[AsyncStorage] Error during getting:', error);
    return null;
  }
}

/**
 * Determines whether the cached data has expired based on the provided timestamp.
 *
 * @param timestamp - The timestamp (in milliseconds) when the cache was last updated.
 * @returns `true` if the cache has expired; otherwise, `false`.
 *
 * @remarks
 * The function compares the current time with the given timestamp and checks if the
 * difference exceeds the `CACHE_EXPIRATION_TIME` constant.
 */
function isCacheExpired(timestamp: number) {
  return Date.now() - timestamp > CACHE_EXPIRATION_TIME;
}

/**
 * Caches weather data along with the current timestamp in AsyncStorage.
 *
 * @param data - An object containing weather data, where keys are strings and values are numbers.
 * @returns A promise that resolves when the data has been cached.
 * @remarks
 * If an error occurs during the caching process, it will be logged to the console.
 */
async function cacheWeather(data: Record<string, number>) {
  const cache = { data, timestamp: Date.now() };
  try {
    await AsyncStorage.setItem('cache-weather', JSON.stringify(cache));
  } catch (error) {
    console.error('[AsyncStorage] Error during setting:', error);
  }
}

import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { StyleSheet } from 'react-native';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [loaded, error] = useFonts({
    Inter: require('../assets/fonts/InterVariable.ttf'),
    'Inter-800': require('../assets/fonts/Inter-ExtraBold.ttf'),
    'Inter-700': require('../assets/fonts/Inter-Bold.ttf'),
    'Inter-600': require('../assets/fonts/Inter-SemiBold.ttf'),
    'Inter-500': require('../assets/fonts/Inter-Medium.ttf'),
    'Inter-400': require('../assets/fonts/Inter-Regular.ttf'),
    'Inter-300': require('../assets/fonts/Inter-Light.ttf'),
    'Inter-200': require('../assets/fonts/Inter-Thin.ttf'),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <SafeAreaProvider style={styles.safeAreaProvider}>
      <StatusBar style="auto" />
      <Stack
        initialRouteName="index"
        screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#0d1634' } }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="login" />
        <Stack.Screen name="map" />
        <Stack.Screen name="admin" />
      </Stack>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeAreaProvider: { backgroundColor: '#0d1634' },
  safeAreaView: { flex: 1, padding: 0 },
});

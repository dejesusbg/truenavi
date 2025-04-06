import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import * as NavigationBar from 'expo-navigation-bar';
import { useEffect } from 'react';
import { StyleSheet } from 'react-native';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [loaded, error] = useFonts({
    Inter: require('../assets/fonts/InterVariable.ttf'),
    Ubuntu: require('../assets/fonts/Ubuntu-Medium.ttf'),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
      NavigationBar.setVisibilityAsync('hidden');
      NavigationBar.setBehaviorAsync('overlay-swipe');
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
      </Stack>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeAreaProvider: { backgroundColor: '#0d1634' },
  safeAreaView: { flex: 1, padding: 0 },
});

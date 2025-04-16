module.exports = {
  expo: {
    name: 'truenavi',
    slug: 'truenavi',
    version: '1.0.0',
    scheme: 'truenavi',
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/favicon.png',
    },
    plugins: [
      'expo-router',
      [
        'expo-font',
        {
          fonts: [
            './assets/fonts/InterVariable.ttf',
            './assets/fonts/Inter-ExtraBold.ttf',
            './assets/fonts/Inter-Bold.ttf',
            './assets/fonts/Inter-SemiBold.ttf',
            './assets/fonts/Inter-Medium.ttf',
            './assets/fonts/Inter-Regular.ttf',
            './assets/fonts/Inter-Light.ttf',
            './assets/fonts/Inter-Thin.ttf',
          ],
        },
      ],
      [
        'expo-av',
        {
          microphonePermission: 'Allow truenavi to access your microphone for voice commands.',
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
      tsconfigPaths: true,
    },
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'dark',
    newArchEnabled: true,
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#0d1634',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#0d1634',
      },
      permissions: ['ACCESS_FINE_LOCATION', 'RECORD_AUDIO'],
    },
    androidNavigationBar: {
      backgroundColor: '#0d1634',
    },
  },
};

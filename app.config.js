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
            './assets/fonts/Ubuntu-Bold.ttf',
            './assets/fonts/Ubuntu-Medium.ttf',
            './assets/fonts/Ubuntu-Regular.ttf',
            './assets/fonts/Ubuntu-Light.ttf',
          ],
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
      backgroundColor: '#ffffff',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
    },
    androidNavigationBar: {
      backgroundColor: '#0d1634',
    },
  },
};

import { ImageBackground, Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Header from './Header';
import { BlurView } from 'expo-blur';

interface ScreenViewProps {
  title: string;
  icons?: {
    name: string;
    onPress?: () => void;
  }[];
  goBack?: boolean;
  children?: React.ReactNode;
}

const ScreenView = ({ title, icons, children, goBack }: ScreenViewProps) => {
  const insets = useSafeAreaInsets();

  return (
    <ImageBackground
      style={styles.background}
      resizeMode="cover"
      source={require('../assets/background.jpeg')}
      blurRadius={Platform.OS == 'android' ? 50 : 0}>
      <View
        style={[
          styles.body,
          {
            paddingTop: insets.top + 10,
            paddingBottom: insets.bottom + 10,
            paddingLeft: insets.left + 10,
            paddingRight: insets.right + 10,
          },
        ]}>
        <Header title={title} icons={icons} goBack={goBack} />
        <View style={styles.main}>{children}</View>
      </View>
    </ImageBackground>
  );
};

export default ScreenView;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0009',
    backdropFilter: 'blur(50px)',
  },
  main: {
    flex: 1,
    width: Platform.OS == 'web' ? 800 : 340,
  },
});

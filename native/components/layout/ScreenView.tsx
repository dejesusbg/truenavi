import { ImageBackground, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Header } from '~/components/layout/Header';
import Theme from '~/components/theme/Palette';

interface ScreenViewProps {
  title?: string;
  icons?: { name: string; onPress?: () => void }[];
  goBack?: boolean;
  children?: React.ReactNode;
}

export function ScreenView({ title, icons, children, goBack }: ScreenViewProps) {
  const insets = useSafeAreaInsets();

  return (
    <ImageBackground
      style={styles.background}
      resizeMode="cover"
      source={require('../../assets/background.jpeg')}
      blurRadius={50}>
      <View
        style={[
          styles.body,
          {
            paddingTop: insets.top + 10,
            paddingBottom: insets.bottom + 70,
            paddingLeft: insets.left + 10,
            paddingRight: insets.right + 10,
          },
        ]}>
        <Header title={title} icons={icons} goBack={goBack} />
        <View style={styles.main}>{children}</View>
      </View>
    </ImageBackground>
  );
}

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
    backgroundColor: Theme.overlay,
    backdropFilter: 'blur(50px)',
  },
  main: {
    flex: 1,
    width: 340,
  },
});

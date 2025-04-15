import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Text, { fontStyle } from './Text';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';

interface HeaderProps {
  title?: string;
  goBack?: boolean;
  icons?: {
    name: string;
    onPress?: () => void;
  }[];
}

const Header = ({ title, icons, goBack = false }: HeaderProps) => {
  const router = useRouter();

  return (
    <View style={styles.header}>
      <View style={styles.section}>
        {goBack && (
          <TouchableOpacity style={styles.button} onPress={router.back} activeOpacity={0.7}>
            <MaterialIcons style={styles.buttonIcon} name="arrow-back-ios" size={24} />
          </TouchableOpacity>
        )}
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.section}>
        {icons &&
          icons.length > 0 &&
          icons.map(({ name, onPress }, index) => (
            <TouchableOpacity
              key={index}
              style={styles.button}
              onPress={onPress}
              activeOpacity={0.7}>
              <MaterialIcons style={styles.buttonIcon} name={name} size={24} />
            </TouchableOpacity>
          ))}
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  header: {
    paddingVertical: 20,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  title: {
    fontSize: 20,
    paddingHorizontal: 3,
    fontWeight: 600,
    color: '#fff',
    ...fontStyle,
  },
  button: {
    width: 30,
    height: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    color: '#fff',
  },
});

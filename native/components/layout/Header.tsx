import { useRouter } from 'expo-router';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Theme from '~/components/theme';
import { Text } from './Text';

export interface HeaderProps {
  title?: string;
  goBack?: boolean;
  icons?: { name: string; onPress?: () => void }[];
}

/**
 * Renders a customizable header component with an optional title, back button, and action icons.
 *
 * @param title - The title text to display in the header.
 * @param icons - An array of icon objects to display on the right side of the header. Each icon object should have a `name` (icon name) and an `onPress` handler.
 * @param goBack - If true, displays a back button on the left side of the header that navigates back when pressed.
 */
export function Header({ title, icons, goBack = false }: HeaderProps) {
  const router = useRouter();

  return (
    <View style={styles.header}>
      <View style={styles.section}>
        {goBack && (
          <TouchableOpacity style={styles.button} onPress={router.back} activeOpacity={0.7}>
            <MaterialIcons style={styles.buttonIcon} name="arrow-back-ios" size={24} />
          </TouchableOpacity>
        )}
        {title && <Text style={styles.title}>{title}</Text>}
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
}

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
    color: Theme.white,
  },
  button: {
    width: 30,
    height: 30,
    backgroundColor: Theme.btnHeader,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    color: Theme.white,
  },
});

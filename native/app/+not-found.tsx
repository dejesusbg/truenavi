import { Link, Stack } from 'expo-router';
import { Text, StyleSheet } from 'react-native';
import Theme, { ScreenView } from '~/components';

export default function NotFoundView() {
  return (
    <>
      <Stack.Screen options={{ title: 'oops!' }} />
      <ScreenView title="not found">
        <Text style={styles.title}>this route doesn't exist</Text>
        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>navigate home</Text>
        </Link>
      </ScreenView>
    </>
  );
}

const styles = StyleSheet.create({
  title: {
    color: Theme.white,
    fontSize: 24,
    fontWeight: 600,
    textAlign: 'center',
    marginTop: 12,
  },
  link: {
    textAlign: 'center',
    marginTop: 12,
  },
  linkText: {
    fontWeight: 500,
    fontSize: 16,
    color: Theme.link,
  },
});

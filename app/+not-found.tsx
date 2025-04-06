import { Link, Stack } from 'expo-router';
import { Text, StyleSheet } from 'react-native';
import { Container } from '~/components/Container';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <Container>
        <Text style={styles.title}>This screen doesn't exist.</Text>
        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Go to home screen!</Text>
        </Link>
      </Container>
    </>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 16,
    paddingTop: 16,
  },
  linkText: {
    fontSize: 16,
    color: '#2e78b7',
  },
});

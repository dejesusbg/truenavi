import { useRouter } from 'expo-router';

/**
 * Redirects the user to the home page when the current route is not found.
 *
 * This component uses the router to programmatically navigate to the root path ('/').
 * Intended to be used as a catch-all for undefined routes.
 */
export default function NotFoundView() {
  const router = useRouter();
  router.push('/');
}

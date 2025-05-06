import { useRouter } from 'expo-router';

export default function NotFoundView() {
  const router = useRouter();
  router.push('/');
}

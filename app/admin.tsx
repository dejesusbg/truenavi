import { useRouter } from 'expo-router';
import ScreenView from '~/components/ScreenView';

const Admin = () => {
  const router = useRouter();

  return <ScreenView title="admin"
    icons={[
      { name: 'map', onPress: () => router.push('/map') },
      { name: 'settings', onPress: () => router.push('/settings') }
    ]}
    goBack={true}
  />;
};

export default Admin;

import { useRouter } from 'expo-router';
import ScreenView from '~/components/ScreenView';

const Map = () => {
  const router = useRouter();

  return <ScreenView title="map"
    icons={[
      { name: 'admin-panel-settings', onPress: () => router.push('/admin') },
      { name: 'settings', onPress: () => router.push('/settings') }
    ]}
    goBack={true}
    />;
};

export default Map;

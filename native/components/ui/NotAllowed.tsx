import { Linking, StyleSheet, TouchableOpacity } from 'react-native';
import ScreenView from '~/components/layout/ScreenView';
import { View } from 'react-native';
import Text from '~/components/Text';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default function NotAllowedView() {
  return (
    <ScreenView>
      <View style={styles.container}>
        <View style={styles.subContainer}>
          <MaterialIcons name="location-off" style={styles.sectionIcon} />
          <TouchableOpacity onPress={() => Linking.openSettings()}>
            <Text style={styles.sectionText}>
              abre los ajustes para activar los permisos necesarios para que truenavi funcione
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 'auto',
  },
  subContainer: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 32,
  },
  sectionText: {
    fontSize: 24,
    lineHeight: 36,
    fontWeight: 600,
    color: '#fff',
    textAlign: 'center',
  },
  sectionIcon: {
    fontSize: 48,
    color: 'rgba(255, 255, 255, 0.7)',
  },
});

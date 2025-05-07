import { View, Linking, StyleSheet, TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { Text, ScreenView } from '../layout';
import Theme from '../theme';

export function PermissionView() {
  return (
    <ScreenView>
      <View style={styles.container}>
        <View style={styles.subContainer}>
          <MaterialIcons name="location-off" style={styles.sectionIcon} />
          <TouchableOpacity onPress={() => Linking.openSettings()}>
            <Text style={styles.sectionText}>
              enable the necessary permissions in the settings so truenavi can function properly
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
    color: Theme.white,
    textAlign: 'center',
  },
  sectionIcon: {
    fontSize: 48,
    color: Theme.icon,
  },
});

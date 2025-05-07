import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Map from 'react-native-maps';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { ScreenView, Text } from '~/components/layout';
import Theme from '~/components/theme';
import { direction, FlowState } from '~/utils/flow';

export interface Navigation {
  [instruction: string]: string;
}

export const navigationFlow: Navigation = {
  'turn-left': 'turn to the left',
  'turn-right': 'turn to the right',
  'turn-slight-left': 'turn slightly to the left',
  'turn-slight-right': 'turn slightly to the right',
  'arrow-upward': 'go straight',
  'auto-awesome': 'rerouting',
  cloud: 'rain chance of',
  place: 'your destination is here',
};

export function NavigationView({ state, finish }: { state: FlowState; finish: () => void }) {
  const [region, setRegion] = useState<{
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  } | null>(null);

  const { navigationSteps, navigationIndex, destination } = state;
  const currentInstruction = direction[navigationSteps[navigationIndex].id];
  const distanceToNext = navigationSteps[navigationIndex].value;

  useEffect(() => {
    const getLocation = async () => {
      const location = await Location.getCurrentPositionAsync({});
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0005,
        longitudeDelta: 0.0005,
      });
    };

    getLocation();
  }, []);

  return (
    <ScreenView title="navigation" icons={[{ name: 'close', onPress: finish }]}>
      <View style={styles.container}>
        <View style={styles.mapContainer}>
          {region && (
            <Map
              style={styles.map}
              region={region}
              userInterfaceStyle="dark"
              showsUserLocation
              showsCompass
              showsScale
            />
          )}
          <View style={styles.destinationOverlay}>
            <MaterialIcons name="navigation" style={styles.destinationIcon} />
            <Text style={styles.destinationText}>{destination}</Text>
          </View>
        </View>

        <View style={styles.instructionContainer}>
          <View style={styles.instructionIconContainer}>
            <MaterialIcons name={currentInstruction.icon} style={styles.instructionIcon} />
          </View>
          <View style={styles.instructionTextContainer}>
            <Text style={styles.instructionText}>{currentInstruction.output}</Text>
            {distanceToNext && <Text style={styles.distanceText}>{distanceToNext}</Text>}
          </View>
        </View>
      </View>
    </ScreenView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
  },
  mapContainer: {
    flex: 2,
    borderRadius: 12,
    marginTop: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  destinationOverlay: {
    position: 'absolute',
    bottom: -1,
    left: 0,
    right: 0,
    justifyContent: 'center',
    backgroundColor: Theme.overlay,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  destinationIcon: {
    fontSize: 24,
    color: Theme.icon,
  },
  destinationText: {
    fontSize: 16,
    color: Theme.white,
    fontWeight: '600',
  },
  instructionContainer: {
    backgroundColor: Theme.container,
    borderRadius: 16,
    padding: 16,
    gap: 16,
    flexDirection: 'row',
  },
  instructionIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Theme.status,
    justifyContent: 'center',
    alignItems: 'center',
  },
  instructionIcon: {
    fontSize: 32,
    color: Theme.white,
  },
  instructionTextContainer: {
    flex: 1,
  },
  instructionText: {
    fontSize: 24,
    fontWeight: '600',
    color: Theme.white,
  },
  distanceText: {
    fontSize: 16,
    color: Theme.foreground,
    marginTop: 4,
  },
});

import * as Location from 'expo-location';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Map, { LatLng, Marker, Polyline } from 'react-native-maps';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { ScreenView, Text } from '~/components/layout';
import Theme from '~/components/theme';
import { direction, endNavigation, FlowDispatch, FlowState } from '~/utils/flow';

function getRegion(points: LatLng[]) {
  const minLatitude = Math.min(...points.map((point) => point.latitude));
  const maxLatitude = Math.max(...points.map((point) => point.latitude));
  const minLongitude = Math.min(...points.map((point) => point.longitude));
  const maxLongitude = Math.max(...points.map((point) => point.longitude));

  // calculate the center of the region
  const centerLatitude = (minLatitude + maxLatitude) / 2;
  const centerLongitude = (minLongitude + maxLongitude) / 2;

  // calculate the deltas
  const latitudeDelta = maxLatitude - minLatitude;
  const longitudeDelta = maxLongitude - minLongitude;

  // construct the region object
  return {
    latitude: centerLatitude,
    longitude: centerLongitude,
    latitudeDelta: latitudeDelta * 1.25,
    longitudeDelta: longitudeDelta * 1.25,
  };
}

export function NavigationView({ state, dispatch }: { state: FlowState; dispatch: FlowDispatch }) {
  const onPress = () => endNavigation(dispatch);
  const { navigationSteps, navigationIndex, destination, path } = state;
  const { id, value, node } = navigationSteps[navigationIndex];
  const { icon, output } = direction[id];

  const points = path.map((edge) => ({
    latitude: edge.coordinates[0],
    longitude: edge.coordinates[1],
  }));

  const region = getRegion(points);

  return (
    <ScreenView title="navigation" icons={[{ name: 'close', onPress }]}>
      <View style={styles.container}>
        <View style={styles.mapContainer}>
          <Map style={styles.map} region={region} showsBuildings={false} showsUserLocation>
            <Polyline
              style={styles.line}
              coordinates={points}
              strokeColor="#3365a6"
              strokeWidth={8}
            />
            {points.map(
              (point, index) =>
                (index === 0 || index + 1 === points.length || node?._id === path[index]._id) && (
                  <Marker key={index} coordinate={point} title={path[index].name} />
                )
            )}
          </Map>
          <View style={styles.destinationOverlay}>
            <MaterialIcons name="navigation" style={styles.destinationIcon} />
            <Text style={styles.destinationText}>{destination}</Text>
          </View>
        </View>

        <View style={styles.instructionContainer}>
          <View style={styles.instructionIconContainer}>
            <MaterialIcons name={icon} style={styles.instructionIcon} />
          </View>
          <View style={styles.instructionTextContainer}>
            <Text style={styles.instructionText}>{output}</Text>
            {value && <Text style={styles.valueText}>{value}</Text>}
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
  line: {
    zIndex: 9999,
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
  valueText: {
    fontSize: 16,
    color: Theme.foreground,
    marginTop: 4,
  },
});

import { Image, StyleSheet, View } from 'react-native';
import Map, { LatLng, Marker, Polyline } from 'react-native-maps';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { ScreenView, Text } from '~/components/layout';
import Theme from '~/components/theme';
import { direction, endNavigation, FlowReducer } from '~/utils/flow';

/**
 * Calculates the center region and deltas for a set of geographical points.
 *
 * @param points - An array of objects representing latitude and longitude coordinates.
 * @returns An object containing the center latitude and longitude, as well as the latitudeDelta and longitudeDelta (expanded by 25% to provide padding around the region).
 */
function calculateRegion(points: LatLng[]) {
  const latitudes = points.map((point) => point.latitude);
  const longitudes = points.map((point) => point.longitude);

  const minLat = Math.min(...latitudes);
  const maxLat = Math.max(...latitudes);
  const minLong = Math.min(...longitudes);
  const maxLong = Math.max(...longitudes);

  return {
    latitude: (minLat + maxLat) / 2,
    longitude: (minLong + maxLong) / 2,
    latitudeDelta: (maxLat - minLat) * 1.25,
    longitudeDelta: (maxLong - minLong) * 1.25,
  };
}

function MapMarker({ coordinate, title, iconSource, style, anchor = { x: 0.5, y: 0.9 } }: any) {
  return (
    <Marker coordinate={coordinate} title={title} anchor={anchor}>
      <Image source={iconSource} style={style} resizeMode="center" resizeMethod="resize" />
    </Marker>
  );
}

/**
 * Renders the navigation view, displaying a map with the current navigation path, markers for start, end, and current location, as well as navigation instructions and destination information.
 *
 * @param state - The navigation state, including steps, current index, destination, and path.
 * @param dispatch - The dispatch function for navigation actions.
 *
 * @remarks
 * - The navigation path is a polyline on the map.
 * - Markers are for the start and end points of the route.
 * - It shows the user's current location and the current navigation segment, if available.
 * - The component visualizes the destination banner with an icon and destination name.
 * - Also the current navigation instruction, including an icon, instruction text, and value.
 * - The user can end navigation by pressing the close icon.
 */
export function NavigationView({ state, dispatch }: FlowReducer) {
  const { navigationSteps, navigationIndex, destination, path } = state;
  const { id, value, start, end } = navigationSteps[navigationIndex];
  const { icon, output } = direction[id];

  // convert path to map coordinates
  const points = path.map((edge) => ({
    latitude: edge.coordinates[0],
    longitude: edge.coordinates[1],
    ...edge,
  }));

  // get current location if available
  const currentLocation =
    start && !end ? { latitude: start.coordinates[0], longitude: start.coordinates[1] } : null;

  // get current segment if available
  const currentSegment =
    start && end
      ? [
          { latitude: start.coordinates[0], longitude: start.coordinates[1] },
          { latitude: end.coordinates[0], longitude: end.coordinates[1] },
        ]
      : [];

  // choose region based on available data
  const region = calculateRegion(
    currentLocation ? [currentLocation] : currentSegment.length ? currentSegment : points
  );

  const onPress = () => endNavigation(dispatch);

  return (
    <ScreenView title="navigation" icons={[{ name: 'close', onPress }]}>
      <View style={styles.container}>
        <View style={styles.mapContainer}>
          <Map style={styles.map} region={region} showsUserLocation>
            {/* path polyline */}
            <Polyline
              coordinates={points}
              strokeColor="rgba(51,101,166,0.8)"
              strokeWidth={8}
              zIndex={1}
              lineDashPattern={[2.5, 5]}
            />

            {/* start marker */}
            <MapMarker
              coordinate={points[0]}
              title={points[0].name}
              iconSource={require('assets/marker-pin.png')}
              style={styles.markerPin}
            />

            {/* end marker */}
            <MapMarker
              coordinate={points[points.length - 1]}
              title={points[points.length - 1].name}
              iconSource={require('assets/marker-pin.png')}
              style={styles.markerPin}
            />

            {/* current location marker */}
            {currentLocation && (
              <MapMarker
                coordinate={currentLocation}
                iconSource={require('assets/marker-location.png')}
                style={styles.markerLocation}
                anchor={{ x: 0.2, y: 0.2 }}
              />
            )}

            {/* current segment markers */}
            {currentSegment.map((node, index) => (
              <MapMarker
                key={index}
                coordinate={node}
                iconSource={require('assets/marker-location.png')}
                style={styles.markerLocation}
                anchor={{ x: 0.2, y: 0.2 }}
              />
            ))}
          </Map>

          {/* destination */}
          <View style={styles.destinationBanner}>
            <MaterialIcons name="navigation" style={styles.destinationIcon} />
            <Text style={styles.destinationText}>{destination}</Text>
          </View>
        </View>

        {/* navigation instructions */}
        <View style={styles.instructionCard}>
          <View style={styles.instructionIconWrapper}>
            <MaterialIcons name={icon} style={styles.instructionIcon} />
          </View>
          <View style={styles.instructionContent}>
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
  markerPin: {
    height: 36,
    width: 36,
  },
  markerLocation: {
    height: 12,
    width: 12,
  },
  destinationBanner: {
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
  instructionCard: {
    backgroundColor: Theme.container,
    borderRadius: 16,
    padding: 16,
    gap: 16,
    flexDirection: 'row',
  },
  instructionIconWrapper: {
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
  instructionContent: {
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

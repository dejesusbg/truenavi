import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Text from '~/components/Text';
import { useRouter } from 'expo-router';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MapView from 'react-native-maps';
import * as Location from 'expo-location';
import ScreenView from '~/components/layout/ScreenView';

const NavInstructions = ({ instruction, distance }: any) => {
  const getInstructionIcon = () => {
    switch (instruction) {
      case 'turn-left':
        return 'turn-left';
      case 'turn-right':
        return 'turn-right';
      case 'turn-slight-left':
        return 'turn-slight-left';
      case 'turn-slight-right':
        return 'turn-slight-right';
      case 'straight':
        return 'arrow-upward';
      case 'destination':
        return 'place';
      case 'reroute':
        return 'auto-awesome';
      case 'weather':
        return 'cloud';
      default:
        return 'navigation';
    }
  };

  return (
    <View style={styles.instructionContainer}>
      <View style={styles.instructionIconContainer}>
        <MaterialIcons name={getInstructionIcon()} style={styles.instructionIcon} />
      </View>
      <View style={styles.instructionTextContainer}>
        <Text style={styles.instructionText}>
          {instruction === 'turn-left' && 'gira a la izquierda'}
          {instruction === 'turn-right' && 'gira a la derecha'}
          {instruction === 'turn-slight-left' && 'gira ligeramente a la izquierda'}
          {instruction === 'turn-slight-right' && 'gira ligeramente a la derecha'}
          {instruction === 'straight' && 'continúa recto'}
          {instruction === 'destination' && 'has llegado a tu destino'}
          {instruction === 'reroute' && 'recalculando ruta'}
          {instruction === 'weather' && 'probabilidad de lluvia del 20%'}
        </Text>
        {distance && <Text style={styles.distanceText}>{distance} metros</Text>}
      </View>
    </View>
  );
};

export default function NavigationView() {
  const router = useRouter();
  const [region, setRegion] = useState<{
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  } | null>(null);
  const [currentInstruction, setCurrentInstruction] = useState('destination');
  const [distanceToNext, setDistanceToNext] = useState<string | null>(null);
  const [destination, setDestination] = useState('edificio bienestar');

  useEffect(() => {
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('permission to access location was denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0005,
        longitudeDelta: 0.0005,
      });
    };

    getLocation();

    // mock navigation instructions
    const instructionSequence = [
      { instruction: 'straight', distance: '50' },
      { instruction: 'turn-right', distance: '30' },
      { instruction: 'straight', distance: '100' },
      { instruction: 'turn-left', distance: '20' },
      { instruction: 'destination', distance: null },
    ];

    let currentIndex = 0;
    const instructionInterval = setInterval(() => {
      if (currentIndex < instructionSequence.length) {
        setCurrentInstruction(instructionSequence[currentIndex].instruction);
        setDistanceToNext(instructionSequence[currentIndex].distance);
        currentIndex++;
      } else {
        clearInterval(instructionInterval);
      }
    }, 1000000);

    return () => clearInterval(instructionInterval);
  }, []);

  return (
    <ScreenView
      title="truenavi"
      icons={[{ name: 'settings', onPress: () => router.push('/settings') }]}>
      <View style={styles.container}>
        <View style={styles.mapContainer}>
          {region && (
            <MapView
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

        <NavInstructions instruction={currentInstruction} distance={distanceToNext} />
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
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  destinationIcon: {
    fontSize: 24,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  destinationText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  instructionContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    gap: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  instructionIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  instructionIcon: {
    fontSize: 32,
    color: '#fff',
  },
  instructionTextContainer: {
    flex: 1,
  },
  instructionText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
  },
  distanceText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 4,
  },
});

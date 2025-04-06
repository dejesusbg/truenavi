import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Text, { fontStyle } from '~/components/Text';
import ScreenView from '~/components/ScreenView';
import { useRouter } from 'expo-router';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MapView from 'react-native-maps';
import * as Location from 'expo-location';

const Map = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selectedTool, setSelectedTool] = useState(null);
  const [region, setRegion] = useState<{
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  } | null>(null);

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
        longitudeDelta: 0,
      });
    };

    getLocation();
  }, []);

  const handleToolSelect = (tool: any) => {
    setSelectedTool(tool === selectedTool ? null : tool);
  };

  return (
    <ScreenView
      title="map"
      icons={[
        { name: 'admin-panel-settings', onPress: () => router.push('/admin') },
        { name: 'settings', onPress: () => router.push('/settings') },
      ]}
      goBack={true}
    >
      <View style={[styles.container, { paddingBottom: insets.bottom }]}>
        <View style={styles.mapContainer}>
          {region && (
            <MapView
              style={styles.map}
              region={region}
              userInterfaceStyle="dark"
              showsUserLocation
              showsCompass
              showsScale
            >
            </MapView>
          )}
          <View style={styles.mapOverlay}>
            <Text style={styles.mapInstructionText}>
              {selectedTool === 'add_node' && 'node added in your current location'}
              {selectedTool === 'add_connection' && 'select two nodes to create a connection'}
              {selectedTool === 'delete' && 'tap on a node or connection to delete it'}
              {!selectedTool && 'select a tool below to edit the map'}
            </Text>
          </View>
        </View>

        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              selectedTool === 'add_node' && styles.selectedButton
            ]}
            onPress={() => handleToolSelect('add_node')}
          >
            <MaterialIcons name="add-location" style={styles.actionButtonIcon} />
            <Text style={styles.actionButtonText}>node</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionButton,
              selectedTool === 'add_connection' && styles.selectedButton
            ]}
            onPress={() => handleToolSelect('add_connection')}
          >
            <MaterialIcons name="timeline" style={styles.actionButtonIcon} />
            <Text style={styles.actionButtonText}>connection</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionButton,
              selectedTool === 'delete' && styles.selectedDeleteButton
            ]}
            onPress={() => handleToolSelect('delete')}
          >
            <MaterialIcons name="delete" style={styles.actionButtonIcon} />
            <Text style={styles.actionButtonText}>delete</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <MaterialIcons name="place" style={styles.statIcon} />
            <Text style={styles.statText}>12 nodes</Text>
          </View>
          <View style={styles.statItem}>
            <MaterialIcons name="linear-scale" style={styles.statIcon} />
            <Text style={styles.statText}>18 connections</Text>
          </View>
        </View>
      </View>
    </ScreenView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
  },
  mapContainer: {
    flex: 1,
    borderRadius: 12,
    marginTop: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  mapOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 12,
  },
  mapInstructionText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    ...fontStyle,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    gap: 8,
  },
  selectedButton: {
    backgroundColor: 'rgba(129, 176, 255, 0.4)',
    borderWidth: 1,
    marginBottom: -2,
    borderColor: 'rgba(129, 176, 255, 0.8)',
  },
  selectedDeleteButton: {
    backgroundColor: 'rgba(255, 70, 70, 0.4)',
    borderWidth: 1,
    marginBottom: -2,
    borderColor: 'rgba(255, 70, 70, 0.8)',
  },
  actionButtonIcon: {
    fontSize: 24,
    color: '#fff',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    ...fontStyle,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statIcon: {
    fontSize: 20,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  statText: {
    color: '#fff',
    fontSize: 14,
    ...fontStyle,
  },
});

export default Map;
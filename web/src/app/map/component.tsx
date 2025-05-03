'use client';
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L, { LatLngExpression } from 'leaflet';
import { MdPlace, MdTimeline, MdDelete, MdLinearScale } from 'react-icons/md';
import 'leaflet/dist/leaflet.css';
import Card from '@/components/layout/Card';
import MapToolButton from '@/components/map/ToolButton';
import MapStatCounter from '@/components/map/StatCounter';

const defaultLocation = [11.2250879, -74.1866137] as LatLngExpression;

const sampleNodes = [
  { id: '1', position: [11.2244879, -74.1856137] },
  { id: '2', position: [11.2247679, -74.1860937] },
  { id: '3', position: [11.2242879, -74.1863737] },
  { id: '4', position: [11.2248479, -74.1862137] },
  { id: '5', position: [11.2252079, -74.1868137] },
  { id: '6', position: [11.2255379, -74.1873637] },
  { id: '7', position: [11.2250479, -74.1876137] },
];

const sampleEdges = [
  { from: '1', to: '2' },
  { from: '2', to: '3' },
  { from: '2', to: '4' },
  { from: '4', to: '5' },
  { from: '5', to: '6' },
  { from: '6', to: '7' },
  { from: '7', to: '3' },
];

const markerIcon = {
  location: new L.Icon({
    iconUrl: 'marker-location.png',
    iconSize: [16, 16] as L.PointTuple,
    iconAnchor: [8, 8] as L.PointTuple,
    popupAnchor: [0, -10] as L.PointTuple,
  }),
  pin: new L.Icon({
    iconUrl: 'marker-pin.png',
    iconSize: [32, 32] as L.PointTuple,
    iconAnchor: [16, 30] as L.PointTuple,
    popupAnchor: [0, -24] as L.PointTuple,
  }),
};

const MapComponent = () => {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [location, setLocation] = useState<LatLngExpression>(defaultLocation);

  useEffect(() => {
    const L = require('leaflet');
    delete L.Icon.Default.prototype._getIconUrl;

    L.Icon.Default.mergeOptions({
      iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
      iconUrl: require('leaflet/dist/images/marker-icon.png'),
      shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
    });
  }, []);

  useEffect(() => {
    const getLocation = async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setLocation([latitude, longitude]);
          },
          (error) => console.error('[Location] Not found:', error)
        );
      } else {
        alert('geolocation not supported');
      }
    };

    getLocation();
  }, []);

  const handleToolSelect = (tool: string) => {
    setSelectedTool(tool === selectedTool ? null : tool);
  };

  const getStatusMessage = () => {
    if (selectedTool === 'add_node') return 'tap on the map to create a new node';
    if (selectedTool === 'add_connection') return 'select two nodes to create a connection';
    if (selectedTool === 'delete') return 'tap on a node or connection to delete it';
    return 'select a tool below to edit the map';
  };

  return (
    <div className="relative flex-1 gap-4">
      {/* map container */}
      <div className="relative flex-1 overflow-hidden rounded-lg">
        {location && (
          <MapContainer
            center={location}
            zoom={18}
            maxZoom={24}
            style={{ height: '100%', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              maxNativeZoom={24}
              maxZoom={24}
            />
            <Marker position={location}>
              <Popup>current location</Popup>
            </Marker>

            {/* render graph nodes */}
            {sampleNodes.map((node) => (
              <Marker
                key={node.id}
                position={node.position as LatLngExpression}
                icon={markerIcon.pin}>
                <Popup>{node.id}</Popup>
              </Marker>
            ))}

            {/* render graph edges */}
            {sampleEdges.map((edge, index) => {
              const fromNode = sampleNodes.find((node) => node.id === edge.from);
              const toNode = sampleNodes.find((node) => node.id === edge.to);
              if (fromNode && toNode) {
                return (
                  <Polyline
                    key={index}
                    positions={[
                      fromNode.position as LatLngExpression,
                      toNode.position as LatLngExpression,
                    ]}
                    color="#3365a6"
                    weight={4}
                  />
                );
              }
              return null;
            })}
          </MapContainer>
        )}
        <div className="p-3 bg-overlay absolute z-[999] bottom-0 right-0 left-0 text-center">
          <p className="text-foreground-muted">{getStatusMessage()}</p>
        </div>
      </div>

      {/* tool buttons */}
      <div className="flex-row gap-4">
        <MapToolButton
          icon={<MdPlace />}
          label="new node"
          isSelected={selectedTool === 'add_node'}
          onClick={() => handleToolSelect('add_node')}
        />

        <MapToolButton
          icon={<MdTimeline />}
          label="new connection"
          isSelected={selectedTool === 'add_connection'}
          onClick={() => handleToolSelect('add_connection')}
        />

        <MapToolButton
          icon={<MdDelete />}
          label="delete"
          isSelected={selectedTool === 'delete'}
          onClick={() => handleToolSelect('delete')}
          isDanger={true}
        />
      </div>

      {/* stats */}
      <Card className="flex-row justify-around !p-3">
        <MapStatCounter icon={<MdPlace />} label="nodes" count={sampleNodes.length} />
        <MapStatCounter icon={<MdLinearScale />} label="connections" count={sampleEdges.length} />
      </Card>
    </div>
  );
};

export default MapComponent;

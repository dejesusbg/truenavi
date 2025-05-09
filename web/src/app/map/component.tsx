'use client';
import { Modal, ToolButton } from '@/components';
import { createEdge, createNode, deleteEdge, deleteNode, getGraph, GraphProps } from '@/services';
import L, { LatLng } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import { MdDelete, MdPlace, MdTimeline, MdVisibilityOff } from 'react-icons/md';
import { MapContainer, Marker, Polyline, Popup, useMap, useMapEvents } from 'react-leaflet';

const options = {
  container: {
    zoom: 18,
    center: L.latLng([11.2250879, -74.1866137]),
    maxBounds: L.latLngBounds(
      [11.22341846157125, -74.18857673557477],
      [11.228722952303627, -74.1833571620521]
    ),
  },
  tile: { maxNativeZoom: 20, maxZoom: 20, minNativeZoom: 18, minZoom: 18 },
  poly: { color: '#3365a6', opacity: 0.75, weight: 8 },
};

const layers = {
  streets: L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', options.tile),
  satellite: L.tileLayer(
    'https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.png',
    options.tile
  ),
};

const marker = {
  base: new L.Icon({
    iconUrl: 'marker-pin.png',
    iconSize: [36, 36],
    iconAnchor: [18, 32],
    popupAnchor: [0, -24],
  }),
  intermediate: new L.Icon({
    iconUrl: 'marker-location.png',
    iconSize: [12, 12],
    iconAnchor: [6, 6],
  }),
};

// event handler component for map interactions
function MapEvents({ onMapClick, selectedTool }: any) {
  const map = useMap();

  useEffect(() => {
    if (map && !map.hasLayer(layers.streets)) {
      L.control.layers(layers).addTo(map);
      layers.streets.addTo(map);
    }
  }, [map]);

  useMapEvents({
    click: (e) => {
      if (selectedTool === 'add_node') {
        onMapClick(e.latlng);
      }
    },
  });
  return null;
}

const MapComponent = () => {
  const [graph, setGraph] = useState<GraphProps>({ nodes: [], edges: [] });
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempNodeName, setTempNodeName] = useState('');
  const [tempNodeCoords, setTempNodeCoords] = useState<number[] | null>(null);
  const [selectedNodesId, setSelectedNodesId] = useState<string[]>([]);

  // fetch nodes and edges
  const fetchData = async () => {
    const res = await getGraph();
    if (res.edges && res.nodes) setGraph(res);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // handle tool selection - reset node selection when changing tools
  const handleToolSelect = (tool: string) => {
    setSelectedTool(tool === selectedTool ? null : tool);
    setSelectedNodesId([]);
  };

  // handle map click - for adding nodes
  const handleMapClick = (latlng: LatLng) => {
    if (selectedTool === 'add_node') {
      setTempNodeCoords([latlng.lat, latlng.lng]);
      setIsModalOpen(true);
    }
  };

  // create a new node
  const handleCreateNode = async () => {
    if (tempNodeCoords) {
      tempNodeName
        ? await createNode(tempNodeCoords, tempNodeName)
        : await createNode(tempNodeCoords);
      setIsModalOpen(false);
      setTempNodeName('');
      setTempNodeCoords(null);
      fetchData();
    }
  };

  // handle node selection - for connections or deletion
  const handleNodeClick = (nodeId: string) => {
    if (selectedTool === 'delete') handleDeleteNode(nodeId);
    else if (selectedTool === 'add_connection') handleNodeSelection(nodeId);
  };

  // handle node selection - for creating edges
  const handleNodeSelection = (nodeId: string) => {
    if (selectedNodesId.find((id) => id === nodeId)) {
      // deselect if already selected
      setSelectedNodesId(selectedNodesId.filter((id) => id !== nodeId));
    } else {
      // add to selection if not already two nodes selected
      if (selectedNodesId.length < 2) {
        const newSelectedNodes = [...selectedNodesId, nodeId];
        setSelectedNodesId(newSelectedNodes);
        // if we now have two nodes selected, create the edge
        if (newSelectedNodes.length === 2) {
          handleCreateEdge(newSelectedNodes[0], newSelectedNodes[1]);
        }
      }
    }
  };

  // create a new edge
  const handleCreateEdge = async (startNodeId: string, endNodeId: string) => {
    await createEdge(startNodeId, endNodeId);
    setSelectedNodesId([]);
    fetchData();
  };

  // delete a node - and any connected edges
  const handleDeleteNode = async (nodeId: string) => {
    if (confirm('do you really want to delete this node?')) {
      await deleteNode(nodeId);
      const connectedEdges = graph.edges.filter(
        (edge) => edge.start._id === nodeId || edge.end._id === nodeId
      );
      for (const edge of connectedEdges) {
        await deleteEdge(edge._id);
      }
      fetchData();
    }
  };

  // delete an edge
  const handleDeleteEdge = async (edgeId: string) => {
    if (selectedTool === 'delete') {
      if (confirm('do you really want to delete this edge?')) {
        await deleteEdge(edgeId);
        fetchData();
      }
    }
  };

  // get the status message
  const getStatusMessage = () => {
    if (selectedTool === 'add_node') return 'tap on the map to create a new node';
    if (selectedTool === 'add_connection') {
      if (selectedNodesId.length === 0) return 'select first node to start connection';
      if (selectedNodesId.length === 1) return 'select second node to complete connection';
      return 'creating connection';
    }
    if (selectedTool === 'hide_intermediate') return 'deselect to see intermediate nodes';
    if (selectedTool === 'delete') return 'tap on a node or connection to delete it';
    return 'select a tool in the sidebar to edit the map';
  };

  // check if a node is selected
  const isNodeSelected = (nodeId: string) => {
    return selectedNodesId.some((id) => id === nodeId);
  };

  return (
    <div className="relative flex-row flex-1 gap-4">
      {/* map container */}
      <div className="relative flex-1 overflow-hidden rounded-lg">
        <MapContainer className="w-full h-full" {...options.container}>
          <MapEvents onMapClick={handleMapClick} selectedTool={selectedTool} />

          {/* render graph nodes */}
          {graph.nodes.map(
            (node) =>
              (node.name || selectedTool !== 'hide_intermediate') && (
                <Marker
                  key={node._id}
                  position={node.coordinates}
                  icon={!node.name ? marker.intermediate : marker.base}
                  eventHandlers={{ click: () => handleNodeClick(node._id) }}
                  opacity={isNodeSelected(node._id) ? 0.6 : 1}>
                  {node.name && <Popup closeButton={false}>{node.name}</Popup>}
                </Marker>
              )
          )}

          {/* render graph edges */}
          {graph.edges.map((edge) => (
            <Polyline
              key={edge._id}
              positions={[edge.start.coordinates, edge.end.coordinates]}
              eventHandlers={{ click: () => handleDeleteEdge(edge._id) }}
              {...options.poly}
            />
          ))}
        </MapContainer>

        <div className="p-3 bg-overlay absolute z-[999] backdrop-blur-sm inset-x-0 bottom-0 text-center">
          <p className="text-foreground-muted">{getStatusMessage()}</p>
        </div>
      </div>

      {/* Tool buttons */}
      <div className="gap-4 mt-auto">
        <ToolButton
          icon={<MdPlace />}
          isSelected={selectedTool === 'add_node'}
          onClick={() => handleToolSelect('add_node')}
        />
        <ToolButton
          icon={<MdTimeline />}
          isSelected={selectedTool === 'add_connection'}
          onClick={() => handleToolSelect('add_connection')}
        />
        <ToolButton
          icon={<MdVisibilityOff />}
          isSelected={selectedTool === 'hide_intermediate'}
          onClick={() => handleToolSelect('hide_intermediate')}
        />
        <ToolButton
          icon={<MdDelete />}
          isSelected={selectedTool === 'delete'}
          onClick={() => handleToolSelect('delete')}
          isDanger={true}
        />
      </div>

      {/* modal for adding a new node */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setTempNodeName('');
        }}
        title="add new node"
        size="small">
        <div className="gap-4 pt-2">
          <div className="flex-row gap-4">
            <input
              type="text"
              className="w-full p-2 border rounded-md border-outline bg-container text-foreground"
              value={tempNodeName}
              onChange={(e) => setTempNodeName(e.target.value)}
              placeholder="enter node name"
              autoFocus
            />
            <button
              type="submit"
              className="px-4 py-2 text-white rounded-md bg-primary"
              onClick={handleCreateNode}>
              create
            </button>
          </div>
          {tempNodeCoords && (
            <div className="text-xs text-foreground-muted">
              location: {tempNodeCoords[0].toFixed(6)}, {tempNodeCoords[1].toFixed(6)}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default MapComponent;

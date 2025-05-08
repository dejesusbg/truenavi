'use client';
import { Modal, ToolButton } from '@/components';
import { createEdge, deleteEdge, EdgeProps, getEdges } from '@/services/edges';
import { createNode, deleteNode, getNodes, NodeProps } from '@/services/nodes';
import L, { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useRef, useState } from 'react';
import { MdDelete, MdPlace, MdTimeline, MdVisibilityOff } from 'react-icons/md';
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMapEvents } from 'react-leaflet';

const options = {
  container: {
    zoom: 18,
    zoomDelta: 0.25,
    zoomSnap: 0,
    center: L.latLng([11.2250879, -74.1866137]),
    maxBounds: L.latLngBounds(
      [11.22341846157125, -74.18857673557477],
      [11.228722952303627, -74.18335716205219]
    ),
  },
  tile: { maxNativeZoom: 20, maxZoom: 20, minNativeZoom: 18, minZoom: 18 },
  poly: { color: '#3365a6', opacity: 0.75, weight: 8 },
};

const marker = new L.Icon({
  iconUrl: 'marker-pin.png',
  iconSize: [36, 36],
  iconAnchor: [18, 32],
  popupAnchor: [0, -18],
});

const markerSm = new L.Icon({
  iconUrl: 'marker-location.png',
  iconSize: [12, 12] as L.PointTuple,
  iconAnchor: [6, 6] as L.PointTuple,
});

// event handler component for map interactions
function MapEvents({ onMapClick, selectedTool }: any) {
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
  const [selectedTool, setSelectedTool] = useState(null);
  const [nodes, setNodes] = useState<NodeProps[]>([]);
  const [edges, setEdges] = useState<EdgeProps[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nodeName, setNodeName] = useState('');
  const [tempNodeCoords, setTempNodeCoords] = useState<number[] | null>(null);
  const [selectedNodes, setSelectedNodes] = useState<NodeProps[]>([]);
  const mapRef = useRef(null);

  // load Leaflet icons
  useEffect(() => {
    const L = require('leaflet');
    delete L.Icon.Default.prototype._getIconUrl;

    L.Icon.Default.mergeOptions({
      iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
      iconUrl: require('leaflet/dist/images/marker-icon.png'),
      shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
    });
  }, []);

  // fetch nodes and edges
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const nodesRes = await getNodes();
    if (nodesRes.success && nodesRes.data) setNodes(nodesRes.data);

    const edgesRes = await getEdges();
    if (edgesRes.success && edgesRes.data) setEdges(edgesRes.data);
  };

  // handle tool selection
  const handleToolSelect = (tool: any) => {
    setSelectedTool(tool === selectedTool ? null : tool);
    // reset selection when changing tools
    setSelectedNodes([]);
  };

  // handle map click - for adding nodes
  const handleMapClick = (latlng: any) => {
    if (selectedTool === 'add_node') {
      setTempNodeCoords([latlng.lat, latlng.lng]);
      setIsModalOpen(true);
    }
  };

  // create a new node
  const handleCreateNode = async () => {
    if (tempNodeCoords) {
      nodeName ? await createNode(tempNodeCoords, nodeName) : await createNode(tempNodeCoords);
      setIsModalOpen(false);
      setNodeName('');
      setTempNodeCoords(null);
      fetchData();
    }
  };

  // handle node selection - for connections or deletion
  const handleNodeClick = (node: any) => {
    if (selectedTool === 'delete') {
      handleDeleteNode(node._id);
    } else if (selectedTool === 'add_connection') {
      handleNodeSelection(node);
    }
  };

  // handle node selection - for creating edges
  const handleNodeSelection = (node: any) => {
    if (selectedNodes.find((n) => n._id === node._id)) {
      // deselect if already selected
      setSelectedNodes(selectedNodes.filter((n) => n._id !== node._id));
    } else {
      // add to selection if not already two nodes selected
      if (selectedNodes.length < 2) {
        const newSelectedNodes = [...selectedNodes, node];
        setSelectedNodes(newSelectedNodes);
        // if we now have two nodes selected, create the edge
        if (newSelectedNodes.length === 2) {
          handleCreateEdge(newSelectedNodes[0], newSelectedNodes[1]);
        }
      }
    }
  };

  // create a new edge
  const handleCreateEdge = async (startNode: NodeProps, endNode: NodeProps) => {
    await createEdge(startNode._id, endNode._id);
    setSelectedNodes([]);
    fetchData();
  };

  // delete a node
  const handleDeleteNode = async (nodeId: string) => {
    await deleteNode(nodeId);
    // also need to delete any connected edges
    const connectedEdges = edges.filter(
      (edge) => edge.startNodeId._id === nodeId || edge.endNodeId._id === nodeId
    );
    for (const edge of connectedEdges) {
      await deleteEdge(edge._id);
    }
    fetchData();
  };

  // delete an edge
  const handleDeleteEdge = async (edgeId: string) => {
    if (selectedTool === 'delete') {
      await deleteEdge(edgeId);
      fetchData();
    }
  };

  // get the status message
  const getStatusMessage = () => {
    if (selectedTool === 'add_node') return 'tap on the map to create a new node';
    if (selectedTool === 'add_connection') {
      if (selectedNodes.length === 0) return 'select first node to start connection';
      if (selectedNodes.length === 1) return 'select second node to complete connection';
      return 'creating connection';
    }
    if (selectedTool === 'hide_intermediate') return 'deselect to see intermediate nodes';
    if (selectedTool === 'delete') return 'tap on a node or connection to delete it';
    return 'select a tool in the sidebar to edit the map';
  };

  // check if a node is selected
  const isNodeSelected = (nodeId: string) => {
    return selectedNodes.some((node) => node._id === nodeId);
  };

  return (
    <div className="relative flex-1 flex-row gap-4">
      {/* map container */}
      <div className="relative flex-1 overflow-hidden rounded-lg">
        <MapContainer className="h-full w-full" {...options.container} ref={mapRef}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" {...options.tile} />

          {/* map event handler */}
          <MapEvents onMapClick={handleMapClick} selectedTool={selectedTool} />

          {/* render graph nodes */}
          {nodes.map((node) =>
            (!node.name && selectedTool !== 'hide_intermediate') || node.name ? (
              <Marker
                key={node._id}
                position={node.coordinates as LatLngExpression}
                icon={!node.name ? markerSm : marker}
                eventHandlers={{
                  click: () => handleNodeClick(node),
                }}
                opacity={isNodeSelected(node._id) ? 0.6 : 1}>
                {node.name && <Popup>{node.name}</Popup>}
              </Marker>
            ) : null
          )}

          {/* render graph edges */}
          {edges.map((edge) => {
            const { startNodeId, endNodeId } = edge;
            const positions = [startNodeId.coordinates, endNodeId.coordinates];
            return (
              <Polyline
                key={edge._id}
                positions={positions as LatLngExpression[]}
                eventHandlers={{ click: () => handleDeleteEdge(edge._id) }}
                {...options.poly}
              />
            );
          })}
        </MapContainer>

        <div className="p-3 bg-overlay absolute z-[999] bottom-0 right-0 left-0 text-center">
          <p className="text-foreground-muted">{getStatusMessage()}</p>
        </div>
      </div>

      {/* Tool buttons */}
      <div className="mt-auto gap-4">
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
          setNodeName('');
        }}
        title="add new node"
        size="small"
        footer={
          <div className="gap-2">
            <button
              type="submit"
              className="px-4 py-2 text-white bg-primary rounded-md"
              onClick={handleCreateNode}>
              create
            </button>
            <button
              className="px-4 py-2 bg-outline text-white rounded-md"
              onClick={() => setIsModalOpen(false)}>
              cancel
            </button>
          </div>
        }>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-foreground">node name</label>
          <input
            type="text"
            className="w-full p-2 border border-outline rounded-md bg-container text-foreground"
            value={nodeName}
            onChange={(e) => setNodeName(e.target.value)}
            placeholder="enter node name"
            autoFocus
          />
        </div>
        {tempNodeCoords && (
          <div className="text-xs text-foreground-muted">
            location: {tempNodeCoords[0].toFixed(6)}, {tempNodeCoords[1].toFixed(6)}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MapComponent;

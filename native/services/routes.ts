import api, { Response } from '~/utils/api';

export interface NodeProps {
  _id: string;
  name: string;
  coordinates: number[];
  next: string;
  timestamp: string;
}

export interface RouteProps {
  totalDistance: number;
  path: any[];
  edges: any[];
}

export type NodesResponse = Response<NodeProps[]>;
export type RouteResponse = Response<RouteProps>;

export async function getNodes() {
  return await api.get<NodesResponse>('nodes');
}

export async function getNodesWithinRadius(lat: number, lng: number) {
  const distanceToRadius = 5; // TODO: check optimal radius
  return await api.get<NodesResponse>(`radius/${lat}/${lng}/${distanceToRadius}`);
}

export async function calculateRoute(startNodeId: string, endNodeId: string) {
  return await api.get<RouteResponse>(`routes/${startNodeId}/${endNodeId}`);
}

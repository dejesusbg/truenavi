import { api, Response } from '~/services/api';

export interface NodeProps {
  _id: string;
  coordinates: [number, number];
  name?: string;
}

export interface EdgeProps {
  _id: string;
  distance: number;
  startNodeId: NodeProps;
  endNodeId: NodeProps;
}

export interface RouteProps {
  totalDistance: number;
  path: NodeProps[];
  edges: EdgeProps[];
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

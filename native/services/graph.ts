import { api } from './api';
import { NodeProps, NodesResponse, RouteResponse } from './types';

export async function getNodes() {
  return await api.get<NodesResponse>('nodes');
}

export async function getNodesWithinRadius(lat: number, lng: number) {
  const distanceToRadius = 2; // TODO: check optimal radius
  return await api.get<NodesResponse>(`radius/${lat}/${lng}/${distanceToRadius}`);
}

export async function calculateRoute(startNodeId: string, endNodeId: string) {
  return await api.get<RouteResponse>(`routes/${startNodeId}/${endNodeId}`);
}

export async function getPlaces(): Promise<NodeProps[]> {
  const res = await getNodes();
  if (res.success && res.data) {
    return res.data.filter((node) => node.name !== undefined);
  }
  return [];
}

export async function getPlacesNames(): Promise<string[]> {
  const res = await getPlaces();
  return res.map((node) => node.name as string);
}

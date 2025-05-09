import { api } from './api';
import { NodesResponse, RouteResponse } from './types';

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

export async function getPlaces(): Promise<string[]> {
  const res = await getNodes();

  if (res.success && res.data) {
    return res.data.map((node) => node.name).filter((name) => name !== undefined);
  }

  return [];
}

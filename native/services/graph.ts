import { LocationObjectCoords } from 'expo-location';
import { api } from './api';
import { NodeProps, NodesResponse, RouteResponse } from './types';

export async function getNodes() {
  return await api.get<NodesResponse>('nodes');
}

// TODO: check optimal radius
export async function getNodesWithinRadius(lat: number, lng: number, radius: number = 2) {
  return await api.get<NodesResponse>(`radius/${lat}/${lng}/${radius}`);
}

export async function calculateRoute(startNodeId: string, endNodeId: string) {
  return await api.get<RouteResponse>(`routes/${startNodeId}/${endNodeId}`);
}

export async function getPlaces(): Promise<string[]> {
  const res = await getNodes();
  if (!res.success || !res.data) return [];
  return res.data.flatMap((node) => (node.name ? [node.name as string] : []));
}

export async function findPlace(name: string): Promise<NodeProps | undefined> {
  const res = await getNodes();
  if (!res.success || !res.data) return undefined;
  return res.data.find((node) => node.name === name);
}

export async function findClosest(coords: LocationObjectCoords): Promise<NodeProps | undefined> {
  const res = await getNodes();
  if (!res.success || !res.data) return undefined;

  const places = res.data.filter((node) => node.name !== undefined);
  const { latitude, longitude } = coords;

  return places.reduce(
    (closest, place) => {
      const [lat, lon] = place.coordinates;
      const distance = Math.sqrt(Math.pow(lat - latitude, 2) + Math.pow(lon - longitude, 2));
      return distance < closest.distance ? { node: place, distance } : closest;
    },
    { node: places[0], distance: Infinity }
  ).node;
}

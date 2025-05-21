import { LocationObjectCoords } from 'expo-location';
import { api } from './api';
import { NodeProps, NodesResponse, RouteResponse } from './types';

const NODES_OPTIMAL_RADIUS = 0.2; // km

async function getNodes() {
  return await api.get<NodesResponse>('nodes');
}

async function getNodesWithinRadius(lat: number, lng: number) {
  return await api.get<NodesResponse>(`radius/${lat}/${lng}/${NODES_OPTIMAL_RADIUS}`);
}

/**
 * Calculates a route between two nodes by their IDs.
 *
 * @param startNodeId - The unique identifier of the starting node.
 * @param endNodeId - The unique identifier of the ending node.
 * @returns A promise that resolves to a `RouteResponse` containing the calculated route information.
 */
export async function calculateRoute(startNodeId: string, endNodeId: string) {
  return await api.get<RouteResponse>(`routes/${startNodeId}/${endNodeId}`);
}

/**
 * Retrieves a list of place names from the graph nodes.
 *
 * Calls the `getNodes` function to fetch node data, then extracts and returns
 * the `name` property from each node as a string, filtering out nodes without a name.
 * If the fetch is unsuccessful or no data is returned, an empty array is returned.
 *
 * @returns A promise that resolves to an array of place names.
 */
export async function getPlaces(): Promise<string[]> {
  const res = await getNodes();
  if (!res.success || !res.data) return [];
  return res.data.flatMap((node) => (node.name ? [node.name as string] : []));
}

/**
 * Finds and returns a node by its name.
 *
 * @param name - The name of the node to search for.
 * @returns A promise that resolves to the matching `NodeProps` object if found, or `undefined` if not found or if the node data could not be retrieved.
 */
export async function findPlace(name: string): Promise<NodeProps | undefined> {
  const res = await getNodes();
  if (!res.success || !res.data) return undefined;
  return res.data.find((node) => node.name === name);
}

/**
 * Finds the closest node to the given coordinates.
 *
 * Retrieves a list of nodes, filters out those without a name, and calculates the Euclidean distance between each node's coordinates and the provided coordinates. Returns the node that is closest to the specified location.
 *
 * @param coords - The coordinates to compare against, containing latitude and longitude.
 * @returns A promise that resolves to the closest node (`NodeProps`) or `undefined` if no nodes are found or retrieval fails.
 */
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

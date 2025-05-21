import { api } from './api';
import { EdgesResponse, GraphProps, NodesResponse } from './types';

/**
 * Retrieves all nodes from the API.
 * @returns A promise that resolves to the API response.
 */
async function getNodes() {
  return await api.get<NodesResponse>('nodes');
}

/**
 * Creates a new node with the specified coordinates and optional name.
 * @param coordinates - The coordinates of the node.
 * @param name - The optional name of the node.
 * @returns A promise that resolves to the API response.
 */
export async function createNode(coordinates: number[], name?: string) {
  return await api.post<NodesResponse>('nodes', { coordinates, name });
}

/**
 * Deletes a node by its ID.
 * @param _id - The ID of the node to delete.
 * @returns A promise that resolves to the API response.
 */
export async function deleteNode(_id: string) {
  return await api.del<NodesResponse>('nodes/' + _id);
}

/**
 * Retrieves all edges from the API.
 * @returns A promise that resolves to the API response.
 */
async function getEdges() {
  const res = await api.get<EdgesResponse>('edges');

  if (res.success && res.data) {
    res.data.forEach((edge) => {
      edge.start = edge.startNodeId;
      edge.end = edge.endNodeId;
    });
  }

  return res;
}

/**
 * Creates a new edge between two nodes.
 * @param startNodeId - The ID of the starting node.
 * @param endNodeId - The ID of the ending node.
 * @returns A promise that resolves to the API response.
 */
export async function createEdge(startNodeId: string, endNodeId: string) {
  return await api.post<EdgesResponse>('edges', { startNodeId, endNodeId });
}

/**
 * Deletes an edge by its ID.
 * @param _id - The ID of the edge to delete.
 * @returns A promise that resolves to the API response.
 */
export async function deleteEdge(_id: string) {
  return await api.del<EdgesResponse>(`edges/${_id}`);
}

/**
 * Retrieves the graph data, including nodes and edges.
 * @returns A promise that resolves to the graph data.
 */
export async function getGraph(): Promise<GraphProps> {
  const nodeRes = await getNodes();
  const edgeRes = await getEdges();

  return {
    edges: edgeRes.success && edgeRes.data ? edgeRes.data : [],
    nodes: nodeRes.success && nodeRes.data ? nodeRes.data : [],
  };
}

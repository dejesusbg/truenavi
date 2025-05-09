import { api } from './api';
import { EdgesResponse, GraphProps, NodesResponse } from './types';

export async function getNodes() {
  return await api.get<NodesResponse>('nodes');
}

export async function createNode(coordinates: number[], name?: string) {
  return await api.post<NodesResponse>('nodes', { coordinates, name });
}

export async function deleteNode(_id: string) {
  return await api.del<NodesResponse>('nodes/' + _id);
}
export async function getEdges() {
  const res = await api.get<EdgesResponse>('edges');

  if (res.success && res.data) {
    res.data.forEach((edge) => {
      edge.start = edge.startNodeId;
      edge.end = edge.endNodeId;
    });
  }

  return res;
}

export async function createEdge(startNodeId: string, endNodeId: string) {
  return await api.post<EdgesResponse>('edges', { startNodeId, endNodeId });
}

export async function deleteEdge(_id: string) {
  return await api.del<EdgesResponse>(`edges/${_id}`);
}

export async function getGraph(): Promise<GraphProps> {
  const nodeRes = await getNodes();
  const edgeRes = await getEdges();

  return {
    edges: edgeRes.success && edgeRes.data ? edgeRes.data : [],
    nodes: nodeRes.success && nodeRes.data ? nodeRes.data : [],
  };
}

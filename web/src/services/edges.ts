import { api, Response } from '@/services/api';
import { NodeProps } from '@/services/nodes';

export interface EdgeProps {
  _id: string;
  distance: number;
  startNodeId: NodeProps;
  endNodeId: NodeProps;
}

export type EdgesResponse = Response<EdgeProps[]>;

export async function getEdges() {
  return await api.get<EdgesResponse>('edges');
}

export async function createEdge(startNodeId: string, endNodeId: string) {
  return await api.post<EdgesResponse>('edges', { startNodeId, endNodeId });
}

export async function deleteEdge(_id: string) {
  return await api.del<EdgesResponse>(`edges/${_id}`);
}

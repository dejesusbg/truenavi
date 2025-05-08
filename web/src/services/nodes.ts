import { api, Response } from '@/services/api';

export interface NodeProps {
  _id: string;
  coordinates: number[];
  name?: string;
}

export type NodesResponse = Response<NodeProps[]>;

export async function getNodes() {
  return await api.get<NodesResponse>('nodes');
}

export async function createNode(coordinates: number[], name?: string) {
  return await api.post<NodesResponse>('nodes', { coordinates, name });
}

export async function deleteNode(_id: string) {
  return await api.del<NodesResponse>('nodes/' + _id);
}

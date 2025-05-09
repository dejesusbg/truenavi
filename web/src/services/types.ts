// model
export interface AdminProps {
  _id: string;
  name: string;
  email: string;
  password: string;
}

export interface NodeProps {
  _id: string;
  coordinates: [number, number];
  name?: string;
}

export interface EdgeProps {
  _id: string;
  start: NodeProps;
  startNodeId: NodeProps;
  distance: number;
  endNodeId: NodeProps;
  end: NodeProps;
}

export interface GraphProps {
  edges: EdgeProps[];
  nodes: NodeProps[];
}

export interface Response<T> {
  success: boolean;
  token: string;
  count?: number;
  error?: string;
  data?: T;
}

// api responses
export type AuthResponse = Response<any>;
export type NodesResponse = Response<NodeProps[]>;
export type EdgesResponse = Response<EdgeProps[]>;
export type AdminResponse = Response<AdminProps[]>;

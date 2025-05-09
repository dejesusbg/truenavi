// model
export interface PreferencesProps {
  spanish?: boolean;
  weather?: boolean;
  vibration?: boolean;
  isFirstTime?: boolean;
}

export interface NodeProps {
  _id: string;
  coordinates: [number, number];
  name?: string;
}

export interface EdgeProps {
  _id: string;
  distance: number;
  startNodeId: NodeProps;
  start: NodeProps;
  endNodeId: NodeProps;
  end: NodeProps;
}

export interface RouteProps {
  edges: EdgeProps[];
  totalDistance: number;
  path: NodeProps[];
}

// api responses
interface Response<T> {
  success: boolean;
  count?: number;
  error?: string;
  data?: T;
}

export type PreferencesResponse = Response<PreferencesProps>;
export type NodesResponse = Response<NodeProps[]>;
export type RouteResponse = Response<RouteProps>;
